const Footer = () => {
  return (
    <footer className="bg-green-50 text-green-800 text-center p-6 mt-16">
      <p className="text-sm">
        © {new Date().getFullYear()} LoQuePida – Mercado en línea. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
