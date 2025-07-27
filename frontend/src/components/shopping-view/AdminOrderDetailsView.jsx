import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../ui/select";
import {
  getAllOrdersForAllUser,
  getOrderDetails,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "@/hooks/use-toast";

function AdminOrderDetailsView({ orderDetails }) {
  const { toast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { handleSubmit, control, reset } = useForm();

  const defaultValues = {
    status: "",
  };

  function onSubmit(data) {
    console.log('5565',data);

    if(!data.status) {
      toast({
        title : 'Please Select Status to update',
        variant : 'destructive'
      })
      return;
    }
    dispatch(updateOrderStatus({ id: orderDetails._id, data })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetails(orderDetails?._id));
        dispatch(getAllOrdersForAllUser());
        reset(defaultValues);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[650px] bg-white shadow-lg rounded-lg p-6 max-h-[80vh] overflow-y-auto">
      <div className="grid gap-6">
        {/* Order Summary */}

        <div className="grid gap-3 border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
          <div className="grid gap-2 text-gray-700">
            <div className="flex justify-between">
              <p className="font-medium">Order ID:</p>
              <Label className="text-gray-600">{orderDetails?._id}</Label>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Order Date:</p>
              <Label className="text-gray-600">
                {orderDetails?.orderDate.split("T")[0]}
              </Label>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Order Price:</p>
              <Label className="text-gray-600">
                ${orderDetails?.totalAmount}
              </Label>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Payment Method:</p>
              <Label className="text-gray-600">
                {orderDetails?.paymentMethod}
              </Label>
            </div>
            <div className="flex justify-between">
              <p className="font-medium">Payment Status:</p>
              <Label className="text-gray-600">
                {orderDetails?.paymentStatus}
              </Label>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">Order Status:</p>
              <Badge
                className={`py-1 px-3 text-white rounded-full ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-gray-700"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="grid gap-3 border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
          <ul className="grid gap-3">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails?.cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-gray-700 p-2 bg-gray-100 rounded-md"
                >
                  <span className="font-medium">{item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span className="font-semibold text-gray-900">
                    ${item.price}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No items in this order.</p>
            )}
          </ul>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-3 border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Shipping Info</h2>
          <div className="grid gap-1 text-gray-700">
            <span className="font-medium">{user.userName}</span>
            <span>{orderDetails?.addressInfo?.address}</span>
            <span>{orderDetails?.addressInfo?.city}</span>
            <span>{orderDetails?.addressInfo?.pincode}</span>
            <span>{orderDetails?.addressInfo?.phone}</span>
            <span className="text-gray-500">
              {orderDetails?.addressInfo?.notes}
            </span>
          </div>
        </div>

        {/* Order Status Update */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <Label className="font-medium text-gray-800">
              Update Order Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 text-gray-700">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-md rounded-md">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inProcess">In Process</SelectItem>
                    <SelectItem value="inShipping">In Shipping</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Update Order Status
          </Button>
        </form>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
