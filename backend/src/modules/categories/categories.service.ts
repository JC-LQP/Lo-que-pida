import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../common/dto/categories/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // Validate parent category if provided
      if (createCategoryDto.parentId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: { id: createCategoryDto.parentId },
        });

        if (!parentCategory) {
          throw new NotFoundException('Parent category not found');
        }
      }

      const category = await this.prisma.category.create({
        data: createCategoryDto,
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        parent: true,
        children: {
          include: {
            children: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        { parentId: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories;
  }

  async findRootCategories() {
    const categories = await this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        products: {
          where: {
            isActive: true,
          },
          take: 12,
          include: {
            seller: {
              include: {
                user: {
                  select: {
                    displayName: true,
                  },
                },
              },
            },
            inventory: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Prevent circular references
    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      const parentCategory = await this.prisma.category.findUnique({
        where: { id: updateCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }

      // Check if the new parent is a descendant of this category
      const isDescendant = await this.isDescendantOf(updateCategoryDto.parentId, id);
      if (isDescendant) {
        throw new BadRequestException('Cannot set a descendant as parent');
      }
    }

    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      return category;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async remove(id: string) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (existingCategory.children.length > 0) {
      throw new BadRequestException('Cannot delete category with child categories');
    }

    if (existingCategory._count.products > 0) {
      throw new BadRequestException('Cannot delete category with associated products');
    }

    try {
      await this.prisma.category.delete({
        where: { id },
      });

      return { message: `Category with ID ${id} has been deleted` };
    } catch (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  async getCategoryHierarchy() {
    const categories = await this.findRootCategories();
    return this.buildCategoryTree(categories);
  }

  private async isDescendantOf(categoryId: string, ancestorId: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { parentId: true },
    });

    if (!category || !category.parentId) {
      return false;
    }

    if (category.parentId === ancestorId) {
      return true;
    }

    return this.isDescendantOf(category.parentId, ancestorId);
  }

  private buildCategoryTree(categories: any[]): any[] {
    return categories.map(category => ({
      ...category,
      path: this.buildCategoryPath(category),
      level: this.calculateCategoryLevel(category),
    }));
  }

  private buildCategoryPath(category: any, path: string[] = []): string {
    if (category.parent) {
      return this.buildCategoryPath(category.parent, [category.parent.name, ...path]);
    }
    return [...path, category.name].join(' > ');
  }

  private calculateCategoryLevel(category: any): number {
    let level = 0;
    let current = category;

    while (current.parent) {
      level++;
      current = current.parent;
    }

    return level;
  }
}
