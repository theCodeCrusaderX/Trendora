import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { loginAsGuest } from "@/store/auth-slice";

export default function GuestLogin() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleGuestLogin = () => {
    dispatch(loginAsGuest())
      .then((res) => {
        if (res?.payload?.success) {
          toast({
            title: "Welcome Guest!",
            description: "You have successfully logged in as a guest",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to login as guest",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.error("Error during guest login:", err);
        toast({
          title: "Error",
          description: "Failed to login as guest",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Continue as Guest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Browse and shop without creating an account
            </p>
            <Button onClick={handleGuestLogin} className="w-full">
              Enter as Guest
            </Button>
            <div className="text-sm text-center space-y-2">
              <p>
                Want to create an account?{" "}
                <Link to="/auth/register" className="text-blue-600 hover:underline">
                  Register
                </Link>
              </p>
              <p>
                Already have an account?{" "}
                <Link to="/auth/login" className="text-blue-600 hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 