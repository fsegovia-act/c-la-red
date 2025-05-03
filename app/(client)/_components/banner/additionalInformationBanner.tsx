"use client";

const AdditionalInformationBanner = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Por qué elegirnos
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Somos líderes en el mercado con años de experiencia brindando los
          mejores productos y servicios
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl text-blue-700 mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Envío Gratis
            </h3>
            <p className="text-gray-600">
              En todas tus compras superiores a $9999. Entrega en tiempo récord.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl text-blue-700 mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Pago Seguro
            </h3>
            <p className="text-gray-600">
              Todos los métodos de pago disponibles con la mayor seguridad.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl text-blue-700 mb-4">↩️</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Devolución Garantizada
            </h3>
            <p className="text-gray-600">
              Si no estás satisfecho, te devolvemos tu dinero.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AdditionalInformationBanner;
