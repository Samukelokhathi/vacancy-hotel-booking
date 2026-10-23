import "dotenv/config";

const PAYSTACK_URL = "https://api.paystack.co";

// the currency every payment is charged in
export const CURRENCY = "ZAR";

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

const paystackRequest = async <T>(path: string, body?: object): Promise<T> => {
  const response = await fetch(`${PAYSTACK_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = (await response.json()) as PaystackResponse<T>;
  if (!response.ok || !result.status) {
    throw new Error(result.message || "Paystack request failed");
  }
  return result.data;
};

export const initializeTransaction = (params: {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callback_url: string;
}) =>
  paystackRequest<{ authorization_url: string; reference: string }>(
    "/transaction/initialize",
    params,
  );

export const verifyTransaction = (reference: string) =>
  paystackRequest<{ status: string; amount: number; currency: string }>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
