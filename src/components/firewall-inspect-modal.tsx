"use client";

import React from "react";
import { Flame, X, Database, Key, DollarSign, Layers, Scroll } from "lucide-react";

export function FirewallInspectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "680px",
          padding: "32px",
          borderRadius: "20px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "var(--ink-secondary)",
            cursor: "pointer",
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Flame className="w-6 h-6" style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "800", color: "var(--ink-primary)" }}>
            The 5-Tier ByteWard Sentinel Firewalls
          </h3>
        </div>

        <div style={{ display: "grid", gap: "14px", margin: "20px 0" }}>
          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(241, 245, 249, 0.85)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--accent-cyan)", marginBottom: "4px" }}>
              <Database className="w-4 h-4" />
              <span>1. Wyrm Storage Layout Audit</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--ink-secondary)" }}>
              Extracts declared class-level dataclass variables and state slots. Verifies that candidate release does not prepend, delete, or swap variable ordering, eliminating storage collision attacks.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(241, 245, 249, 0.85)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--accent-amber)", marginBottom: "4px" }}>
              <Key className="w-4 h-4" />
              <span>2. Drake Upgrade Authority Check</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--ink-secondary)" }}>
              Inspects root upgrader permissions and constructor logic to ensure ByteWard remains the sole upgrade authority and no owner backdoors or bypasses are introduced.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(241, 245, 249, 0.85)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--accent-emerald)", marginBottom: "4px" }}>
              <DollarSign className="w-4 h-4" />
              <span>3. Leviathan Treasury & Value Guard</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--ink-secondary)" }}>
              Scans for arbitrary token/ether transfers, uncontrolled emit_transfer calls, or emergency withdrawal functions that could allow attackers to drain funds.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(241, 245, 249, 0.85)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--accent-purple)", marginBottom: "4px" }}>
              <Layers className="w-4 h-4" />
              <span>4. Wyvern External Call Bounds</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--ink-secondary)" }}>
              Ensures that all external cross-contract invocations are bounded to known addresses and safe interfaces, preventing reentrancy and arbitrary delegatecalls.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(241, 245, 249, 0.85)", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--accent-rose)", marginBottom: "4px" }}>
              <Scroll className="w-4 h-4" />
              <span>5. Charter Alignment</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--ink-secondary)" }}>
              Natural language semantic audit under AI consensus verifying that proposed feature modifications strictly align with the immutable governing charter submitted at target enrollment.
            </p>
          </div>
        </div>

        <button onClick={onClose} className="btn-terminal active" style={{ width: "100%" }}>
          Dismiss Inspection
        </button>
      </div>
    </div>
  );
}
