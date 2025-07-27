import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin-view/ImageUpload";
import {
  addNewProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} from "@/store/admin/products-slice";
import { toast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin-view/AdminProductTile";

function AdminProduct() {
  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      productTitle: "",
      productDescription: "",
      category: "",
      brand: "",
      productPrice: 0,
      productSalePrice: 0,
      totalStock: 0,
    },
  });

  const [openSheet, setOpenSheet] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (productToEdit) {
      reset(productToEdit);
    } else {
      reset({
        productTitle: "",
        productDescription: "",
        category: "",
        brand: "",
        productPrice: "",
        productSalePrice: "",
        totalStock: "",
      });
    }
  }, [productToEdit, reset]);

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      image: uploadedImageUrl,
    };

    currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formData: data })).then(
          (data) => {
            if (data?.payload?.success) {
              resetForm();
              toast({ title: "Product edited successfully!" });
            }
          }
        )
      : dispatch(addNewProduct(updatedData)).then((data) => {
          if (data?.payload?.success) {
            resetForm();
            toast({ title: "Product added successfully!" });
          }
        });
  };

  const resetForm = () => {
    setImageFile(null);
    setUploadedImageUrl("");
    dispatch(fetchAllProducts());
    reset();
    setOpenSheet(false);
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id)).then((data) => {
      if (data.payload.success === true) {
        dispatch(fetchAllProducts());
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setOpenSheet(true)}
          className="bg-primary text-white hover:bg-primary-dark transition px-6 py-2 rounded-lg shadow-md"
        >
          + Add Product
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {productList?.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem.id}
              product={productItem}
              setOpenSheet={setOpenSheet}
              setCurrentEditedId={setCurrentEditedId}
              setProductToEdit={setProductToEdit}
              handleDeleteProduct={handleDeleteProduct}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found.
          </p>
        )}
      </div>

      <Sheet
        open={openSheet}
        onOpenChange={() => {
          setOpenSheet(false);
          setProductToEdit(null);
          setImageFile(null);
          setUploadedImageUrl("");
          setCurrentEditedId(null);
        }}
      >
        <SheetContent
          className="overflow-auto"
          style={{ width: "600px", maxWidth: "900px" }}
        >
          <SheetHeader>
            <SheetTitle className="w-full text-center font-bold ">
              {currentEditedId != null ? "Edit Product" : "Add Product"}
            </SheetTitle>
            <ImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Controller
                  name="productTitle"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </div>
              <div>
                <Label>Brand</Label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nike">Nike</SelectItem>
                        <SelectItem value="adidas">Adidas</SelectItem>
                        <SelectItem value="puma">Puma</SelectItem>
                        <SelectItem value="levi">Levi's</SelectItem>
                        <SelectItem value="zara">Zara</SelectItem>
                        <SelectItem value="h&m">h&m</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <Label>Description</Label>
            <Controller
              name="productDescription"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />

            <Label>Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Controller
                  name="productPrice"
                  control={control}
                  render={({ field }) => <Input {...field} type="number" />}
                />
              </div>
              <div>
                <Label>Sale Price</Label>
                <Controller
                  name="productSalePrice"
                  control={control}
                  render={({ field }) => <Input {...field} type="number" />}
                />
              </div>
            </div>

            <Label>Total Stock</Label>
            <Controller
              name="totalStock"
              control={control}
              render={({ field }) => <Input {...field} type="number" />}
            />

            <Button type="submit" className="w-full">
              {currentEditedId != null ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AdminProduct;
