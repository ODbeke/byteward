from conftest import CANDIDATE_URL, CHARTER, SOURCE_URL, SUMMARY


def test_constructor_records_minimum_window(byteward):
    # Verify constructor saves default dispute window and stats start at zero
    overview = byteward.fetch_overview()
    assert overview["dispute_window_seconds"] == "300"
    assert overview["total_targets_registered"] == "0"
    assert overview["total_proposals_submitted"] == "0"


def test_constructor_rejects_short_window(direct_deploy, direct_vm):
    # Verify constructor reverts when dispute window is less than 300 seconds
    with direct_vm.expect_revert("must be at least 300"):
        direct_deploy("contracts/ByteWard.py", 299)


def test_constructor_rejects_excessive_window(direct_deploy, direct_vm):
    # Verify constructor reverts when dispute window exceeds 7 days (604800 seconds)
    with direct_vm.expect_revert("exceeds maximum 7-day threshold"):
        direct_deploy("contracts/ByteWard.py", 604801)


def test_empty_target_page_is_empty(byteward):
    # Verify list_all_targets returns empty array on fresh deploy
    assert byteward.list_all_targets(0, 50) == []


def test_empty_target_page_caps_limit(byteward):
    # Verify list_all_targets respects page query limits
    assert byteward.list_all_targets(0, 999) == []


def test_empty_proposal_page_is_empty(byteward):
    # Verify list_target_proposals returns empty array when no proposals exist
    assert byteward.list_target_proposals("", 0, 50) == []


def test_empty_proposal_page_handles_offset(byteward):
    # Verify list_target_proposals returns empty array when offset is out of range
    assert byteward.list_target_proposals("warded-core", 100, 1) == []


def test_unknown_target_read_reverts(byteward, direct_vm):
    # Verify reading unknown target reverts
    with direct_vm.expect_revert("Unknown target identifier"):
        byteward.fetch_target("missing")


def test_unknown_proposal_read_reverts(byteward, direct_vm):
    # Verify reading unknown proposal reverts
    with direct_vm.expect_revert("Unknown proposal identifier"):
        byteward.fetch_proposal("missing")


def test_unknown_audit_reverts(byteward, direct_vm):
    # Verify auditing unknown proposal reverts
    with direct_vm.expect_revert("Unknown proposal identifier"):
        byteward.audit_proposal("missing")


def test_unknown_dispute_reverts(byteward, direct_vm):
    # Verify disputing unknown proposal reverts
    with direct_vm.expect_revert("Unknown proposal identifier"):
        byteward.file_dispute("missing", SOURCE_URL, "x" * 100)


def test_unknown_dispatch_reverts(byteward, direct_vm):
    # Verify dispatching unknown proposal reverts
    with direct_vm.expect_revert("Unknown proposal identifier"):
        byteward.dispatch_upgrade("missing")


def test_unknown_finalization_reverts(byteward, direct_vm):
    # Verify finalizing unknown proposal reverts
    with direct_vm.expect_revert("Unknown proposal identifier"):
        byteward.verify_and_finalize("missing")


def test_enrollment_rejects_short_target_id(byteward, direct_alice, direct_vm):
    # Verify enrolling with a target ID that is too short reverts
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Target identifier length must be between 3 and 80"):
        byteward.enroll_target("x", "Protocol Counter", CHARTER, SOURCE_URL)


def test_enrollment_rejects_invalid_target_id(byteward, direct_alice, direct_vm):
    # Verify target ID validation flags unsupported characters
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("contains invalid characters"):
        byteward.enroll_target("warded/core", "Protocol Counter", CHARTER, SOURCE_URL)


def test_enrollment_rejects_short_name(byteward, direct_alice, direct_vm):
    # Verify target names shorter than 3 characters are rejected
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Target name length must be between 3 and 100"):
        byteward.enroll_target("warded-core", "x", CHARTER, SOURCE_URL)


def test_enrollment_rejects_short_charter(byteward, direct_alice, direct_vm):
    # Verify target charter must satisfy minimum length limit
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Governing charter length must be between 120 and 6000"):
        byteward.enroll_target("warded-core", "Protocol Counter", "short", SOURCE_URL)


def test_enrollment_rejects_non_https_source(byteward, direct_alice, direct_vm):
    # Verify target enrollment source URL must utilize secure HTTPS protocol
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Source URL must utilize HTTPS"):
        byteward.enroll_target("warded-core", "Protocol Counter", CHARTER, "http://example.com/source.py")


def test_enrollment_rejects_mutable_github_source(byteward, direct_alice, direct_vm):
    # Verify target source URL must be commit-pinned (not branch-based like main)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("must be a commit-pinned GitHub raw source link"):
        byteward.enroll_target("warded-core", "Protocol Counter", CHARTER, "https://raw.githubusercontent.com/ODbeke/byteward/main/contracts/WardedTargetV1.py")


def test_enrollment_rejects_short_commit_source(byteward, direct_alice, direct_vm):
    # Verify commit hash in source URL must be 40-character hexadecimal SHA
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("must be a commit-pinned GitHub raw source link"):
        byteward.enroll_target("warded-core", "Protocol Counter", CHARTER, "https://raw.githubusercontent.com/ODbeke/byteward/abc/contracts/WardedTargetV1.py")


def test_submit_rejects_malformed_proposal_id_before_target_lookup(byteward, direct_alice, direct_vm):
    # Verify proposal ID format validation runs early
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("contains invalid characters"):
        byteward.propose_upgrade("bad/id", "missing", CANDIDATE_URL, "v2", SUMMARY)


def test_submit_rejects_non_pinned_candidate_before_target_lookup(byteward, direct_alice, direct_vm):
    # Verify candidate source URL must be commit-pinned raw GitHub URL
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("must be a commit-pinned GitHub raw source link"):
        byteward.propose_upgrade("warded-v2", "missing", "https://raw.githubusercontent.com/ODbeke/byteward/main/contracts/WardedTargetV2.py", "v2", SUMMARY)


def test_submit_rejects_short_version_before_target_lookup(byteward, direct_alice, direct_vm):
    # Verify proposal target version must be at least 1 character
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Proposed version length must be between 1 and 48"):
        byteward.propose_upgrade("warded-v2", "missing", CANDIDATE_URL, "", SUMMARY)


def test_submit_rejects_short_summary_before_target_lookup(byteward, direct_alice, direct_vm):
    # Verify changelog summary must satisfy length constraints
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Changelog summary length must be between 80 and 2400"):
        byteward.propose_upgrade("warded-v2", "missing", CANDIDATE_URL, "v2", "short")


def test_submit_unknown_target_reverts_after_valid_inputs(byteward, direct_alice, direct_vm):
    # Verify submitting proposal to unknown target reverts after input check passes
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Unknown target identifier"):
        byteward.propose_upgrade("warded-v2", "missing", CANDIDATE_URL, "v2", SUMMARY)


def test_profile_empty_is_truthful(byteward, direct_alice):
    # Verify empty profile returns empty arrays
    profile = byteward.fetch_operator_profile(direct_alice)
    assert profile["stewarded_targets"] == []
    assert profile["maintained_targets"] == []
    assert profile["submitted_proposals"] == []
