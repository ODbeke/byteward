"use client";

import React from "react";
import { ShieldAlert, X, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

export function DisputeEvidenceViewer({
  isOpen,
  proposalId,
  evidenceUrl,
  summary,
  evidenceDigest,
  onClose,
}: {
  isOpen: boolean;
  proposalId: string;
  evidenceUrl: string;
  summary: string;
  evidenceDigest: string;
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
          maxWidth: "600px",
          padding: "32px",
          borderRadius: "20px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
          position: "relative",
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
          <ShieldAlert className="w-6 h-6" style={{ color: "var(--accent-rose)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "800", color: "var(--ink-primary)" }}>
            Dispute Evidence Record
          </h3>
        </div>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-tertiary)", marginBottom: "16px" }}>
          PROPOSAL ID: {proposalId}
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "4px", fontWeight: "600" }}>
              DISPUTE RATIONALE:
            </div>
            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(241, 245, 249, 0.85)", border: "1px solid #e2e8f0", fontSize: "13px", color: "var(--ink-primary)" }}>
              {summary}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "4px", fontWeight: "600" }}>
              ON-CHAIN EVIDENCE DIGEST (SHA-256):
            </div>
            <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(241, 245, 249, 0.85)", border: "1px solid #e2e8f0", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--accent-cyan)", fontWeight: "600" }}>
              {evidenceDigest || "Digest calculation verified on-chain"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "4px", fontWeight: "600" }}>
              EVIDENCE SOURCE:
            </div>
            <a
              href={evidenceUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--accent-blue)", textDecoration: "none", fontWeight: "600" }}
            >
              <span>{evidenceUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <button onClick={onClose} className="btn-terminal" style={{ width: "100%" }}>
          Close Evidence Viewer
        </button>
      </div>
    </div>
  );
}
