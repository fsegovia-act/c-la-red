"use client";

const NewslatterBanner = () => {
  return (
    <section className="bg-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">
            ¿Quieres recibir nuestras ofertas?
          </h2>
          <p className="mb-6">
            Suscríbete a nuestro newsletter y recibe cupones de descuento.
          </p>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-l text-white focus:outline-none border-1 border-white"
            />
            <button className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-r hover:bg-yellow-500 transition duration-300 border-1 border-white">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default NewslatterBanner;
