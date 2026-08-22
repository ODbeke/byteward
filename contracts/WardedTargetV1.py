# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

"""
WardedTargetV1 — Reference target contract warded by ByteWard.
Tracks a counter value that can be incremented publicly, and delegates
its bytecode slot mutation exclusively to the ByteWard controller.
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
    Protected target contract warded by ByteWard.
    Delegates all upgrade execution to the ByteWard controller address.
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

        # Register ByteWard in the GenLayer system root upgraders slot
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
        return self.release_version

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
