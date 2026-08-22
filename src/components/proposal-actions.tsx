"use client";

import React, { useState } from "react";
import { useWallet } from "./wallet-provider";
import { executeByteWardWrite, waitForByteWardFinalization, ProposalRecord } from "@/lib/byteward";
import { Play, Flame, ShieldAlert, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function ProposalActions({
  proposal,
  onActionComplete,
}: {
  proposal: ProposalRecord;
  onActionComplete: () => void;
}) {
  const { account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dispute form state
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [disputeUrl, setDisputeUrl] = useState("");
  const [disputeRationale, setDisputeRationale] = useState("");

  const handleAudit = async () => {
    if (!account) return setError("Connect wallet first.");
    setIsLoading(true);
    setActiveAction("audit");
    setError(null);
    setSuccessMsg(null);
    try {
      const hash = await executeByteWardWrite(account, "audit_proposal", [proposal.proposal_id]);
      setSuccessMsg("Consensus audit triggered. Validators are analyzing code diff...");
      await waitForByteWardFinalization(account, hash);
      setSuccessMsg("Consensus audit finalized on StudioNet!");
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Audit transaction failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return setError("Connect wallet first.");
    setIsLoading(true);
    setActiveAction("dispute");
    setError(null);
    setSuccessMsg(null);
    try {
      const hash = await executeByteWardWrite(account, "file_dispute", [
        proposal.proposal_id,
        disputeUrl,
        disputeRationale,
      ]);
      setSuccessMsg("Dispute filed! Evidence snapshotted on-chain.");
      await waitForByteWardFinalization(account, hash);
      setShowDisputeInput(false);
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Dispute transaction failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleDispatch = async () => {
    if (!account) return setError("Connect wallet first.");
    setIsLoading(true);
    setActiveAction("dispatch");
    setError(null);
    setSuccessMsg(null);
    try {
      const hash = await executeByteWardWrite(account, "dispatch_upgrade", [proposal.proposal_id]);
      setSuccessMsg("Bytecode update dispatched to target contract slot...");
      await waitForByteWardFinalization(account, hash);
      setSuccessMsg("Bytecode update confirmed in target slot!");
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Dispatch transaction failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleFinalize = async () => {
    if (!account) return setError("Connect wallet first.");
    setIsLoading(true);
    setActiveAction("finalize");
    setError(null);
    setSuccessMsg(null);
    try {
      const hash = await executeByteWardWrite(account, "verify_and_finalize", [proposal.proposal_id]);
      setSuccessMsg("Verifying target release version on-chain...");
      await waitForByteWardFinalization(account, hash);
      setSuccessMsg("Upgrade confirmed and marked as EXECUTED!");
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Finalization transaction failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--void-05)" }}>
      {error && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.15)",
            color: "#fca5a5",
            fontSize: "12px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#6ee7b7",
            fontSize: "12px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {proposal.stage === "AWAITING_REVIEW" && (
        <button
          onClick={handleAudit}
          disabled={isLoading}
          className="btn-cta-primary"
          style={{ width: "100%", padding: "10px 16px", fontSize: "13px" }}
        >
          {isLoading && activeAction === "audit" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Dragon Consensus Audit...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>Trigger Dragon Consensus Audit</span>
            </>
          )}
        </button>
      )}

      {proposal.stage === "APPROVED_DISPUTE_WINDOW" && (
        <div style={{ display: "grid", gap: "10px" }}>
          <button
            onClick={handleDispatch}
            disabled={isLoading}
            className="btn-cta-primary"
            style={{ width: "100%", padding: "10px 16px", fontSize: "13px" }}
          >
            {isLoading && activeAction === "dispatch" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching Bytecode Slot Update...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Bytecode Upgrade</span>
              </>
            )}
          </button>

          {!showDisputeInput ? (
            <button
              onClick={() => setShowDisputeInput(true)}
              className="btn-terminal"
              style={{ width: "100%", color: "var(--draco-crimson)", borderColor: "rgba(239, 68, 68, 0.3)" }}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>File Dispute / Challenge Evidence</span>
            </button>
          ) : (
            <form onSubmit={handleFileDispute} style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
              <input
                type="url"
                required
                placeholder="HTTPS Dispute Evidence URL"
                value={disputeUrl}
                onChange={(e) => setDisputeUrl(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: "var(--void-03)",
                  border: "1px solid var(--void-05)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                }}
              />
              <textarea
                required
                rows={2}
                placeholder="Summary of detected security anomaly..."
                value={disputeRationale}
                onChange={(e) => setDisputeRationale(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: "var(--void-03)",
                  border: "1px solid var(--void-05)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowDisputeInput(false)}
                  className="btn-terminal"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-terminal active"
                  style={{ flex: 1 }}
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {proposal.stage === "EXECUTION_QUEUED" && (
        <button
          onClick={handleFinalize}
          disabled={isLoading}
          className="btn-cta-primary"
          style={{ width: "100%", padding: "10px 16px", fontSize: "13px" }}
        >
          {isLoading && activeAction === "finalize" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Active Target Release...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Finalize Upgrade Execution</span>
            </>
          )}
        </button>
      )}

      {proposal.stage === "EXECUTED" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--draco-emerald)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
          <CheckCircle2 className="w-4 h-4" />
          <span>UPGRADE FINALIZED & EXECUTED ON TARGET</span>
        </div>
      )}
    </div>
  );
}
