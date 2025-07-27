import { Outlet } from "react-router-dom"; //outlet means children of layout.jsx

import authBg from "../../assets/authBgNew.avif";




function AuthLayout() {



  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-black">
        <div className="max-w-md space-y-6 text-center text-primary-foreground">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to Trendora 
          </h1>
        </div>
      </div>
      <div
        className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${authBg})`,
        }}
      >
        {/* Renders the child route's element, if there is one. */}
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
