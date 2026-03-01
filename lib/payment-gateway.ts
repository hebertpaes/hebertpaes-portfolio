type CheckoutInput = {
  checkoutId: string;
  courseId: string;
  courseTitle: string;
  amountCents: number;
  name: string;
  email: string;
};

type CheckoutOutput = {
  provider: string;
  paymentUrl: string;
  paymentRef?: string;
};

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

function parseBrlToCents(price: string) {
  const normalized = price.replace(/[R$\s.]/g, "").replace(",", ".");
  const num = Number(normalized);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num * 100);
}

async function mockCheckout(input: CheckoutInput): Promise<CheckoutOutput> {
  const success = `${getBaseUrl()}/cursos/checkout/sucesso?checkoutId=${input.checkoutId}&courseId=${input.courseId}`;
  return { provider: "mock", paymentUrl: success, paymentRef: input.checkoutId };
}

async function mercadoPagoCheckout(input: CheckoutInput): Promise<CheckoutOutput> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");

  const baseUrl = getBaseUrl();
  const payload = {
    items: [
      {
        title: input.courseTitle,
        quantity: 1,
        unit_price: Number((input.amountCents / 100).toFixed(2)),
      },
    ],
    payer: { name: input.name, email: input.email },
    external_reference: input.checkoutId,
    back_urls: {
      success: `${baseUrl}/cursos/checkout/sucesso?checkoutId=${input.checkoutId}&courseId=${input.courseId}`,
      failure: `${baseUrl}/cursos/checkout?courseId=${input.courseId}`,
      pending: `${baseUrl}/cursos/checkout?courseId=${input.courseId}`,
    },
    auto_return: "approved",
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.init_point) {
    throw new Error("Falha ao criar preferência no Mercado Pago");
  }

  return {
    provider: "mercadopago",
    paymentUrl: data.init_point as string,
    paymentRef: data.id as string,
  };
}

export async function createPaymentCheckout(input: Omit<CheckoutInput, "amountCents"> & { priceLabel: string }) {
  const amountCents = parseBrlToCents(input.priceLabel);
  const mode = (process.env.COURSES_PAYMENT_PROVIDER || "mock").toLowerCase();

  const payload: CheckoutInput = { ...input, amountCents };

  if (mode === "mercadopago") return mercadoPagoCheckout(payload);
  return mockCheckout(payload);
}
