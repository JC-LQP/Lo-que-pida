import Link from 'next/link';
import { FiShoppingCart, FiUser } from 'react-icons/fi'; // iconos minimalistas

const Header = () => {
  return (
    <header className="backdrop-blur-md bg-white/30 sticky top-0 z-50 shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold text-green-800">LoQuePida</h1>
      </Link>

      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>

      <div className="flex items-center gap-6">
        <Link href="/cart">
          <FiShoppingCart className="text-xl text-gray-700 hover:text-green-500 transition-colors" />
        </Link>
        <Link href="/profile">
          <FiUser className="text-xl text-gray-700 hover:text-green-500 transition-colors" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
