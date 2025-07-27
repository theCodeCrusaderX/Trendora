import { Routes, Route } from "react-router-dom";

//auth
import AuthLayout from "./components/auth/AuthLayout";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";
import GuestLogin from "./pages/auth/GuestLogin";

//admin
import AdminLayout from "./components/admin-view/Adminlayout";
import AdminDashboard from "./pages/admin-view/AdminDashboard";
import AdminOrder from "./pages/admin-view/AdminOrder";
import AdminFeatures from "./pages/admin-view/AdminFeatures";
import AdminProduct from "./pages/admin-view/AdminProduct";

//shopping-view
import ShoppingLayout from "./components/shopping-view/ShoppingLayout";
import ShoppingAccount from "./pages/shopping-view/ShoppingAccount";
import ShoppingCheckout from "./pages/shopping-view/ShoppingCheckout";
import ShoppingHome from "./pages/shopping-view/ShoppingHome";
import ShoppingListing from "./pages/shopping-view/ShoppingListing";

//not found compo
import NotFound from "./pages/not-found/NotFound";
import CheckAuth from "./components/common/CheckAuth";
import Unauth from "./pages/unauth-page/Unauth";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";

// import { Loader2 } from "lucide-react";
import { Triangle } from "react-loader-spinner";
import PaypalReturn from "./pages/shopping-view/PaypalReturn";
import PaymentSuccess from "./pages/shopping-view/PaymentSuccess";

export default function App() {
  //app state ::
  // const user = {
  //   role : "admin",
  //   name : "12"
  // }
  // const isAuthenticated = true
  // const isLoading = false

  const dispatch = useDispatch();

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  //using useEffect it prevent api to call in infinite loop
  //we put dispatch as dependency arr if it gets changes which
  //is not regularly happen for more complex project
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  console.log("user", user);
  console.log("isAuthenticated", isAuthenticated);
  console.log("isLoading", isLoading);

  if(isLoading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Triangle
        visible={true}
        height="90"
        width="90"
        color="#4fa94d"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* auth  */}
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        ></Route>

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="guest" element={<GuestLogin />} />
        </Route>

        {/* admin-view */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="products" element={<AdminProduct />} />
        </Route>

        {/* shopping layout */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="paypal-return" element={<PaypalReturn />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
        </Route>

        <Route path="*" element={<NotFound />}></Route>
        <Route path="/unauth-page" element={<Unauth />}></Route>
      </Routes>
    </div>
  );
}
