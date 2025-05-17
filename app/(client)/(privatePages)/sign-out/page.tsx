"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "../../hooks/useCookies";
import Loader from "../../_components/loader/Loader";

export default function SignOutPage() {
  const router = useRouter();
  const { removeCookie } = useCookies();

  useEffect(() => {
    removeCookie("token");
    router.push(`/`);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Loader />
    </div>
  );
}
