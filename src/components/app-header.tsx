"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DracoMark } from "./draco-mark";
import { useWallet } from "./wallet-provider";
import { Shield, FileCode2, Terminal, BookOpen, Layers } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const { account, isConnecting, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="nav-terminal">
      <Link href="/" className="nav-brand">
        <DracoMark className="w-9 h-9" />
        <span className="brand-text">DRACOGUARD</span>
        <span className="brand-badge">STUDIONET</span>
      </Link>

      <nav className="nav-links">
        <Link
          href="/"
          className={`nav-link ${pathname === "/" ? "active" : ""}`}
        >
          <Terminal className="inline-block w-4 h-4 mr-1.5" />
          Dashboard
        </Link>
        <Link
          href="/targets"
          className={`nav-link ${pathname === "/targets" ? "active" : ""}`}
        >
          <Shield className="inline-block w-4 h-4 mr-1.5" />
          Protected Targets
        </Link>
        <Link
          href="/proposals"
          className={`nav-link ${pathname === "/proposals" ? "active" : ""}`}
        >
          <FileCode2 className="inline-block w-4 h-4 mr-1.5" />
          Proposals Ledger
        </Link>
      </nav>

      <div>
        {account ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="status-pill approved" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="pulse-dot"></span>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="btn-terminal"
              style={{ padding: "6px 12px", fontSize: "11px" }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-cta-primary"
            style={{ padding: "10px 20px", fontSize: "13px" }}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
