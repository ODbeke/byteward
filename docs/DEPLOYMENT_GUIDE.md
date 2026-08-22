# DracoGuard StudioNet Deployment & Operation Guide

## 1. Prerequisites
- Python 3.10+
- GenLayer Studio Account & StudioNet test tokens (`GEN`)
- Node.js 18+ & npm

## 2. Deploying DracoGuard via GenLayer Studio
1. Open [studio.genlayer.com](https://studio.genlayer.com)
2. Create a new Intelligent Contract project and import `contracts/DracoGuard.py`.
3. In Constructor Arguments, specify the default challenge/dispute window in seconds (e.g. `300` for testnet or `86400` for 24h).
4. Click **Deploy**. Copy the resulting contract address (e.g. `0x...`).
5. Update `NEXT_PUBLIC_DRACOGUARD_CONTRACT` in `.env`.

## 3. Deploying Target Contracts & Delegating Authority
1. Deploy `contracts/WardedTargetV1.py` passing the DracoGuard controller address to the constructor.
2. Call `enroll_with_dracoguard(target_id, name, charter, source_url)` on the target contract.
3. Verify that the target is registered by calling `fetch_target(target_id)` on DracoGuard.

## 4. Running Upgrade Proposals
1. Submit an upgrade proposal via `propose_upgrade(proposal_id, target_id, candidate_url, version, changelog)`.
2. Trigger the AI validator audit with `audit_proposal(proposal_id)`.
3. Wait out the dispute window, then invoke `dispatch_upgrade(proposal_id)`.
4. Confirm target bytecode installation via `verify_and_finalize(proposal_id)`.
