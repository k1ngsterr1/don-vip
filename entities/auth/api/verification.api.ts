// Mock verification function (replace with actual API call)
export const verifyCode = async (
  code: string,
  email?: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === "12345") {
        resolve({ success: true });
      } else {
        reject(new Error("Invalid code"));
      }
    }, 1000);
  });
};

export const resendVerificationCode = async (email?: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};
