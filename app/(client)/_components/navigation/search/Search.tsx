"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRIVATE, PUBLIC } from "../../../_lib/constant";

const Search = ({ type }: { type: typeof PUBLIC | typeof PRIVATE }) => {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const onHandleChange = (e) => {
    let value = e.target.value;
    setSearch(value);
  };

  return (
    <div className="flex-1 mx-10">
      <div className="relative">
        <input
          onChange={(e) => onHandleChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (type === PUBLIC) router.push(`/products?search=${search}`);
              if (type === PRIVATE)
                router.push(`/products/management?search=${search}`);
            }
          }}
          value={search}
          type="text"
          placeholder="Buscar producto..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => {
            if (type === PUBLIC) router.push(`/products?search=${search}`);
            if (type === PRIVATE)
              router.push(`/products/management?search=${search}`);
          }}
          className="absolute right-2 top-2 text-gray-500"
        >
          🔍
        </button>
      </div>
    </div>
  );
};
export default Search;
