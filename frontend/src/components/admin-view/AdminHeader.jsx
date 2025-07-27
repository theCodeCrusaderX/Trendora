import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
// import logo from '../../assets/logo.png'

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b">
      {/* Sidebar Toggle Button (Visible on Mobile) */}
      <Button 
        onClick={() => setOpen(true)} 
        className="lg:hidden flex items-center p-2 rounded-md  transition"
      >
        <AlignJustify className="w-5 h-5" />
        {/* <img src={logo} alt="" width='200px'/> */}
      </Button>

      {/* Logout Button (Aligned Right) */}
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition rounded-lg shadow"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
