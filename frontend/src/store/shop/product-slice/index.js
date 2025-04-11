import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const getFilteredProduct = createAsyncThunk(
  "/product/getFilteredProduct",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });
    const res = await axios.get(
      `https://trendora-backend-uonr.onrender.com/api/v1/shop/getProduct?${query}`
    );

    return res;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `https://trendora-backend-uonr.onrender.com/api/v1/shop/getProductDetail/${id}`
    );

    return result?.data;
  }
);

const shopProductSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilteredProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFilteredProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log(action.payload?.data?.data);
        state.productList = action.payload?.data?.data;
      })
      .addCase(getFilteredProduct.rejected, (state) => {
        (state.isLoading = false), (state.productList = []);
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

// TODO :
export const { setProductDetails } = shopProductSlice.actions;

export default shopProductSlice.reducer;
