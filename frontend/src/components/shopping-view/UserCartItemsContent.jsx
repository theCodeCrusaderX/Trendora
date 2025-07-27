import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, fetchCartItems, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "../ui/card";
import { Trash } from "lucide-react";

function UserCartItemsContent({ cartItem }) {

  // console.log('cartItem',cartItem);
  
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleDeleteCartItem(productId) {
    dispatch(deleteCartItem({ userId: user?._id, productId })).then((data) => {
      if (data.payload.succuss) {
        toast({ title: "item deleted!" });
      }
    });
  }

  function handleUpdateCartItems(productId, quantity) {
    dispatch(
      updateCartQuantity({ userId: user._id, productId, quantity })
    ).then((data) => {
      if (data.payload.succuss) {
        toast({ title: "item updated!" });
      }
    });
  }

  // useEffect(() => {
  //   dispatch(fetchCartItems(user?._id))
  // },[dispatch])

  return (
    <Card className="flex items-center justify-between p-4 shadow-md border rounded-lg">
      {/* Product Image */}
      <div className="w-[100px] h-[100px]">
        <img
          src={cartItem.image}
          className="w-full h-full object-cover rounded-md"
          alt={cartItem.productTitle}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 px-4">
        <h2 className="text-lg font-semibold">{cartItem.productTitle}</h2>
        <p className="text-gray-600 text-sm">
          Price: $
          {cartItem.productSalePrice > 0
            ? cartItem.productSalePrice
            : cartItem.productPrice}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center mt-2 space-x-3">
          <Button
            
            onClick={() =>
              handleUpdateCartItems(cartItem.productId, cartItem.quantity + 1)
            }
          >
            +
          </Button>
          <span className="text-lg font-semibold">{cartItem.quantity}</span>
          <Button
            className={`rounded-md ${
              cartItem.quantity === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            disabled={cartItem.quantity === 1}
            onClick={() =>
              handleUpdateCartItems(cartItem.productId, cartItem.quantity - 1)
            }
          >
            -
          </Button>
        </div>

        {/* Total Price */}
        <p className="mt-2 text-green-600 font-bold">
          Total: $
          {(
            cartItem.quantity *
            (cartItem.productSalePrice > 0
              ? cartItem.productSalePrice
              : cartItem.productPrice)
          ).toFixed(2)}
        </p>
      </div>

      {/* Delete Button */}
      <Button
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        onClick={() => handleDeleteCartItem(cartItem.productId)}
      >
        <Trash />
      </Button>
    </Card>
  );
}

export default UserCartItemsContent;
