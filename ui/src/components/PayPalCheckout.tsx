import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPalCheckout() {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AePscNE5btuxlezuH5LAzMkHtiRWUGFMxu2tbpJJAv9lyo-kmFEB4sHDxtca4lHed73MLFZ24OOykDni",
        currency: "ILS",
        intent: "capture",
      }}
    >
      <div className="flex flex-col items-center p-6">
        <h2 className="text-xl font-bold mb-4">רכישה לדוגמה</h2>

        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={async () => {
            const response = await fetch("http://localhost:5000/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: "0.10",
                currency: "ILS",
                description: "מנורת לילה",
              }),
            });

            const order = await response.json();
            return order.id; // מחזיר ל-PayPal את ה־orderID
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
            }else if (capture.status === "COMPLETED") {
              alert("התשלום בוצע בהצלחה!");
            }
          }}
          onError={(err) => {
            console.error(err);
            alert("שגיאה בביצוע התשלום");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}

export default PayPalCheckout;
