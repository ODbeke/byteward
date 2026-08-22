"use client";

import React, { useState } from "react";
import { useWallet } from "./wallet-provider";
import { executeByteWardWrite, waitForByteWardFinalization } from "@/lib/byteward";
import { Shield, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

export function TargetEnrollDialog({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { account } = useWallet();
  const [targetId, setTargetId] = useState("");
  const [name, setName] = useState("");
  const [charter, setCharter] = useState(
    "Only approve upgrades that preserve the declared storage layout, keep ByteWard as the sole upgrade authority, retain public reads, avoid value movement, and expose the stated version truthfully."
  );
  const [sourceUrl, setSourceUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await executeByteWardWrite(account, "enroll_target", [
        targetId,
        name,
        charter,
        sourceUrl,
      ]);
      setTxHash(hash);
      await waitForByteWardFinalization(account, hash);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Target enrollment transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

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
          maxWidth: "600px",
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <Shield className="w-6 h-6" style={{ color: "var(--accent-cyan)" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "800", color: "var(--ink-primary)" }}>
            Enroll Target dApp
          </h2>
        </div>

        <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "24px" }}>
          Register a smart contract under ByteWard governance. The target contract must delegate its upgrade authority exclusively to ByteWard.
        </p>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#b91c1c",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {txHash && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#047857",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Transaction submitted: {txHash.slice(0, 14)}... Waiting for consensus...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px", fontWeight: "600" }}>
              TARGET IDENTIFIER (SLUG)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. warded-vault-core"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                color: "var(--ink-primary)",
                fontSize: "14px",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px", fontWeight: "600" }}>
              TARGET NAME
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Treasury Vault Core"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                color: "var(--ink-primary)",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px", fontWeight: "600" }}>
              COMMIT-PINNED GITHUB SOURCE URL
            </label>
            <input
              type="url"
              required
              placeholder="https://raw.githubusercontent.com/org/repo/<40-char-sha>/contracts/Target.py"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                color: "var(--ink-primary)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px", fontWeight: "600" }}>
              IMMUTABLE GOVERNING CHARTER
            </label>
            <textarea
              required
              rows={3}
              value={charter}
              onChange={(e) => setCharter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                color: "var(--ink-primary)",
                fontSize: "13px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-terminal"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-cta-primary"
              style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enrolling on StudioNet...</span>
                </>
              ) : (
                <span>Submit Target Enrollment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
