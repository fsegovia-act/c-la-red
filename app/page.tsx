"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import MainNavigationBar from "./(client)/_components/navigation/mainNavigationBar";
import MainBanner from "./(client)/_components/banner/mainBanner";
import CategoryBanner from "./(client)/_components/banner/categoryBanner";
import FeaturedProductsBanner from "./(client)/_components/banner/featuredProductsBanner";
import SpecialOffersBanner from "./(client)/_components/banner/specialOffersBanner";
import AdditionalInformationBanner from "./(client)/_components/banner/additionalInformationBanner";
import NewslatterBanner from "./(client)/_components/banner/newslatterBanner";
import MainFooter from "./(client)/_components/footer/mainFooter";
import { BUSINESS_NAME } from "./(client)/_lib/constant";

const HomePage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{BUSINESS_NAME} | Tienda Online | Inicio</title>
        <meta
          name="description"
          content="Encuentra los mejores productos para ti"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainNavigationBar />

      <main>
        <MainBanner />

        <CategoryBanner />

        <FeaturedProductsBanner />

        <SpecialOffersBanner />

        <AdditionalInformationBanner />

        <NewslatterBanner />
      </main>

      <MainFooter />
    </div>
  );
};

export default HomePage;
