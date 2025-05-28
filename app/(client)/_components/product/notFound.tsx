import { NextPage } from "next";

const ProductNotFound: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Product not found</p>
      </div>
    </div>
  );
};

export default ProductNotFound;
