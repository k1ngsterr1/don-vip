"use client";

import { useEffect, useState } from "react";

export function EnvDebugger() {
  const [envVars, setEnvVars] = useState<any>(null);

  useEffect(() => {
    setEnvVars({
      testMode: process.env.NEXT_PUBLIC_TEST_MODE,
      login: process.env.NEXT_PUBLIC_TEST_MODE_LOGIN,
      password:
        process.env.NEXT_PUBLIC_TEST_MODE_PASSWORD?.substring(0, 10) + "...",
      nodeEnv: process.env.NODE_ENV,
    });
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "black",
        color: "white",
        padding: "10px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <h4>Env Debug:</h4>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
    </div>
  );
}
