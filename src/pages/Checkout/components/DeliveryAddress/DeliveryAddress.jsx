import React from "react";
import "./DeliveryAddress.css";
import { useUserData } from "../../../../contexts/UserDataProvider.js";

export const DeliveryAddress = () => {
  const { userDataState } = useUserData();

  const {
    orderDetails: { orderAddress },
  } = userDataState;


  return (
      <div className="delivery-address-container">
        <p>Delivering To</p>

        <div className="delivery-address-description">
        <span className="name">
          Name: {userDataState.orderDetails?.orderAddress?.name}
        </span>
          <span className="address">
          Address: {orderAddress?.street}, {orderAddress?.city},{" "}
            {orderAddress?.state}, {orderAddress?.country},{" "}
            {orderAddress?.pincode}
        </span>
          <span className="contact">Contact: {orderAddress?.phone}</span>
        </div>
      </div>
  );
};
