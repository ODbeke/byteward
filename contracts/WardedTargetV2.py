# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

"""
WardedTargetV2 — Candidate upgraded target contract warded by ByteWard.
Preserves the exact storage variable ordering of V1 (administrator, byteward,
counter, release_version) and adds a new public `add_value` method while exposing
version "v2".
"""

from genlayer import *

@gl.contract_interface
class ByteWardEnrollment:
    """
    Cross-contract interface for enrolling this target in ByteWard.
    """
    class Write:
        def enroll_target(self, target_id: str, name: str, charter: str, source_url: str) -> None: ...


class WardedTarget(gl.Contract):
    """
    Upgraded target contract warded by ByteWard.
    Preserves storage layout and adds new arithmetic capabilities.
    """
    administrator: Address
    byteward: Address
    counter: u256
    release_version: str

    def __init__(self, byteward_address):
        """
        Deploys WardedTarget and delegates bytecode slot authority to ByteWard.
        """
        if isinstance(byteward_address, (bytes, bytearray)):
            linked_guard = Address(byteward_address)
        elif isinstance(byteward_address, int):
            h = hex(byteward_address)[2:].zfill(40)
            linked_guard = Address("0x" + h)
        else:
            linked_guard = Address(str(byteward_address))

        self.administrator = gl.message.sender_address
        self.byteward = linked_guard
        self.counter = u256(0)
        self.release_version = "v1"

        root = gl.storage.Root.get()
        root.upgraders.get().append(linked_guard)

    @gl.public.write
    def enroll_with_byteward(self, target_id: str, name: str, charter: str, source_url: str) -> None:
        """
        Enrolls this target with ByteWard. Can only be invoked by the target administrator.
        """
        if gl.message.sender_address != self.administrator:
            raise gl.vm.UserError("[BYTEWARD_AUTH] Only the target administrator may request enrollment")
        ByteWardEnrollment(self.byteward).emit(on="finalized").enroll_target(target_id, name, charter, source_url)

    @gl.public.write
    def increment_counter(self) -> None:
        """
        Public function to increment the counter.
        """
        self.counter += u256(1)

    @gl.public.write
    def add_value(self, amount: u256) -> None:
        """
        New V2 feature: adds a specified amount to the counter.
        """
        self.counter += amount

    @gl.public.write
    def upgrade(self, new_code: bytes) -> None:
        """
        Overwrites the executable bytecode slot of this contract.
        Can only be invoked by the designated ByteWard controller.
        """
        if gl.message.sender_address != self.byteward:
            raise gl.vm.UserError("[BYTEWARD_AUTH] Only the ByteWard controller can execute upgrades")

        code = gl.storage.Root.get().code.get()
        code.truncate()
        code.extend(new_code)

    @gl.public.view
    def get_counter_value(self) -> str:
        return str(self.counter)

    @gl.public.view
    def get_version(self) -> str:
        return "v2"

    @gl.public.view
    def get_guard_controller(self) -> str:
        return str(self.byteward)

    @gl.public.view
    def get_administrator(self) -> str:
        return str(self.administrator)

    @gl.public.view
    def is_sole_guard_authorized(self) -> bool:
        upgraders = gl.storage.Root.get().upgraders.get()
        return len(upgraders) == 1 and upgraders[0] == self.byteward

    @gl.public.view
    def get_draco_v2_tag(self) -> str:
        return "BYTEWARD_V2_CONFIRMED"
