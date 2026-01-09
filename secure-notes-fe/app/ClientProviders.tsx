"use client";

import ClientLayout from "./ClientLayout";
import GlobalLoader from "@/components/GlobalLoader";
import Navbar from "@/components/Navbar";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalLoader />
      <Navbar />
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}
