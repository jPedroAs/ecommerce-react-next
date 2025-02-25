import '../Home/index.css'
import Navbar from "../../components/NavBar";

function Home() {

  const products = [
    { id: 1, name: "Produto 1", price: "R$ 100,00", image: "/cami.jpeg" },
    { id: 2, name: "Produto 2", price: "R$ 150,00", image: "/cami.jpeg" },
    { id: 3, name: "Produto 3", price: "R$ 200,00", image: "/cami.jpeg" },
    { id: 4, name: "Produto 4", price: "R$ 250,00", image: "/cami.jpeg" },
  ];
  return (
    <div className='block bg-white min-h-screen'>
      <Navbar />
      <div className="container mx-auto py-10 flex flex-col h-full">
        <h2 className="text-center text-2xl font-bold mb-6">Nossos Produtos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
              {/* <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-md"
              /> */}
              <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
              <p className="text-blue-600 font-bold">{product.price}</p>
              <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;