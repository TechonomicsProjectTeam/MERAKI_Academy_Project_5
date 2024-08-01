import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        console.log("amount:",amount);
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code:'USD',  
              value: amount,
            },
          }],
        });
      }}
      onApprove={async (data, actions) => {
        await actions.order.capture();
        onSuccess(data);
      }}
      onError={onError}
    />
  );
};

export default PayPalButton;