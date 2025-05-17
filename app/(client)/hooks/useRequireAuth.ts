import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export function useRequireAuth(redirectUrl = "/") {
  const { user, isAuthenticated, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectUrl);
    }
    console.log("useRequireAuth called", { user, isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  return { user, isLoading };
}
