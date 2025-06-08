"use client";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import MainFooter from "../../_components/footer/mainFooter";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import { BUSINESS_PHONE_NUMBER, PUBLIC, BUSINESS_NAME } from "../../_lib/constant";
import WhatsAppFloatButton from "../../_components/buttons/whatsapp";

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export default function AboutUsPage() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Head>
        <title>Sobre Nosotros | {BUSINESS_NAME}</title>
        <meta
          name="description"
          content={`Con más de 10 años de experiencia, ${BUSINESS_NAME} es tu solución confiable para reparación de celulares, PCs y notebooks. Conoce nuestro equipo y valores.`}
        />
      </Head>

      <MainNavigationBar type={PUBLIC} />

      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre {BUSINESS_NAME}
            </h1>
            <p className="text-xl md:text-2xl">
              Más de una década brindando soluciones tecnológicas con excelencia
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Quiénes Somos
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
              <div className="w-full md:w-1/2">
                <div className="w-full max-w-md h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                  <div className="relative h-[100%] w-[100%] overflow-hidden">
                    <Image
                      src={`${NEXT_PUBLIC_S3_BASE_URL}/images/business/tienda-online-banner.jpg`}
                      alt={"tienda-online-banner"}
                      fill
                    />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Nuestra Historia
                </h3>
                <p className="text-gray-600 mb-4">
                  {BUSINESS_NAME} nació hace más de 10 años con una misión
                  clara: ofrecer servicios de calidad en reparación de
                  dispositivos electrónicos, con un enfoque centrado en la
                  satisfacción del cliente.
                </p>
                <p className="text-gray-600">
                  Nuestros años de trayectoria nos han permitido adquirir una
                  vasta experiencia en el sector, convirtiéndonos en un
                  referente en reparación de celulares, PCs y notebooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nuestros Valores
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Confianza
                </h3>
                <p className="text-gray-600">
                  Construimos relaciones duraderas basadas en la transparencia y
                  honestidad en cada servicio que ofrecemos.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Seriedad
                </h3>
                <p className="text-gray-600">
                  Nos comprometemos con la formalidad en cada proceso,
                  cumpliendo plazos y manteniendo altos estándares
                  profesionales.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Compromiso
                </h3>
                <p className="text-gray-600">
                  Nos dedicamos completamente a cada trabajo, garantizando
                  resultados óptimos y buscando siempre superar las
                  expectativas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Satisfacción al Cliente
                </h3>
                <p className="text-gray-600">
                  El bienestar y la satisfacción de nuestros clientes es nuestra
                  prioridad número uno en cada servicio y producto que
                  ofrecemos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nuestros Servicios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Reparación de Celulares
                </h3>
                <p className="text-gray-600">
                  Arreglamos pantallas, baterías, placas y todo tipo de
                  problemas en dispositivos móviles de todas las marcas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Reparación de PCs
                </h3>
                <p className="text-gray-600">
                  Diagnóstico y solución de problemas de hardware y software,
                  actualización de componentes y mantenimiento preventivo.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Reparación de Notebooks
                </h3>
                <p className="text-gray-600">
                  Especialistas en solucionar problemas de portátiles:
                  pantallas, teclados, placas madre y recuperación de datos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nuestro Equipo Calificado
            </h2>

            <div className="mb-8">
              <p className="text-gray-600 text-center mb-8">
                Contamos con profesionales certificados y con amplia experiencia
                en el sector tecnológico, comprometidos con ofrecer el mejor
                servicio y atención personalizada a cada cliente.
              </p>

              <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">
                    Imagen del equipo técnico
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Necesitas ayuda con tus dispositivos?
            </h2>
            <p className="text-xl mb-8">
              Confía en nuestros más de 10 años de experiencia para solucionar
              cualquier problema tecnológico
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${BUSINESS_PHONE_NUMBER}?text=Hola%20*C%20La%20Red*,%20acabo%20de%20visitar%20su%20sitio%20web%20y%20me%20gustaría%20contatarlos%20por%20una%20repación.%20*Podrían%20escribirme%20a%20la%20brevedad?*%20Muchas%20Gracias.%0A`}
                target="blanck"
                className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contáctanos
              </a>
              <Link
                href="category/service"
                className="inline-block bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Ver servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFloatButton phoneNumber={BUSINESS_PHONE_NUMBER} />

      <MainFooter />
    </div>
  );
}
