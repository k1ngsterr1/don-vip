// Helper function to generate SHA-256 hash
export const sha256 = async (message: string) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

// Helper function to generate token for Tinkoff API
export const generateToken = async (
  params: Record<string, any>,
  password: string
): Promise<string> => {
  const excluded = ["DATA", "Receipt"];

  const rawEntries = Object.entries(params);

  const flatEntries = rawEntries.filter(
    ([key, value]) =>
      !excluded.includes(key) &&
      typeof value !== "object" &&
      !Array.isArray(value) &&
      value !== undefined &&
      value !== null
  );

  flatEntries.push(["Password", password]);

  flatEntries.sort(([a], [b]) => a.localeCompare(b));

  const concatenated = flatEntries.map(([, value]) => String(value)).join("");

  const encoder = new TextEncoder();
  const data = encoder.encode(concatenated);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  console.groupEnd();
  return token;
};

// Apply promocode and calculate discounted amount
export const applyPromocode = (
  code: string,
  originalAmount: string,
  errorMessages: { empty: string; invalid: string }
): { success: boolean; discount?: number; amount?: string; error?: string } => {
  if (!code.trim()) {
    return { success: false, error: errorMessages.empty };
  }

  const normalizedCode = code.toLowerCase();

  if (normalizedCode === "demo10") {
    const discount = 10;
    const discountedAmount = (
      (Number(originalAmount) * (100 - discount)) /
      100
    ).toFixed(2);

    return {
      success: true,
      discount,
      amount: discountedAmount,
    };
  } else if (normalizedCode === "demo20") {
    const discount = 20;
    const discountedAmount = (
      (Number(originalAmount) * (100 - discount)) /
      100
    ).toFixed(2);

    return {
      success: true,
      discount,
      amount: discountedAmount,
    };
  }

  return { success: false, error: errorMessages.invalid };
};
