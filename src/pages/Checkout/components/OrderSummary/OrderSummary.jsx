import "./OrderSummary.css";
import React from "react";
import { CartProductsSummary } from "../CartProductsSummary/CartProductsSummary";
import { BillingSummary } from "../BillingSummary/BillingSummary";

export const OrderSummary = () => {
    return (
        <div className="order-details-container">
            <CartProductsSummary />
            <BillingSummary />
        </div>
    );
};
