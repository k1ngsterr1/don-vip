// Updated server-side implementation
import { NextResponse } from "next/server";
import crypto from "crypto";

function stableStringify(value: any): string {
  if (value === undefined) return "";
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
  const tokenParams = {
    TerminalKey: params.TerminalKey,
    Amount: params.Amount,
    OrderId: params.OrderId,
    Description: params.Description,
    CustomerKey: params.CustomerKey,
    SuccessURL: params.SuccessURL,
    FailURL: params.FailURL,
  };

  const sortedKeys = Object.keys(tokenParams).sort();
  let tokenStr = "";

  for (const key of sortedKeys) {
    const value = tokenParams[key] as any;
    if (value !== undefined) {
      // Skip undefined values
      tokenStr += key + stableStringify(value);
    }
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
    Description = "Payment", // Default value
    CustomerKey,
    DATA,
    Receipt,
    SuccessURL,
    FailURL,
  } = body;

  const TerminalKey = process.env.NEXT_PUBLIC_TINKOFF_TERMINAL_KEY!;
  const SecretKey = process.env.TINKOFF_SECRET_KEY!;

  // Verify environment variables
  if (!TerminalKey || !SecretKey) {
    return NextResponse.json(
      { Success: false, Message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Generate token with the same parameters as client-side
  const token = generateToken(
    {
      TerminalKey,
      Amount,
      OrderId,
      Description,
      CustomerKey,
      SuccessURL,
      FailURL,
      // Note: Excluding DATA and Receipt from token generation
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

  try {
    const tinkoffRes = await fetch("https://securepay.tinkoff.ru/v2/Init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
    });

    const result = await tinkoffRes.json();
    console.log("Tinkoff response:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API call failed:", error);
    return NextResponse.json(
      { Success: false, Message: "Network error" },
      { status: 500 }
    );
  }
}
