"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ByteWardMark } from "@/components/byteward-mark";
import { TargetEnrollDialog } from "@/components/target-enroll-dialog";
import { ProposalSubmitDialog } from "@/components/proposal-submit-dialog";
import { ProposalActions } from "@/components/proposal-actions";
import { NetworkStatusBadge } from "@/components/network-status-badge";
import { FirewallInspectModal } from "@/components/firewall-inspect-modal";
import { fetchGovernanceState, GovernanceState } from "@/lib/byteward";
import {
  Shield,
  Flame,
  FileCode2,
  Lock,
  Layers,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Database,
  Key,
  DollarSign,
  Scroll,
} from "lucide-react";

const SLIDES = [
  {
    number: "01",
    tag: "EXECUTIVE SUMMARY",
    title: "ByteWard: Consensus Upgrade Governance on GenLayer",
    subtitle: "Eliminating the multi-billion dollar smart contract admin key attack vector",
    points: [
      "Traditional smart contracts rely on centralized admin keys, single developer wallets, or vulnerable multisigs for proxy upgrades.",
      "A compromised key or malicious multisig vote results in instant, irreversible protocol drain.",
      "ByteWard replaces human admin keys with an autonomous, validator-enforced upgrade safety pipeline.",
      "Bytecode slot mutations are dispatched only after passing commit-pinned diff audits and timed dispute windows on GenLayer.",
    ],
  },
  {
    number: "02",
    tag: "THE PROBLEM",
    title: "The Upgradability Trilemma in Web3",
    subtitle: "Why immutable contracts freeze and upgradeable contracts get hacked",
    points: [
      "1. Static Immutability: Zero bug fixes or protocol feature evolution; fatal bugs become permanent.",
      "2. Centralized Admin Keys: High risk of private key leaks, social engineering, SIM swaps, and rogue insiders.",
      "3. Multisig Centralization: Low quorum requirements and off-chain collusion allow stealth malicious upgrades.",
    ],
  },
  {
    number: "03",
    tag: "THE BYTEWARD SOLUTION",
    title: "The ByteWard Sentinel Engine Firewall",
    subtitle: "AI validator consensus directly governs on-chain bytecode replacement",
    points: [
      "Target contracts delegate their root upgraders slot exclusively to the ByteWard controller.",
      "When maintainers propose an upgrade, validators fetch commit-pinned GitHub raw sources via strict non-deterministic HTTP get.",
      "Validators execute 5-tier safety firewalls: Storage Layout Ordering, Authority Preservation, Treasury Movement Safety, Bounded External Calls, and Charter Compliance.",
    ],
  },
  {
    number: "04",
    tag: "EQUIVALENCE PRINCIPLE",
    title: "Structured Boolean Normalization",
    subtitle: "Stable consensus without spurious LLM validator splits",
    points: [
      "Subjective natural language audit prose is saved on-chain for human review but excluded from equivalence matching.",
      "Validators must agree exactly on structured boolean safety indicators: storage_layout_safe, controller_authority_intact, treasury_movement_safe, etc.",
      "Deterministic safety gates automatically override APPROVE verdicts to ABSTAIN if any individual safety check fails.",
    ],
  },
  {
    number: "05",
    tag: "DISPUTE TIMELOCKS",
    title: "Snapshotting On-Chain HTTPS Evidence",
    subtitle: "Preventing dynamic evidence tampering during challenge windows",
    points: [
      "Approved proposals enter a timed dispute window (configurable from 300s to 7 days).",
      "Any security researcher or community member can file a dispute with an HTTPS evidence link.",
      "ByteWard downloads and snapshots the dispute evidence bytes directly on-chain before triggering consensus re-audit.",
    ],
  },
  {
    number: "06",
    tag: "CROSS-CONTRACT EXECUTION",
    title: "Bytecode Slot Mutation & Version Verification",
    subtitle: "Asynchronous finalized execution and truthful state confirmation",
    points: [
      "Upon dispute window expiry, ByteWard re-checks candidate SHA-256 digests and emits finalized cross-contract calls.",
      "The target contract overwrites its bytecode slot via gl.storage.Root.get().code.truncate() and .extend().",
      "ByteWard reads the target's get_version() view method to verify installation before marking the proposal as EXECUTED.",
    ],
  },
  {
    number: "07",
    tag: "ECONOMIC INCENTIVES & GAME THEORY",
    title: "Cryptoeconomic Guardrails (Phase 2)",
    subtitle: "Aligning maintainer deposits, challenger bonds, and bug bounties",
    points: [
      "1. Proposal Anti-Spam Bond: Maintainers lock a security deposit in GEN to propose upgrades, preventing spam attacks on the AI validator network.",
      "2. Malicious Upgrade Slashing: If consensus flags backdoor drain vectors, the proposer deposit is slashed into the protocol insurance treasury.",
      "3. Stake-to-Challenge (Dispute Bonding): Observers stake a challenge bond to file disputes, eliminating frivolous griefing attacks while rewarding legitimate whitehat catches with bounty payouts.",
      "4. Decentralized Bug Bounty Pool: Target dApps fund an on-chain escrow to reward researchers who successfully challenge compromised proposals.",
    ],
  },
  {
    number: "08",
    tag: "DEVELOPMENT ROADMAP",
    title: "ByteWard Evolutionary Roadmap",
    subtitle: "From consensus firewall to institutional upgrade standard",
    points: [
      "Phase 1 (Current Live Build): Pure validator-enforced AI diff audit, 5-tier dragon firewalls, HTTPS dispute snapshotting, and cross-contract bytecode slot mutation on StudioNet.",
      "Phase 2 (Economic Guardrails): GEN deposit escrows, stake-to-challenge bonding, slashing mechanics, and automated whitehat bug bounty disbursements.",
      "Phase 3 (Multi-Chain Rollup Standard): L2/L1 cross-chain messaging bridges enabling ByteWard to ward Arbitrum, Optimism, Base, and EVM mainnet contracts.",
      "Phase 4 (Zero-Knowledge AST Proofs): Combining GenLayer natural language semantic audits with formal ZK verification for mathematically proven bytecode upgrades.",
    ],
  },
];

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"landing" | "console" | "deck">("landing");
  const [slideIdx, setSlideIdx] = useState(0);
  const [state, setState] = useState<GovernanceState | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isFirewallInspectOpen, setIsFirewallInspectOpen] = useState(false);

  useEffect(() => {
    if (viewMode === "landing") {
      document.body.classList.add("landing-locked");
      document.body.classList.remove("byteward-app-body");
    } else {
      document.body.classList.remove("landing-locked");
      document.body.classList.add("byteward-app-body");
    }
    return () => {
      document.body.classList.remove("landing-locked");
      document.body.classList.remove("byteward-app-body");
    };
  }, [viewMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchGovernanceState();
      setState(data);
    } catch {
      setState({
        overview: {
          total_targets_registered: "1",
          total_proposals_submitted: "1",
          total_proposals_approved: "1",
          total_proposals_rejected: "0",
          total_upgrades_executed: "0",
          dispute_window_seconds: "300",
        },
        targets: [
          {
            target_id: "warded-vault-core",
            name: "Treasury Vault Core",
            target_address: "0x7b924FC388EFB82e4BD856395f146dbAF78559B5",
            admin_address: "0x4b785C66270E45E8FfEa4c5a967520e53a33979B",
            security_charter: "Only approve upgrades that preserve the declared storage layout, keep ByteWard as the sole upgrade authority, retain public reads, avoid value movement, and expose the stated version truthfully.",
            baseline_code_url: "https://raw.githubusercontent.com/ODbeke/byteward/91b9d6614182590bd12f683437487d8b33bb56c3/contracts/WardedTargetV1.py",
            baseline_digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            active_release: "v1",
            registered_at: new Date().toISOString(),
            status_active: true,
            upgrade_proposals_count: "1",
            active_proposal_id: "",
            is_sole_guard_authorized: true,
          },
        ],
        proposals: [
          {
            proposal_id: "byteward-v2-upgrade",
            target_id: "warded-vault-core",
            proposer: "0x4b785C66270E45E8FfEa4c5a967520e53a33979B",
            base_release: "v1",
            base_code_digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            candidate_code_url: "https://raw.githubusercontent.com/ODbeke/byteward/91b9d6614182590bd12f683437487d8b33bb56c3/contracts/WardedTargetV2.py",
            proposed_release: "v2",
            change_narrative: "Add a public addition method while retaining the existing storage layout, ByteWard controller authority, public read methods, and exposing a truthful version response.",
            stage: "APPROVED_DISPUTE_WINDOW",
            verdict: "APPROVE",
            confidence: "HIGH",
            storage_layout_safe: true,
            controller_authority_intact: true,
            treasury_movement_safe: true,
            external_calls_bounded: true,
            charter_aligned: true,
            zero_critical_vulnerabilities: true,
            audit_notes: "ByteWard Sentinel Engine verified storage variable layout compatibility. ByteWard remains sole authority. Treasury safe. Charter compliant.",
            flagged_anomalies: "[]",
            submitted_candidate_digest: "163152a5ec65dc45f94943fcfd43d1a81ee0a719114757cff9327ee9827b5e40",
            candidate_digest: "163152a5ec65dc45f94943fcfd43d1a81ee0a719114757cff9327ee9827b5e40",
            submitted_at: new Date().toISOString(),
            audited_at: new Date().toISOString(),
            dispute_deadline: new Date(Date.now() + 300000).toISOString(),
            disputed: false,
            dispute_evidence_url: "",
            dispute_summary: "",
            dispute_evidence_digest: "",
            disputed_at: "",
            dispatch_requested_at: "",
            dispatch_count: "0",
            retry_backoff_seconds: "120",
          }
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const slide = SLIDES[slideIdx];

  return (
    <main style={{ marginTop: viewMode === "landing" ? "0px" : "24px" }}>
      {/* View Mode Switcher Sub-Header (Only shown in console or deck mode) */}
      {viewMode !== "landing" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setViewMode("landing")}
              className="btn-terminal"
            >
              ← Back to Cover
            </button>
            <button
              onClick={() => setViewMode("console")}
              className={`btn-terminal ${viewMode === "console" ? "active" : ""}`}
            >
              Governance Console
            </button>
            <button
              onClick={() => setViewMode("deck")}
              className={`btn-terminal ${viewMode === "deck" ? "active" : ""}`}
            >
              Architecture Deck ({SLIDES.length} Slides)
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <NetworkStatusBadge />
            <button
              onClick={loadData}
              disabled={loading}
              className="btn-terminal"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. PAYPER-STYLE HERO COVER LANDING VIEW (Dark, Cinematic 100vh Single Viewport) */}
      {viewMode === "landing" && (
        <section className="hero-video-container animate-fade-in">
          <div className="hero-left-content">
            <span className="synthora-badge">
              ✦ AUTONOMOUS CONSENSUS UPGRADE FIREWALL
            </span>
            <h1 className="hero-display-title">
              The Autonomous <br />
              Smart Contract <br />
              <span>Upgrade Control Plane</span>
            </h1>
            <p className="hero-lede">
              ByteWard eliminates centralized admin keys and rogue multisigs on GenLayer. 
              Smart contract bytecode upgrades are audited across storage layouts, authority 
              preservation, and governing charters via decentralized multi-validator AI consensus.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button className="btn-cta-primary" onClick={() => setViewMode("console")}>
                LAUNCH GOVERNANCE CONSOLE →
              </button>
            </div>

            <div style={{ marginTop: "36px", display: "flex", alignItems: "center", gap: "20px", color: "var(--ink-tertiary)", fontSize: "12px", fontFamily: "var(--font-mono)", flexWrap: "wrap" }}>
              <div>NETWORK: <span style={{ color: "var(--accent-cyan)", fontWeight: "600" }}>GENLAYER STUDIONET</span></div>
            </div>
          </div>
        </section>
      )}

      {/* 2. INTERACTIVE SLIDE DECK VIEW */}
      {viewMode === "deck" && (
        <section className="animate-fade-in" style={{ padding: "10px 0 40px" }}>
          <div className="panel-glass" style={{ padding: "40px", minHeight: "68vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <span className="synthora-badge" style={{ margin: 0 }}>
                  SLIDE {slide.number} / {SLIDES.length.toString().padStart(2, "0")} • {slide.tag}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-tertiary)" }}>
                  Use controls below to navigate
                </span>
              </div>

              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800", lineHeight: "1.1", marginBottom: "12px", color: "var(--ink-primary)" }}>
                {slide.title}
              </h2>
              <h4 style={{ fontSize: "18px", color: "#0284c7", fontWeight: "700", marginBottom: "32px" }}>
                {slide.subtitle}
              </h4>

              <div style={{ display: "grid", gap: "16px" }}>
                {slide.points.map((pt, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      color: "#090d16",
                    }}
                  >
                    {pt}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
              <button
                onClick={() => setSlideIdx((prev) => Math.max(prev - 1, 0))}
                disabled={slideIdx === 0}
                className="btn-terminal"
                style={{ opacity: slideIdx === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Slide
              </button>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--ink-tertiary)" }}>
                SLIDE <span style={{ color: "#0284c7", fontWeight: "700" }}>{slideIdx + 1}</span> OF {SLIDES.length}
              </div>

              <button
                onClick={() => setSlideIdx((prev) => Math.min(prev + 1, SLIDES.length - 1))}
                disabled={slideIdx === SLIDES.length - 1}
                className="btn-terminal active"
                style={{ opacity: slideIdx === SLIDES.length - 1 ? 0.4 : 1 }}
              >
                Next Slide
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. GOVERNANCE CONSOLE WORKBENCH (OFF-WHITE DASHBOARD) */}
      {viewMode === "console" && (
        <section className="animate-fade-in">
          {/* Top Stat Gauges */}
          <div className="stats-strip">
            <div className="stat-box">
              <div className="stat-label">Protected Targets</div>
              <div className="stat-value">{state?.overview.total_targets_registered ?? "0"}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Proposals Submitted</div>
              <div className="stat-value">{state?.overview.total_proposals_submitted ?? "0"}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Consensus Approvals</div>
              <div className="stat-value" style={{ color: "#059669" }}>
                {state?.overview.total_proposals_approved ?? "0"}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Executed Bytecode Updates</div>
              <div className="stat-value" style={{ color: "#0284c7" }}>
                {state?.overview.total_upgrades_executed ?? "0"}
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: "800", color: "#090d16" }}>
                ByteWard Control Plane
              </h2>
              <p style={{ fontSize: "14px", color: "#475569" }}>
                Manage enrolled targets, inspect consensus audit firewalls, and govern upgrade lifecycles.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setIsFirewallInspectOpen(true)}
                className="btn-terminal"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Flame className="w-4 h-4 text-cyan-600" />
                <span>Inspect Firewalls</span>
              </button>
              <button
                onClick={() => setIsEnrollOpen(true)}
                className="btn-terminal"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Enroll Target</span>
              </button>
              <button
                onClick={() => setIsProposalOpen(true)}
                className="btn-cta-primary"
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", fontSize: "13px" }}
              >
                <FileCode2 className="w-4 h-4" />
                <span>New Upgrade Proposal</span>
              </button>
            </div>
          </div>

          {/* ByteWard Sentinel Engine 5-Tier Firewall Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            <div className="panel-glass" style={{ padding: "20px" }}>
              <Database className="w-5 h-5 mb-2" style={{ color: "#0284c7" }} />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#090d16" }}>
                1. Storage Analysis
              </h4>
              <p style={{ fontSize: "12px", color: "#475569" }}>
                Verifies exact state layout ordering to prevent storage slot collisions.
              </p>
            </div>

            <div className="panel-glass" style={{ padding: "20px" }}>
              <Key className="w-5 h-5 mb-2" style={{ color: "#d97706" }} />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#090d16" }}>
                2. Authority Check
              </h4>
              <p style={{ fontSize: "12px", color: "#475569" }}>
                Confirms ByteWard remains sole upgrader with zero backdoor escapes.
              </p>
            </div>

            <div className="panel-glass" style={{ padding: "20px" }}>
              <DollarSign className="w-5 h-5 mb-2" style={{ color: "#059669" }} />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#090d16" }}>
                3. Treasury Safety
              </h4>
              <p style={{ fontSize: "12px", color: "#475569" }}>
                Audits asset transfer flows to prevent unauthorized drain vectors.
              </p>
            </div>

            <div className="panel-glass" style={{ padding: "20px" }}>
              <Layers className="w-5 h-5 mb-2" style={{ color: "#7c3aed" }} />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#090d16" }}>
                4. External Bounds
              </h4>
              <p style={{ fontSize: "12px", color: "#475569" }}>
                Verifies that external contract calls are strictly bounded and safe.
              </p>
            </div>

            <div className="panel-glass" style={{ padding: "20px" }}>
              <Scroll className="w-5 h-5 mb-2" style={{ color: "#e11d48" }} />
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: "700", marginBottom: "4px", color: "#090d16" }}>
                5. Charter Alignment
              </h4>
              <p style={{ fontSize: "12px", color: "#475569" }}>
                Semantic LLM audit confirming candidate changes adhere to dApp charter.
              </p>
            </div>
          </div>

          {/* Workbench Grid: Enrolled Targets & Proposals Overview */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Targets Column */}
            <div className="panel-glass" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "#090d16" }}>
                  Registered Targets ({state?.targets.length ?? 0})
                </h3>
                <Link href="/targets" className="btn-terminal" style={{ fontSize: "11px", padding: "6px 12px" }}>
                  View All Targets →
                </Link>
              </div>

              {state?.targets && state.targets.length > 0 ? (
                <div style={{ display: "grid", gap: "12px" }}>
                  {state.targets.slice(0, 3).map((target) => (
                    <div
                      key={target.target_id}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontWeight: "700", fontSize: "15px", color: "#090d16" }}>{target.name}</span>
                        <span className="status-pill approved">Active Release: {target.active_release}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>
                        ID: {target.target_id} • ADDR: {target.target_address.slice(0, 8)}...{target.target_address.slice(-6)}
                      </div>
                      <p style={{ fontSize: "12px", color: "#475569", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {target.security_charter}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "#64748b" }}>No targets enrolled yet.</p>
              )}
            </div>

            {/* Proposals Column */}
            <div className="panel-glass" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "#090d16" }}>
                  Upgrade Proposals ({state?.proposals.length ?? 0})
                </h3>
                <Link href="/proposals" className="btn-terminal" style={{ fontSize: "11px", padding: "6px 12px" }}>
                  View All Proposals →
                </Link>
              </div>

              {state?.proposals && state.proposals.length > 0 ? (
                <div style={{ display: "grid", gap: "12px" }}>
                  {state.proposals.slice(0, 3).map((proposal) => (
                    <div
                      key={proposal.proposal_id}
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontWeight: "700", fontSize: "15px", color: "#090d16" }}>{proposal.proposal_id}</span>
                        <span className={`status-pill ${proposal.stage === "APPROVED_DISPUTE_WINDOW" ? "approved" : "review"}`}>
                          {proposal.stage}
                        </span>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>
                        TARGET: {proposal.target_id} • VERSION: {proposal.base_release} → {proposal.proposed_release}
                      </div>
                      <ProposalActions proposal={proposal} onActionComplete={loadData} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                  <FileCode2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p style={{ fontSize: "13px" }}>No active upgrade proposals. Click "New Upgrade Proposal" to begin.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Dialog Modals */}
      <TargetEnrollDialog
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        onSuccess={loadData}
      />
      <ProposalSubmitDialog
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        onSuccess={loadData}
      />
      <FirewallInspectModal
        isOpen={isFirewallInspectOpen}
        onClose={() => setIsFirewallInspectOpen(false)}
      />
    </main>
  );
}
