import type { Metadata } from "next";
import "./globals.css";
import WalletModal from "@/src/modals/wallet";
import Providers from "./providers";
import Layout from "@/src/components/layout";

export const metadata: Metadata = {
  title: "Euclid Nextjs Starter",
  description: "Euclid Nextjs Starter Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
          <WalletModal />
        </Providers>
      </body>
    </html>
  );
}
