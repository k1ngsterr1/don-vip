// app/api/tinkoff/init/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";

function generateToken(params: Record<string, any>, secretKey: string) {
  const sortedKeys = Object.keys(params).sort();
  let tokenStr = "";
  for (const key of sortedKeys) {
    tokenStr += key + params[key];
  }
  tokenStr += secretKey;
  return crypto.createHash("sha256").update(tokenStr).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json();

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

  const token = generateToken(
    {
      TerminalKey,
      Amount,
      OrderId,
      Description,
      CustomerKey,
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

  const tinkoffRes = await fetch("https://securepay.tinkoff.ru/v2/Init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalPayload),
  });

  const result = await tinkoffRes.json();
  return NextResponse.json(result);
}
