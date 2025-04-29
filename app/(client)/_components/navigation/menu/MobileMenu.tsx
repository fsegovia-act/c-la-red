"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubNavItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  subItems?: SubNavItem[];
}

interface NavbarProps {
  navItems: NavItem[];
  logo?: React.ReactNode;
  variant?: "slide-right" | "slide-down" | "fade";
  colorScheme?: "light" | "dark";
}

export default function MobileMenu({
  navItems,
  variant = "slide-right",
  colorScheme = "light",
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const colorClasses = {
    light: {
      navbar: "bg-white shadow-md",
      text: "text-gray-700",
      textHover: "hover:text-blue-500",
      activeText: "text-blue-600",
      mobileMenu: "bg-white",
      mobileMenuLink: "text-gray-700",
      mobileMenuLinkHover: "hover:bg-gray-100 hover:text-blue-500",
      hamburgerButton: "text-gray-700 hover:text-blue-500 hover:bg-gray-100",
      submenuBg: "bg-gray-50",
    },
    dark: {
      navbar: "bg-gray-900 shadow-md",
      text: "text-gray-300",
      textHover: "hover:text-white",
      activeText: "text-white",
      mobileMenu: "bg-gray-800",
      mobileMenuLink: "text-gray-300",
      mobileMenuLinkHover: "hover:bg-gray-700 hover:text-white",
      hamburgerButton: "text-gray-300 hover:text-white hover:bg-gray-700",
      submenuBg: "bg-gray-700",
    },
  };

  const colors = colorClasses[colorScheme];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const menuAnimationClasses = {
    "slide-right":
      "fixed top-16 right-0 bottom-0 w-64 transform transition-transform ease-in-out duration-300",
    "slide-down":
      "fixed top-16 left-0 right-0 transform transition-transform ease-in-out duration-300 max-h-screen overflow-y-auto",
    fade: "fixed top-16 right-0 bottom-0 w-64 transition-opacity duration-300",
  };

  const menuTransformClasses = {
    "slide-right": isMenuOpen ? "translate-x-0" : "translate-x-full",
    "slide-down": isMenuOpen ? "translate-y-0" : "-translate-y-full",
    fade: isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div ref={navRef}>
      <div className="flex items-center lg:hidden min-w-[20px] max-w-[20px] pr-[30px]">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`inline-flex items-center justify-center p-2 rounded-md`}
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <p className="text-[30px]">x</p>
          ) : (
            <p className="text-[30px]">+</p>
          )}
        </button>
      </div>

      <nav className={colors.navbar}>
        <div
          className={`lg:hidden ${menuAnimationClasses[variant]} ${menuTransformClasses[variant]} ${colors.mobileMenu} shadow-xl z-50`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.href}>
                {
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      colors.mobileMenuLink
                    } ${colors.mobileMenuLinkHover} ${
                      isActive(item.href) ? colors.activeText : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                }
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
