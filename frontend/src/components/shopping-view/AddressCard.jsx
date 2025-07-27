import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Edit, Trash2, MapPin, Landmark, Phone, FileText } from "lucide-react";
import { CircleCheck } from "lucide-react";

function AddressCard({
  cardInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrAddress,
  currAddress,
}) {

//   console.log('96',cardInfo);
// console.log('97',currAddress);

  const isSelected = cardInfo?._id === currAddress?._id;
  return (
    <Card
      onClick={() => setCurrAddress(cardInfo)}
      className="cursor-pointer transition-transform transform hover:scale-[1.06] hover:shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-300"
    >
      <CardContent className="flex flex-col gap-5 p-6 min-w-[320px]">
        {/* Tick Icon on Selection */}
        {isSelected && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-md">
            <CircleCheck className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <MapPin className="text-blue-600 w-5 h-5" />
          <span className="text-lg font-semibold text-gray-900">
            {" "}
            {cardInfo.address}{" "}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Landmark className="text-green-600 w-5 h-5" />
          <span className="text-md text-gray-700"> City: {cardInfo.city} </span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="text-red-600 w-5 h-5" />
          <span className="text-md text-gray-700">
            {" "}
            Pincode: {cardInfo.pincode}{" "}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="text-purple-600 w-5 h-5" />
          <span className="text-md text-gray-700">
            {" "}
            Phone: {cardInfo.phone}{" "}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <FileText className="text-yellow-600 w-5 h-5" />
          <span className="text-md text-gray-700">
            {" "}
            Notes: {cardInfo.notes}{" "}
          </span>
        </div>
      </CardContent>
      <div className="flex justify-around p-4 border-t border-gray-200 bg-gray-100">
        <Button
          onClick={(e) => {
            // e.stopPropagation();
            handleEditAddress(cardInfo);
          }}
          className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md transition-all"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
        <Button
          onClick={(e) => {
            // e.stopPropagation();
            handleDeleteAddress(cardInfo._id);
          }}
          className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-md transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default AddressCard;
