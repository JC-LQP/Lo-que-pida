import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
export declare class CategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(input: CreateCategoryInput): Promise<Category>;
    findAllCategories(): Promise<Category[]>;
    findOneCategory(id: string): Promise<Category>;
    updateCategory(id: string, input: UpdateCategoryInput): Promise<Category>;
    removeCategory(id: string): Promise<boolean>;
}
