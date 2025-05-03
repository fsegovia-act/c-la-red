"use client";

import Link from "next/link";
import { NavbarProps } from "../../../_lib/interfaces";

const DesktopNavigationBar = ({
  navItems,
  variant = "slide-right",
  colorScheme = "light",
}: NavbarProps) => {
  return (
    <nav className="flex hidden md:flex">
      <ul className="flex space-x-6 text-sm font-medium text-blue-900">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-blue-700">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default DesktopNavigationBar;
