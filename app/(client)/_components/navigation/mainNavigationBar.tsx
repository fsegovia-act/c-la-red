"use client";

import Link from "next/link";
import { BUSINESS_NAME } from "../../_lib/constant";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./logo/Logo";
import MobileMenu from "./menu/MobileMenu";
import {
  PUBLIC_MENU_ITEMS,
  PRIVATE_MENU_ITEMS,
  PUBLIC,
  PRIVATE,
} from "../../_lib/constant";
import DesktopNavigationBar from "./menu/DesktopMenu";
import Search from "./search/Search";
import BarcodeScanner from "../barcodeScanner/BarcodeScanner";

const NEXT_PUBLIC_S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

const MainNavigationBar = ({
  type,
}: {
  type: typeof PUBLIC | typeof PRIVATE;
}) => {
  const router = useRouter();
  const navItems = type === PUBLIC ? PUBLIC_MENU_ITEMS : PRIVATE_MENU_ITEMS;
  const stylesBar =
    type === PUBLIC ? "bg-yellow-400 shadow-md" : "bg-pink-400 shadow-md";

  const [search, setSearch] = useState<string>("");
  const [barcodeScanner, setBarcodeScanner] = useState(false);
  const [error, setError] = useState("");

  const handleCodeDetected = async (code) => {
    if (code.code) setSearch(code.code);
    setError("");
  };

  const handleScannerError = (errorMessage) => {
    setError("Error del escáner: " + errorMessage);
  };

  const onSearch = () => {
    if (!error && !search) return;
    if (type === PUBLIC) router.push(`/products?search=${search}`);
    if (type === PRIVATE) router.push(`/products/management?search=${search}`);
    if (barcodeScanner) setBarcodeScanner(false);
  };

  return (
    <header className={stylesBar}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex hidden sm:flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-900">
              {BUSINESS_NAME}
            </Link>
          </div>
          <div className="flex sm:hidden items-center min-h-[50px] min-w-[50px]">
            <Logo
              src={`${NEXT_PUBLIC_S3_BASE_URL}/images/business/c-la-red-logo.jpg`}
              alt={"c-la-red-logo"}
              className={"hover:cursor-pointer"}
              onClick={() => router.push("/")}
            />
          </div>
          <Search
            type={type}
            search={search}
            setSearch={setSearch}
            onSearch={onSearch}
            setBarcodeScanner={setBarcodeScanner}
            barcodeScanner={barcodeScanner}
          />          
          <DesktopNavigationBar
            navItems={navItems}
            variant="slide-right"
            colorScheme="light"
          />
          <MobileMenu
            navItems={navItems}
            variant="slide-right"
            colorScheme="light"
          />
        </div>
        {barcodeScanner && (
          <BarcodeScanner
            onCodeDetected={handleCodeDetected}
            onError={handleScannerError}
            code={search}
            setCode={setSearch}
            fnCallback={onSearch}
          />
        )}

        {error && (
          <div className="absolute top-0 left-0 w-full bg-red-100 text-red-700 p-2 rounded-md mb-4">
            {error}
          </div>
        )}
      </div>
    </header>
  );
};
export default MainNavigationBar;
