"use client";

import MainFooter from "../../_components/footer/mainFooter";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <MainNavigationBar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us Page (public)</h1>
      </div>

      <MainFooter />
    </div>
  );
}
