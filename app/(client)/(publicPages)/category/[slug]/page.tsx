"use client";

import { NextPage } from "next";
import { useParams } from "next/navigation";
import MainNavigationBar from "../../../_components/navigation/mainNavigationBar";
import MainFooter from "../../../_components/footer/mainFooter";
import { PUBLIC } from "../../../_lib/constant";

const CategoryPage: NextPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <MainNavigationBar type={PUBLIC} />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Category {slug} Page (public)
          </h1>
        </div>

        <MainFooter />
      </div>
    </>
  );
};

export default CategoryPage;
