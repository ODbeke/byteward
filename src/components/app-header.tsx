"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "./wallet-provider";
import { Shield, FileCode2, Terminal } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const { account, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [isLanding, setIsLanding] = useState(false);

  useEffect(() => {
    const checkLanding = () => {
      const isRoot = pathname === "/";
      const isLocked = document.body.classList.contains("landing-locked");
      const isApp = document.body.classList.contains("byteward-app-body");
      setIsLanding(isRoot && (isLocked || !isApp));
    };

    checkLanding();
    const interval = setInterval(checkLanding, 100);
    window.addEventListener("byteward:mode-change", checkLanding);
    return () => {
      clearInterval(interval);
      window.removeEventListener("byteward:mode-change", checkLanding);
    };
  }, [pathname]);

  const handleLaunchClick = () => {
    window.dispatchEvent(new CustomEvent("byteward:launch"));
  };

  const handleBrandClick = () => {
    window.dispatchEvent(new CustomEvent("byteward:go-home"));
  };

  return (
    <header className="nav-terminal">
      <Link 
        href="/" 
        onClick={handleBrandClick}
        className="nav-brand" 
        style={{ alignItems: "baseline", gap: "8px" }}
      >
        <span className="brand-text">
          BYTEWARD
        </span>
        <span style={{ 
          fontSize: "11px", 
          fontFamily: "var(--font-mono)", 
          fontWeight: "700", 
          color: "var(--accent-cyan)", 
          background: "rgba(56, 189, 248, 0.1)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          padding: "2px 6px",
          borderRadius: "4px",
          letterSpacing: "0.05em",
          lineHeight: "1.2"
        }}>
          v1
        </span>
        <span className="brand-badge" style={{ marginLeft: "4px" }}>STUDIONET</span>
      </Link>

      {/* Navigation Links: Hidden on Landing Page Cover */}
      {!isLanding && (
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
      )}

      {/* Right Action Button */}
      <div>
        {isLanding ? (
          <button
            onClick={handleLaunchClick}
            className="btn-cta-primary"
            style={{ padding: "10px 24px", fontSize: "13px" }}
          >
            LAUNCH →
          </button>
        ) : account ? (
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
