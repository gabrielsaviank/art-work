import React, { useState } from "react";
import { motion } from "framer-motion";
import { AddressSection } from "./components/AddressSection/AddressSection";
import { OrderSummary } from "./components/OrderSummary/OrderSummary";
import { DeliveryAddress } from "./components/DeliveryAddress/DeliveryAddress";
import "./CheckoutModal.css";
import {useUserData} from "../../contexts/UserDataProvider";
import {useAuth} from "../../contexts/AuthProvider";
import {useNavigate} from "react-router-dom";
import { v4 as uuid } from "uuid";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5"; // Import X icon from react-icons



export const CheckoutModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const { userDataState, dispatch, clearCartHandler } = useUserData();
    const { auth, setCurrentPage } = useAuth();
    const navigate = useNavigate();

    const {
        cartProducts,
        addressList,
        orderDetails: { cartItemsDiscountTotal, orderAddress },
    } = userDataState;

    const KEY_ID = "rzp_test_VAxHG0Dkcr9qc6";
    const totalAmount = cartItemsDiscountTotal;

    const userContact = addressList?.find(({ _id }) => _id === orderAddress?._id)?.phone;

    const successHandler = (response) => {
        const paymentId = response.razorpay_payment_id;
        const orderId = uuid();
        const order = {
            paymentId,
            orderId,
            amountPaid: totalAmount,
            orderedProducts: [...cartProducts],
            deliveryAddress: { ...orderAddress },
        };

        dispatch({ type: "SET_ORDERS", payload: order });
        clearCartHandler(auth.token);
        setCurrentPage("orders");
        navigate("/profile/orders");
        onClose();
    };

    const razorpayOptions = {
        key: KEY_ID,
        currency: "INR",
        amount: Number(totalAmount) * 100,
        name: "Art Waves Unleashed",
        description: "Order for products",
        prefill: {
            name: auth.firstName,
            email: auth.email,
            contact: userContact,
        },
        notes: { address: orderAddress },
        theme: { color: "#000000" },
        handler: (response) => successHandler(response),
    };

    const placeOrderHandler = () => {
        if (orderAddress) {
            setIsProcessing(true);
            setTimeout(() => {
                const razorpayInstance = new window.Razorpay(razorpayOptions);
                razorpayInstance.open();
                setIsProcessing(false);
            }, 2000);
        } else {
            toast("Please select an address!");
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="checkout-modal-overlay"
        >
            <div className="checkout-modal">
                <div className="modal-header">
                    <h2>Checkout</h2>
                    <button className="close-btn" onClick={onClose}>
                        <IoClose/>
                    </button>
                </div>

                <div className="step-indicator">
                    <span className={`step ${step === 1 ? "active" : ""}`} onClick={() => setStep(1)}>1. Address</span>
                    <span className={`step ${step === 2 ? "active" : ""}`}
                          onClick={() => setStep(2)}>2. Order Summary</span>
                    <span className={`step ${step === 3 ? "active" : ""}`} onClick={() => setStep(3)}>3. Payment</span>
                </div>

                <div className="checkout-content">
                    {step === 1 && <AddressSection/>}
                    {step === 2 && <OrderSummary/>}
                    {step === 3 && <DeliveryAddress/>}
                </div>

                <div className="checkout-buttons">
                    {step === 1 ? (
                        <button className="place-order-btn" onClick={onClose}>
                            Close
                        </button>
                    ) : (
                        <button className="place-order-btn" onClick={() => setStep(step - 1)}>
                            Previous
                        </button>
                    )}

                    {step < 3 ? (
                        <button className="place-order-btn" onClick={() => setStep(step + 1)}>
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={placeOrderHandler}
                            className="place-order-btn"
                            disabled={!orderAddress || isProcessing}
                        >
                            {isProcessing ? <span className="spinner"></span> : "Place Order"}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
