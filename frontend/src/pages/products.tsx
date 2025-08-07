import { gql, useQuery } from '@apollo/client';
import client from '@/lib/apollo-client';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      description
    }
  }
`;

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function ProductsPage() {
  const { loading, error, data } = useQuery(GET_PRODUCTS, { client });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Productos aañadidos</h1>
      <ul className="space-y-4">
        {data.products.map((product: Product) => (
          <li key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="mt-2 text-green-600 font-bold">${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
