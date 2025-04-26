"use client";

import { NextPage } from "next";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import MainFooter from "../../_components/footer/mainFooter";

const OffersPage: NextPage = () => {
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <MainNavigationBar />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Offers Page (public)
          </h1>
        </div>

        <MainFooter />
      </div>
    </>
  );
};

export default OffersPage;
