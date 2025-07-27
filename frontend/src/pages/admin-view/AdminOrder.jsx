import React, { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Dialog } from "@/components/ui/dialog";

import { useForm, Controller } from "react-hook-form";
import AdminOrderDetailsView from "../../components/shopping-view/AdminOrderDetailsView";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAllUser,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/admin/order-slice";

function AdminOrder() {
  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);

  const { register, control, reset } = useForm({
    defaultValues: {
      status: "",
    },
  });

  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(id) {
    dispatch(getOrderDetails(id));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAllUser());
  }, [dispatch]);

  console.log("orderList", orderList);

  useEffect(() => {
    if (orderDetails !== null) setOpenProductDetailsDialog(true);
  }, [orderDetails]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-xl font-bold mb-4">Order List</div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-gray-200">
            <TableRow className="text-left text-gray-700 uppercase font-semibold">
              <TableHead className="p-4">Order ID</TableHead>
              <TableHead className="p-4">Order Date</TableHead>
              <TableHead className="p-4">Status</TableHead>
              <TableHead className="p-4">Price</TableHead>
              <TableHead className="p-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.length > 0 ? (
              orderList.map((orderItem, index) => (
                <TableRow
                  key={orderItem._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <TableCell className="p-4 text-gray-800">
                    {orderItem._id}
                  </TableCell>
                  <TableCell className="p-4 text-gray-600">
                    {new Date(orderItem.orderDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata", // Adjusts to IST
                    })}
                  </TableCell>

                  <TableCell
                    className={`p-4 font-semibold ${
                      orderItem.orderStatus === "Delivered"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {orderItem.orderStatus}
                  </TableCell>
                  <TableCell className="p-4 text-gray-800 font-medium">
                    ${orderItem.totalAmount}
                  </TableCell>
                  <TableCell className="p-4">
                    <Dialog
                      open={openProductDetailsDialog}
                      onOpenChange={() => {
                        setOpenProductDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan="5"
                  className="text-center p-6 text-gray-500"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdminOrder;
