import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const {toast} = useToast();
  
  const onSubmit = (data) => {

    console.log('form data', data);
    
  
    dispatch(loginUser(data))
      .then((res) => {
        console.log("res :: ",res);
        
        if (res?.payload?.success) {
          toast({
            title: res?.payload?.message,
            description: "You have successfully loged in",
          })
          
        }else {
          toast({
            title: "Error",
            description: res?.payload?.data,
             variant: "destructive" 
          });
        }
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        toast({
          title: "Error",
          description: res?.payload?.message,
           variant: "destructive" 
        });
      });
  };

  return (
    <div className="flex justify-center items-center p-4">
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" {...register("email")} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your password" {...register("password")} />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="text-sm text-center mt-4 space-y-2">
          <p>
            Don't have an account? <Link to="/auth/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
          <p>
            Or <Link to="/auth/guest" className="text-blue-600 hover:underline">continue as guest</Link>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
  );
}
