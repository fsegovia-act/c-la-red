"use client";

import MainFooter from "../../_components/footer/mainFooter";
import MainNavigationBar from "../../_components/navigation/mainNavigationBar";
import { PUBLIC } from "../../_lib/constant";

export default function SignInPage() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <MainNavigationBar type={PUBLIC} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sign In Page (public)</h1>
      </div>

      <MainFooter />
    </div>
  );
}
