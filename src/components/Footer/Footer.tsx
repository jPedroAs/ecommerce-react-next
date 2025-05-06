// components/Footer.tsx
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#123D72] text-white py-10 mt-20 overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo e Descrição */}
        <div>
          <h1 className="text-2xl font-bold mb-4">UniStores</h1>
          <p className="text-sm opacity-75">
            Soluções modernas e eficientes para o seu negócio. Conecte-se ao futuro com a gente.
          </p>
        </div>

        {/* Links Rápidos */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="https://unistores.vercel.app/Catalog" className="hover:underline">Início</a></li>
            <li><a href="https://unistores.vercel.app/ForgotPassword" className="hover:underline">Mudar Senha</a></li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contato</h2>
          <p className="text-sm">Email: unistoreapi@gmail.com </p>
        </div>

        {/* Redes Sociais */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Siga-nos</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-400"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-300"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-10 opacity-50">
        © {new Date().getFullYear()} UniStores. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
