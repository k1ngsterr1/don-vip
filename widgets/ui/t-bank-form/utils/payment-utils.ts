// Helper function to generate SHA-256 hash
export const sha256 = async (message: string) => {
  console.log("[sha256] Input message:", message);

  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("[sha256] Hash result:", hashHex);
  return hashHex;
};

// Helper function to generate token for Tinkoff API
export const generateToken = async (
  params: Record<string, any>,
  password: string
): Promise<string> => {
  console.group("[generateToken] ▶️ Token Generation Started");
  console.log(
    "[generateToken] Raw input params:",
    JSON.stringify(params, null, 2)
  );
  console.log("[generateToken] Password (SecretKey):", password);

  const excluded = ["DATA", "Receipt"];
  console.log("[generateToken] Excluded fields:", excluded);

  const rawEntries = Object.entries(params);
  console.log("[generateToken] Raw entries before filtering:", rawEntries);

  const flatEntries = rawEntries.filter(
    ([key, value]) =>
      !excluded.includes(key) &&
      typeof value !== "object" &&
      !Array.isArray(value) &&
      value !== undefined &&
      value !== null
  );

  console.log(
    "[generateToken] Filtered entries (before Password):",
    flatEntries
  );

  flatEntries.push(["Password", password]);
  console.log("[generateToken] Entries with Password added:", flatEntries);

  flatEntries.sort(([a], [b]) => a.localeCompare(b));
  console.log("[generateToken] Sorted entries:", flatEntries);

  const concatenated = flatEntries.map(([, value]) => String(value)).join("");
  console.log("[generateToken] Concatenated string for hashing:", concatenated);

  const encoder = new TextEncoder();
  const data = encoder.encode(concatenated);
  console.log("[generateToken] Encoded Uint8Array:", data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  console.log("[generateToken] Final SHA-256 Token:", token);
  console.groupEnd();
  return token;
};

// Apply promocode and calculate discounted amount
export const applyPromocode = (
  code: string,
  originalAmount: string,
  errorMessages: { empty: string; invalid: string }
): { success: boolean; discount?: number; amount?: string; error?: string } => {
  console.log("[applyPromocode] Input code:", code);
  console.log("[applyPromocode] Original amount:", originalAmount);

  if (!code.trim()) {
    console.warn("[applyPromocode] Error: Empty promocode");
    return { success: false, error: errorMessages.empty };
  }

  const normalizedCode = code.toLowerCase();

  if (normalizedCode === "demo10") {
    const discount = 10;
    const discountedAmount = (
      (Number(originalAmount) * (100 - discount)) /
      100
    ).toFixed(2);

    console.log("[applyPromocode] Applying 10% discount:", discountedAmount);

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

    console.log("[applyPromocode] Applying 20% discount:", discountedAmount);

    return {
      success: true,
      discount,
      amount: discountedAmount,
    };
  }

  console.warn("[applyPromocode] Invalid promocode:", code);
  return { success: false, error: errorMessages.invalid };
};
