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
) => {
  const paramsForToken = { ...params };
  delete paramsForToken.Receipt;
  delete paramsForToken.DATA;

  const sortedKeys = Object.keys(paramsForToken).sort();

  // Concatenate values
  let concatenatedValues = "";
  sortedKeys.forEach((key) => {
    if (paramsForToken[key] !== null && paramsForToken[key] !== undefined) {
      concatenatedValues += paramsForToken[key];
    }
  });

  // Append password
  concatenatedValues += password;

  // Generate SHA-256 hash
  return sha256(concatenatedValues);
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

  // For demo purposes, we'll simulate a promocode check
  // In a real app, you would call your API
  if (code.toLowerCase() === "demo10") {
    // Apply 10% discount
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
  } else if (code.toLowerCase() === "demo20") {
    // Apply 20% discount
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
