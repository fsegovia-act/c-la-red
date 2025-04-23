"use client";

import Link from "next/link";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Home Page (public)</h1>
      <h5 className="text-1xl font-bold mb-3 mt-3">Private Pages</h5>
      <ul>
        <li>
          <Link href="/product/info/67fbcb36df0604fa89fbed66">Info Page</Link>
        </li>
        <li>
          <Link href="/product/edit/67fbcb36df0604fa89fbed66">
            Edit Product Page
          </Link>
        </li>
        <li>
          <Link href="/product/create">Create Product Page</Link>
        </li>
        <li>
          <Link href="/products/management">Product Management Page</Link>
        </li>
        <li>
          <Link href="/settings">Settings Page</Link>
        </li>
      </ul>
      <h5 className="text-1xl font-bold mb-3 mt-3">Public Pages</h5>
      <ul>
        <li>
          <Link href="/products">Product List Page</Link>
        </li>
        <li>
          <Link href="/product/details/CODE002">Product Details Page</Link>
        </li>
        <li>
          <Link href="/sign-in">Sign In Page</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
