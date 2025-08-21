import express from "express";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", // כתובת ה־UI שלך
  methods: "*",
  credentials: true,
}));

// סביבת Sandbox
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
const client = new paypal.core.PayPalHttpClient(environment);

// יצירת הזמנה דינמית
app.post("/create-order", async (req, res) => {
  const { amount, currency, description } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: { currency_code: currency, value: amount },
        description: description,
      },
    ],
    application_context: {
      user_action: "PAY_NOW",
      cancel_url: "https://example.com/paypal/cancel",
      locale: "en-US", // נסה במקום he_IL
      shipping_preference: "NO_SHIPPING", // אם זה דיגיטלי
    },
  });

  try {
    const order = await client.execute(request);
    res.json(order.result);
  } catch (err) {
    res.status(500).send(err);
  }
});

// תפיסת תשלום (הלקוח כבר מזין כרטיס או PayPal בצד לקוח)
app.post("/capture-order/:orderID", async (req, res) => {
  const orderID = req.params.orderID;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);

  try {
    const capture = await client.execute(request);
    res.json(capture.result);
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
