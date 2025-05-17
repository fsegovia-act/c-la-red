"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "../../hooks/useCookies";
import Loader from "../../_components/loader/Loader";
import { useRequireAuth } from "../../hooks/useRequireAuth";

export default function SignOutPage() {
  const router = useRouter();
  const { removeCookie, getCookie } = useCookies();

  useRequireAuth();

  const token = getCookie("token");
  removeCookie("token");

  useEffect(() => {
    if (!token) router.push(`/`);
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Loader />
    </div>
  );
}
