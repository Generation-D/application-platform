"use client";

import { useState } from "react";

import {
  changeRoleOfUser,
  toggleStatusOfUser,
  userData,
} from "@/actions/admin";
import { UserRole } from "@/utils/userRole";

import { UserSpecificRoleDropdown } from "./fields/dropdown";
import ToggleSwitch from "./fields/toggleswitch";

export default function UserList({ users }: { users: userData[] }) {
  const [currentUsers, setCurrentUsers] = useState(users);
  const [search, setSearch] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");
  const [error, setError] = useState("");
  const filteredUsers = currentUsers.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );

  async function updateUser(
    userId: string,
    update: () => Promise<Partial<userData>>,
  ) {
    setPendingUserId(userId);
    setError("");
    try {
      const changes = await update();
      setCurrentUsers((existing) =>
        existing.map((user) =>
          user.id === userId ? { ...user, ...changes } : user,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Die Änderung konnte nicht gespeichert werden.",
      );
    } finally {
      setPendingUserId("");
    }
  }

  return (
    <div>
      <label className="block max-w-md text-sm font-medium">
        Nutzer suchen
        <input
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          type="search"
          placeholder="Name oder E-Mail"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <p className="mt-2 text-sm text-gray-600">
        {filteredUsers.length} von {currentUsers.length} Nutzern
      </p>
      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                E-Mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rolle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aktiv
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.name || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <UserSpecificRoleDropdown
                    user={user}
                    disabled={pendingUserId === user.id}
                    onRoleChange={(role: UserRole) =>
                      updateUser(user.id, async () => ({
                        userrole: await changeRoleOfUser(user.id, role),
                      }))
                    }
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <ToggleSwitch
                    isActive={user.isactive}
                    disabled={pendingUserId === user.id}
                    label={`${user.email} ${user.isactive ? "deaktivieren" : "aktivieren"}`}
                    onClick={() =>
                      updateUser(user.id, async () => ({
                        isactive: await toggleStatusOfUser(user.id),
                      }))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="p-6 text-sm text-gray-600">Keine Nutzer gefunden.</p>
        )}
      </div>
    </div>
  );
}
