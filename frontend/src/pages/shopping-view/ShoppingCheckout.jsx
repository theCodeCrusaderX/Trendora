import React, { useEffect, useState } from "react";
import Address from "@/components/shopping-view/Address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/UserCartItemsContent";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";
import { fetchCartItems } from "@/store/shop/cart-slice";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  console.log('cartItem001',cartItems);
  
  const { user } = useSelector((state) => state.auth);
  const [currAddress, setCurrAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  const { toast } = useToast();

  const dispatch = useDispatch();

  console.log("cartItem form checkout page", cartItems);

  const totalCartAmount =
    cartItems && cartItems.items?.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.productSalePrice > 0
              ? currentItem?.productSalePrice
              : currentItem?.productPrice) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handlePayment() {
    if (cartItems.length === 0) {
      toast({
        title: "please select any item to proceed",
        variant: "destructive",
      });

      return;
    }

    if (currAddress === null) {
      toast({
        title: "please select address",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.productTitle,
        image: singleCartItem?.productImage,
        price:
          singleCartItem?.productSalePrice > 0
            ? singleCartItem?.productSalePrice
            : singleCartItem?.productPrice,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currAddress?._id,
        address: currAddress?.address,
        city: currAddress?.city,
        pincode: currAddress?.pincode,
        phone: currAddress?.phone,
        notes: currAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "payPal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: null,
      paymentId: "",
      payerId: "",
      cartId: cartItems?._id,
    };
    dispatch(createNewOrder(orderData)).then((res) => {
      if (res.payload.success) {
        isPaymentStart(true);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 mt-[70px]">
      {/* Address Section */}
      <div className="lg:w-1/2 w-full bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📍 Shipping Address
        </h2>
        <Address setCurrAddress={setCurrAddress} currAddress={currAddress}/>
      </div>

      {/* Cart Items Section */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🛒 Your Cart
        </h2>
        <div className="flex flex-wrap gap-3">
          {cartItems?.items?.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent key={item.id} cartItem={item} />
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>

      {/* Total & Payment Section */}
      <div className="w-full lg:w-[30%] bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 sticky bottom-4">
        <h2 className="text-lg font-semibold text-gray-800">
          💰 Order Summary
        </h2>
        <p className="text-xl font-bold text-gray-900 mt-2">
          Total: ${totalCartAmount}
        </p>

        <Button
          onClick={handlePayment}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-md transition-all"
        >
          Proceed To Payment
        </Button>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
