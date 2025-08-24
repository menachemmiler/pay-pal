import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { usePayment } from "../context/PaymentContext";
import { useNavigate } from "react-router";

const PayPalCheckout = () => {
  const { payment } = usePayment();
  const navigate = useNavigate();

  if (!payment) {
    return <p>לא נבחר מוצר לתשלום</p>;
  }

  return (
    <div className="app">
      <div className="paypal-checkout">
        <PayPalScriptProvider
          options={{
            clientId:
              "AePscNE5btuxlezuH5LAzMkHtiRWUGFMxu2tbpJJAv9lyo-kmFEB4sHDxtca4lHed73MLFZ24OOykDni",
            currency: "ILS",
            intent: "capture",
          }}
        >
          <div>
            <h2 className="text-xl font-bold mb-4">רכישה לדוגמה</h2>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={async () => {
                const response = await fetch(
                  "http://localhost:5000/create-order",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: payment.amount,
                      currency: "ILS",
                      description: payment.name,
                    }),
                  }
                );

                const order = await response.json();
                return order.id;
              }}
              onApprove={async (data) => {
                const response = await fetch(
                  `http://localhost:5000/capture-order/${data.orderID}`,
                  {
                    method: "POST",
                  }
                );
                const capture = await response.json();
                if (!capture.status || capture.status !== "COMPLETED") {
                  alert("תפיסת התשלום נכשלה");
                } else if (capture.status === "COMPLETED") {
                  alert("התשלום בוצע בהצלחה!");
                  navigate("/");
                }
              }}
              onError={(err) => {
                console.error(err);
                alert("שגיאה בביצוע התשלום");
              }}
            />
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              ביטול
            </button>
          </div>
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PayPalCheckout;
