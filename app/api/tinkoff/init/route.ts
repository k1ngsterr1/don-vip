import { NextResponse } from "next/server";
import crypto from "crypto";

function stableStringify(value: any): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  } else if (value !== null && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys
      .map((key) => `"${key}":${stableStringify(value[key])}`)
      .join(",")}}`;
  } else if (typeof value === "string") {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
}

function generateToken(params: Record<string, any>, secretKey: string) {
  const sortedKeys = Object.keys(params).sort();
  let tokenStr = "";

  for (const key of sortedKeys) {
    const value = params[key];
    tokenStr += key + stableStringify(value);
  }

  tokenStr += secretKey;

  console.log("Token string before hashing:", tokenStr);
  return crypto.createHash("sha256").update(tokenStr).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received payload:", JSON.stringify(body, null, 2));

  const {
    Amount,
    OrderId,
    Description,
    CustomerKey,
    DATA,
    Receipt,
    SuccessURL,
    FailURL,
  } = body;

  const TerminalKey = process.env.NEXT_PUBLIC_TINKOFF_TERMINAL_KEY!;
  const SecretKey = process.env.TINKOFF_SECRET_KEY!;

  console.log("ENV TerminalKey:", TerminalKey);
  console.log(
    "ENV SecretKey (partial):",
    SecretKey
      ? `${SecretKey.slice(0, 4)}***${SecretKey.slice(-4)}`
      : "undefined"
  );

  const token = generateToken(
    {
      TerminalKey,
      Amount,
      OrderId,
      Description,
      CustomerKey,
      DATA,
      Receipt,
      SuccessURL,
      FailURL,
    },
    SecretKey
  );

  const finalPayload = {
    TerminalKey,
    Amount,
    OrderId,
    Description,
    CustomerKey,
    DATA,
    Receipt,
    SuccessURL,
    FailURL,
    Token: token,
  };

  console.log("Sending to Tinkoff:", JSON.stringify(finalPayload, null, 2));
  const tinkoffRes = await fetch("https://securepay.tinkoff.ru/v2/Init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalPayload),
  });

  const result = await tinkoffRes.json();
  console.log("Tinkoff response:", result);

  return NextResponse.json(result);
}
