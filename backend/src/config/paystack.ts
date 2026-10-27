import "dotenv/config";

const PAYSTACK_URL = "https://api.paystack.co";

// the currency every payment is charged in.
// To change it, set PAYSTACK_CURRENCY in .env / Render (no code change needed)
export const CURRENCY = process.env.PAYSTACK_CURRENCY ?? "ZAR";

// an error that comes from Paystack itself (wrong key, unsupported currency, ...)
// its message is safe to show to the user, other errors (database, etc.) are not
export class PaystackError extends Error {}

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

  // Paystack answers with JSON. If it does not, say so clearly
  let result: PaystackResponse<T>;
  try {
    result = (await response.json()) as PaystackResponse<T>;
  } catch {
    throw new PaystackError(
      `Paystack sent an unreadable answer (HTTP ${response.status})`,
    );
  }

  if (!response.ok || !result.status) {
    // shows in the Render logs, so the real reason is easy to find
    console.error(`Paystack ${path} failed (HTTP ${response.status}):`, result.message);
    throw new PaystackError(result.message || "Paystack request failed");
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