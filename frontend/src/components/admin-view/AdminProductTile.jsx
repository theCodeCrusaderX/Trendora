import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Pencil, Trash2 } from "lucide-react";

function AdminProductTile({
  product,
  setOpenSheet,
  setCurrentEditedId,
  handleDeleteProduct,
  setProductToEdit
}) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-lg rounded-2xl bg-white hover:shadow-2xl transition-shadow duration-300">
      <div>
        {/* Product Image */}
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.productTitle}
            className="w-full h-[280px] object-cover rounded-t-2xl"
          />
        </div>

        {/* Product Details */}
        <CardContent className="p-4">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">{product?.productTitle}</h2>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-lg font-semibold text-gray-700 ${
                product?.productSalePrice > 0 ? "line-through text-gray-500" : ""
              }`}
            >
              ${product?.productPrice}
            </span>
            {product?.productSalePrice > 0 && (
              <span className="text-xl font-bold text-red-500">${product?.productSalePrice}</span>
            )}
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="flex justify-between items-center px-4 pb-4">
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition duration-200"
            onClick={() => {
              setOpenSheet(true);
              setCurrentEditedId(product?._id);
              setProductToEdit(product);
            }}
          >
            <Pencil className="w-5 h-5" /> Edit
          </Button>

          <Button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition duration-200"
            onClick={() => handleDeleteProduct(product?._id)}
          >
            <Trash2 className="w-5 h-5" /> Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
