"use client";

import { useRouter } from "next/navigation";
import { PRIVATE, PUBLIC } from "../../../_lib/constant";

type PropsInterfaces = {
  type: typeof PUBLIC | typeof PRIVATE;
  search: string;
  setSearch: (search: string) => void;
  onSearch: () => void;
  setBarcodeScanner: (value: boolean) => void;
  barcodeScanner: boolean;
};
const Search = ({
  type,
  search,
  setSearch,
  onSearch,
  setBarcodeScanner,
  barcodeScanner,
}: PropsInterfaces) => {
  const router = useRouter();

  const onHandleChange = (e) => {
    let value = e.target.value;
    setSearch(value);
  };

  const switchBarcodeScanner = () => {
    if (barcodeScanner) {
      setBarcodeScanner(false);
    }
    if (!barcodeScanner) {
      setBarcodeScanner(true);
      setSearch("");
    }
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
          placeholder="Buscar..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={switchBarcodeScanner}
          className="absolute right-10 top-2 text-gray-500 rounded-[50%] bg-blue-100 p-1 opacity-100 hover:cursor-pointer hover:bg-blue-200 transition-colors"
        >
          <svg width="20" height="16" viewBox="0 0 24 16" fill="black">
            <rect x="2" y="2" width="1" height="12" />
            <rect x="4" y="2" width="2" height="12" />
            <rect x="7" y="2" width="1" height="12" />
            <rect x="9" y="2" width="3" height="12" />
            <rect x="13" y="2" width="1" height="12" />
            <rect x="15" y="2" width="2" height="12" />
            <rect x="18" y="2" width="1" height="12" />
            <rect x="20" y="2" width="2" height="12" />
          </svg>
        </button>
        <button
          onClick={onSearch}
          className="absolute right-2 top-2 text-gray-500"
        >
          🔍
        </button>
      </div>
    </div>
  );
};
export default Search;
