import React from "react";
import { SheetContent, SheetHeader } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./UserCartItemsContent";
import { useNavigate } from "react-router-dom";

function UserCartWrapper({ cartItems, setOpen }) {
  const navigate = useNavigate();

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

  // console.log("store cart items :: ", cartItems);
  return (
    <SheetContent className="max-h-screen overflow-y-auto p-4">
      <SheetHeader className="text-xl font-bold">Your Cart</SheetHeader>

      {cartItems?.items?.length > 0 ? (
        <>
          {/* Total Amount */}
          <div className="flex justify-between items-center text-lg font-bold mt-4">
            <span>Total:</span>
            <span className="text-green-600">${totalCartAmount}</span>
          </div>

          {/* Checkout Button */}
          <Button
            className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              navigate("/shop/checkout");
              setOpen(false);
            }}
          >
            Checkout
          </Button>

          {/* Cart Items */}
          <div className="mt-6 flex flex-col gap-4">
            {cartItems.items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-4 border-b pb-4"
              >
                <UserCartItemsContent cartItem={it} />
              </div>
            ))}
          </div>
        </>
      ) : (
        // Empty Cart Message
        <div className="flex flex-col items-center justify-center h-screen mt-10">
          <p className="text-lg font-semibold text-gray-600">
            Your cart is empty
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              navigate("/shop/listing");
              setOpen(false);
            }}
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
