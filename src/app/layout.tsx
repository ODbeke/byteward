import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";
import { AppHeader } from "@/components/app-header";

export const metadata: Metadata = {
  title: "DracoGuard — Consensus Smart Contract Upgrade Governance",
  description: "Autonomous, validator-enforced smart contract upgrade control plane on GenLayer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <div className="app-shell animate-fade-in">
            <AppHeader />
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
