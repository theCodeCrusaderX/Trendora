import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAllUser = createAsyncThunk(
  "/order/getAllOrdersForAllUser",
  async () => {
    const response = await axios.get(
      `http://localhost:8000/api/v1/admin/order/get`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `http://localhost:8000/api/v1/admin/order/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, data }) => {
    // console.log("aaaaaaaaaaaaaaaaaaaaaa",data);
    // console.log("bbbbbbbbbbbbbbbbbbbbbbb",id);

    const response = await axios.put(
      `http://localhost:8000/api/v1/admin/order/update/${id}`,
      data
    );

    return response.data;
  }
);

const AdminOrderSlice = createSlice({
  name: "AdminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAllUser.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = AdminOrderSlice.actions;

export default AdminOrderSlice.reducer;
