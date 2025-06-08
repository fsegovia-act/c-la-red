"use client";

import { NextPage } from "next";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import MainFooter from "../../_components/footer/mainFooter";
import SpecialOffersBanner from "../../_components/banner/specialOffersBanner";
import AdditionalInformationBanner from "../../_components/banner/additionalInformationBanner";
import NewslatterBanner from "../../_components/banner/newslatterBanner";
import { BUSINESS_PHONE_NUMBER, PUBLIC } from "../../_lib/constant";
import WhatsAppFloatButton from "../../_components/buttons/whatsapp";

const OffersPage: NextPage = () => {
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <MainNavigationBar type={PUBLIC} />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Offers</h1>
        </div>

        <SpecialOffersBanner />

        <AdditionalInformationBanner />

        <NewslatterBanner />

        <WhatsAppFloatButton phoneNumber={BUSINESS_PHONE_NUMBER} />

        <MainFooter />
      </div>
    </>
  );
};

export default OffersPage;
