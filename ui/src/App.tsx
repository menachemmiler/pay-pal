import PayPalCheckout from "./components/PayPalCheckout";
import { type FC } from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router";
import { PaymentProvider } from "./context/PaymentContext";

const App: FC = () => {
  return (
    <PaymentProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<PayPalCheckout />} />
      </Routes>
    </PaymentProvider>
  );
};

export default App;
