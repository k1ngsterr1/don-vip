"use client";

import type React from "react";
import { GuestAuthProvider } from "../guest-auth-provider/guest-auth-provider";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <GuestAuthProvider>{children}</GuestAuthProvider>;
};

export default AuthLayout;
