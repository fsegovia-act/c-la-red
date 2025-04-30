"use client";

import Link from "next/link";
import { BUSINESS_NAME } from "../../_lib/constant";
import { useRouter } from "next/navigation";
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

          <Search type={type} />

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
      </div>
    </header>
  );
};
export default MainNavigationBar;
