"use client";

import React, { useState } from "react";
import { useWallet } from "./wallet-provider";
import { executeByteWardWrite, waitForByteWardFinalization } from "@/lib/byteward";
import { FileCode2, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

export function ProposalSubmitDialog({
  isOpen,
  targetIdDefault = "",
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  targetIdDefault?: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { account } = useWallet();
  const [proposalId, setProposalId] = useState("");
  const [targetId, setTargetId] = useState(targetIdDefault);
  const [candidateUrl, setCandidateUrl] = useState("");
  const [proposedVersion, setProposedVersion] = useState("v2");
  const [changelog, setChangelog] = useState(
    "Add a public addition method while retaining the existing storage layout, ByteWard controller authority, public read methods, and exposing a truthful version response."
  );
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
      const hash = await executeByteWardWrite(account, "propose_upgrade", [
        proposalId,
        targetId,
        candidateUrl,
        proposedVersion,
        changelog,
      ]);
      setTxHash(hash);
      await waitForByteWardFinalization(account, hash);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Proposal submission transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="panel-glass animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid rgba(245, 158, 11, 0.3)",
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
          <FileCode2 className="w-6 h-6" style={{ color: "var(--draco-gold)" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "700" }}>
            Submit Upgrade Proposal
          </h2>
        </div>

        <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "24px" }}>
          Submit a commit-pinned bytecode candidate for Dragon Engine validator consensus audit.
        </p>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
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
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#6ee7b7",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Submitted tx: {txHash.slice(0, 14)}... Awaiting consensus...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px" }}>
              PROPOSAL IDENTIFIER
            </label>
            <input
              type="text"
              required
              placeholder="e.g. proposal-v2-upgrade"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--void-03)",
                border: "1px solid var(--void-05)",
                color: "#ffffff",
                fontSize: "14px",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px" }}>
              TARGET IDENTIFIER
            </label>
            <input
              type="text"
              required
              placeholder="e.g. warded-core"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--void-03)",
                border: "1px solid var(--void-05)",
                color: "#ffffff",
                fontSize: "14px",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px" }}>
              CANDIDATE SOURCE URL (COMMIT-PINNED GITHUB RAW)
            </label>
            <input
              type="url"
              required
              placeholder="https://raw.githubusercontent.com/org/repo/<40-char-sha>/contracts/CandidateV2.py"
              value={candidateUrl}
              onChange={(e) => setCandidateUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--void-03)",
                border: "1px solid var(--void-05)",
                color: "#ffffff",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px" }}>
              PROPOSED RELEASE VERSION
            </label>
            <input
              type="text"
              required
              placeholder="e.g. v2"
              value={proposedVersion}
              onChange={(e) => setProposedVersion(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--void-03)",
                border: "1px solid var(--void-05)",
                color: "#ffffff",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "6px" }}>
              CHANGELOG & ARCHITECTURAL SUMMARY
            </label>
            <textarea
              required
              rows={3}
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--void-03)",
                border: "1px solid var(--void-05)",
                color: "#ffffff",
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
                  <span>Submitting Proposal...</span>
                </>
              ) : (
                <span>Submit Upgrade Proposal</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
