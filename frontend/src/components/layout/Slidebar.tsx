const Sidebar = () => {
  return (
    <aside className="w-64 bg-white/50 backdrop-blur-md p-4 rounded-lg shadow-lg">
      <h2 className="font-bold text-lg mb-4">Categorías</h2>
      <ul className="space-y-2">
        <li className="hover:text-green-600 cursor-pointer">Alimentos</li>
        <li className="hover:text-green-600 cursor-pointer">Juguetes</li>
        <li className="hover:text-green-600 cursor-pointer">Accesorios</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
