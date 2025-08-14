import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('[Supabase API] Fetching products from Supabase...');
    console.log('[Supabase API] Supabase URL:', supabaseUrl);
    console.log('[Supabase API] Service key configured:', !!supabaseServiceKey);
    console.log('[Supabase API] Service key length:', supabaseServiceKey?.length || 0);
    console.log('[Supabase API] Using service role key to bypass RLS');

    // First, let's try a simple query to test if we can access the products table at all
    let query = supabase
      .from('products')
      .select('*');

    // Don't filter by is_active initially to test if we can read any data
    if (req.query.test_mode !== 'true') {
      query = query.eq('is_active', true);
    }

    // Apply additional filters based on query params
    if (req.query.category_id) {
      query = query.eq('category_id', req.query.category_id);
    }
    
    if (req.query.seller_id) {
      query = query.eq('seller_id', req.query.seller_id);
    }

    if (req.query.is_featured) {
      query = query.eq('is_featured', req.query.is_featured === 'true');
    }

    // Add ordering
    query = query.order('created_at', { ascending: false });

    // Add limit if specified
    if (req.query.limit) {
      const limit = parseInt(req.query.limit as string, 10);
      if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase API] Error fetching products:', error);
      console.error('[Supabase API] This likely means RLS policies need to be applied');
      throw error;
    }

    console.log(`[Supabase API] Successfully fetched ${data?.length || 0} products`);

    res.status(200).json({
      products: data || [],
      success: true,
      source: 'supabase'
    });

  } catch (error) {
    console.error('[Supabase API] Error:', error);
    
    // Return sample data as fallback
    const sampleData = {
      products: [
        {
          id: '1',
          name: 'Sample Smartphone',
          description: 'A high-quality smartphone with excellent features',
          short_description: 'Premium smartphone for everyday use',
          slug: 'sample-smartphone',
          sku: 'PHONE001',
          price: 799.99,
          compare_price: 899.99,
          cost_price: 600.00,
          category_id: 'electronics',
          seller_id: 'sample-seller',
          condition: 'NEW',
          brand: 'TechBrand',
          model: 'X1 Pro',
          weight: 0.18,
          dimensions: { width: 7.5, height: 15.2, depth: 0.8 },
          images: ['/images/smartphone-sample.jpg'],
          tags: ['electronics', 'mobile', 'smartphone'],
          meta_title: 'Sample Smartphone - TechBrand X1 Pro',
          meta_description: 'Premium smartphone with advanced features',
          is_active: true,
          is_featured: true,
          track_quantity: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          short_description: 'Premium wireless audio experience',
          slug: 'wireless-headphones',
          sku: 'AUDIO001',
          price: 249.99,
          compare_price: 299.99,
          cost_price: 180.00,
          category_id: 'electronics',
          seller_id: 'sample-seller',
          condition: 'NEW',
          brand: 'AudioTech',
          model: 'ANC Pro',
          weight: 0.25,
          dimensions: { width: 18, height: 20, depth: 8 },
          images: ['/images/headphones-sample.jpg'],
          tags: ['electronics', 'audio', 'wireless'],
          meta_title: 'Wireless Headphones - AudioTech ANC Pro',
          meta_description: 'Premium wireless headphones with active noise cancellation',
          is_active: true,
          is_featured: true,
          track_quantity: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ],
      success: false,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    res.status(200).json(sampleData);
  }
}
