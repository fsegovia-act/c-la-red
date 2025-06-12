"use client";

import { useState } from "react";

const NewslatterBanner = () => {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validateEmail(e.target.value)) {
      setErrorMessage("");
    } else {
      setErrorMessage("Ingresa un correo valido");
    }
  };

  const handleSubmit = async () => {
    if (errorMessage) return;
    try {
      setLoading(true);
      const res = await fetch("/api/sale-leads", {
        method: "POST",
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setErrorMessage(data.message || "Failed to create product");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  
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
              onChange={(e) => onChange(e)}
              className="flex-1 px-4 py-3 rounded-l text-white focus:outline-none border-1 border-white"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || success}
              className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-r hover:bg-yellow-500 transition duration-300 border-1 border-white hover:cursor-pointer"
            >
              {!loading && !success && "Suscribirse"}
              {loading && "Enviando..."}
              {success && "Suscripto ✅"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default NewslatterBanner;
