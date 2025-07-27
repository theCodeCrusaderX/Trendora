import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress, // corrected function name
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./AddressCard";
import { useToast } from "@/hooks/use-toast";


function Address({ setCurrAddress,currAddress }) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const dispatch = useDispatch();
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  console.log("address fetched", addressList);
  const {toast} = useToast()

  // Function to handle form submission
  const onSubmit = (data) => {
    if (addressList.length >= 3 && currentEditedId === null) {
      toast({
        title : "You can't add more than 3 address",
        variant : "destructive"
      })
      return;
    }

    data.userId = user._id;

    if (currentEditedId) {
      // Editing existing address

      dispatch(
        editAddress({
          userId: user._id,
          addressId: currentEditedId,
          formData: data,
        })
      ).then(() => {
        dispatch(fetchAllAddresses(user._id));
        setCurrentEditedId(null); // Reset after update
        reset(); // Clear form fields
      });
    } else {
      // Adding new address
      dispatch(addNewAddress(data)).then(() => {
        dispatch(fetchAllAddresses(user._id));
        reset(); // Clear form fields
      });
    }
  };

  // Function to handle deletion of an address
  function handleDeleteAddress(cardId) {
    dispatch(deleteAddress({ userId: user._id, addressId: cardId })).then(() =>
      dispatch(fetchAllAddresses(user._id))
    );
  }

  // Function to handle edit click and pre-fill form
  function handleEditAddress(address) {
    setCurrentEditedId(address._id); // Track which address is being edited
    setValue("address", address.address);
    setValue("city", address.city);
    setValue("pincode", address.pincode);
    setValue("phone", address.phone);
    setValue("notes", address.notes);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user._id));
  }, [dispatch, user._id]);

  return (
    <Card className="p-6 rounded-xl shadow-lg bg-white border border-gray-300">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Address List</h2>

      {/* Scrollable Address List */}
      <div className="flex flex-wrap gap-3 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {addressList.length > 0 ? (
          addressList.map((item) => (
            <AddressCard
              key={item._id}
              cardInfo={item}
              handleDeleteAddress={handleDeleteAddress}
              handleEditAddress={handleEditAddress}
              setCurrAddress={setCurrAddress}
              currAddress={currAddress}
            />
          ))
        ) : (
          <p className="text-gray-500">No addresses added yet.</p>
        )}
      </div>

      {/* Address Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4 bg-gray-100 p-4 rounded-lg shadow-inner"
      >
        <div>
          <Label className="text-gray-700 font-medium">Address</Label>
          <Input
            className="mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter Address"
            {...register("address")}
          />
        </div>

        <div>
          <Label className="text-gray-700 font-medium">City</Label>
          <Input
            className="mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter City"
            {...register("city")}
          />
        </div>

        <div>
          <Label className="text-gray-700 font-medium">Pin Code</Label>
          <Input
            className="mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter Pin Code"
            {...register("pincode")}
          />
        </div>

        <div>
          <Label className="text-gray-700 font-medium">Phone</Label>
          <Input
            className="mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter Phone Number"
            {...register("phone")}
          />
        </div>

        <div>
          <Label className="text-gray-700 font-medium">Notes</Label>
          <Input
            className="mt-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter Notes"
            {...register("notes")}
          />
        </div>

        {/* Submit Button */}
        <Button
          className={`w-full mt-4 p-3 rounded-lg shadow-md text-white ${
            currentEditedId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          } transition-all`}
          type="submit"
        >
          {currentEditedId ? "Update Address" : "Add Address"}
        </Button>
      </form>
    </Card>
  );
}

export default Address;
