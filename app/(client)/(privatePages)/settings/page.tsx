"use client";

import { useRequireAuth } from "../../hooks/useRequireAuth";

export default function SettingsPage() {
  useRequireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Setting Page (private)</h1>
    </div>
  );
}
