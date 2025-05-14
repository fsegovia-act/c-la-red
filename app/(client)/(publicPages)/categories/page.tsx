"use client";

import { NextPage } from "next";
import { useParams } from "next/navigation";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import MainFooter from "../../_components/footer/mainFooter";
import CategoryBanner from "../../_components/banner/categoryBanner";
import AdditionalInformationBanner from "../../_components/banner/additionalInformationBanner";
import NewslatterBanner from "../../_components/banner/newslatterBanner";
import { PUBLIC } from "../../_lib/constant";

const CategoriesPage: NextPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <MainNavigationBar type={PUBLIC} />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Categories</h1>
        </div>

        <CategoryBanner featuredCategories={false} />

        <AdditionalInformationBanner />

        <NewslatterBanner />

        <MainFooter />
      </div>
    </>
  );
};

export default CategoriesPage;
