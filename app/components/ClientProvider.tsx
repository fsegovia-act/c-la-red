"use client";

import GoogleTagManagerNoScript from "../(client)/_components/gtm/GoogleTagManagerNoScript";
import { AppProvider } from "../(client)/context/AppContext";

export default function ClientProvider({
  children,
  gtmId,
}: {
  children: React.ReactNode;
  gtmId: string;
}) {
  return (
    <>
      <GoogleTagManagerNoScript gtmId={gtmId} />
      <AppProvider>{children}</AppProvider>
    </>
  );
}
