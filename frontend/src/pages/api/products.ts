import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Proxy request to your backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const queryParams = new URLSearchParams();
    
    // Only add non-empty query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        queryParams.append(key, value);
      }
    });
    
    const url = `${backendUrl}/api/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    console.log(`[API Proxy] Attempting to fetch from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Frontend-API-Proxy/1.0',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API Proxy] Successfully fetched ${data.products?.length || 0} products from backend`);
    res.status(200).json(data);
  } catch (error) {
    console.warn('[API Proxy] Backend unavailable, returning sample data. Error:', error);
    
    // Return sample data if backend is not available
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
      ]
    };

    res.status(200).json(sampleData);
  }
}
