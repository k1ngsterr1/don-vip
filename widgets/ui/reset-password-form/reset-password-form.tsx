"use client";

import { apiClient } from "@/shared/config/apiClient";
import { cn } from "@/shared/utils/cn";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button/button";

export default function ResetPasswordForm() {
  const i18n = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  useEffect(() => {
    const id = searchParams.get("identifier");
    if (id) {
      setIdentifier(id);
    }
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: async ({
      code,
      new_password,
      identifier,
    }: {
      code: string;
      new_password: string;
      identifier: string;
    }) => {
      const res = await apiClient.post("/user/reset-password", {
        code,
        new_password,
        identifier,
      });
      return res.data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      code: code,
      new_password: newPassword,
      identifier: identifier,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg shadow-blue-100/40 space-y-6 mt-12"
      style={{ boxShadow: "0 6px 32px 0 rgba(28, 52, 255, 0.08)" }}
    >
      <h2 className="text-2xl font-unbounded mb-6 text-center tracking-tight">
        {i18n("title", { default: "Reset Password" })}
      </h2>
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          {i18n("code", { default: "Code" })}
        </label>
        <input
          type="text"
          className="w-full rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          {i18n("newPassword", { default: "New Password" })}
        </label>
        <input
          type="text"
          className="w-full rounded-lg px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      {mutation.isError && (
        <div className="text-red-600 text-sm text-center">
          {(mutation.error as any)?.message || "Unknown error"}
        </div>
      )}
      {mutation.isSuccess && (
        <div className="text-green-600 text-sm text-center">
          {i18n("success", { default: "Password reset successful!" })}
        </div>
      )}
      <Button
        type="submit"
        disabled={mutation.isPending}
        className={`w-full rounded-full text-white py-3 md:py-4 text-sm md:text-base ${
          !mutation.isPending
            ? "bg-blue hover:bg-blue/90"
            : "bg-[#AAAAAB] hover:bg-[#AAAAAB]/90"
        }`}
      >
        {mutation.isPending
          ? i18n("loading", { default: "Resetting..." })
          : i18n("submit", { default: "Reset Password" })}
      </Button>
    </form>
  );
}
