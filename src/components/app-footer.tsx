import React from "react";
import { DracoMark } from "./draco-mark";
import { ExternalLink, ShieldCheck, Flame } from "lucide-react";

export function AppFooter() {
  return (
    <footer style={{ marginTop: "80px", paddingTop: "40px", borderTop: "1px solid var(--void-05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <DracoMark className="w-6 h-6" />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "16px", color: "#ffffff" }}>
          DRACOGUARD
        </span>
        <span style={{ fontSize: "12px", color: "var(--ink-tertiary)" }}>
          • Consensus Upgrade Governance Control Plane
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-secondary)" }}>
        <a
          href="https://docs.genlayer.com"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--ink-secondary)", textDecoration: "none" }}
        >
          <span>GenLayer Docs</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://studio.genlayer.com"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--ink-secondary)", textDecoration: "none" }}
        >
          <span>StudioNet</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://github.com/ODbeke/dracoguard"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--draco-gold)", textDecoration: "none" }}
        >
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </footer>
  );
}
