import { useForm } from "react-hook-form";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import type { LoginFormData } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validation";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom"; 

export const LoginPage = () => {
  const navigate = useNavigate();
  
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });

  
  const { login: loginUser, isLoading, error, clearError } = useAuthStore();

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await loginUser(data);
    if (success) {
      reset();
      navigate("/"); 
    }
  };

  return (
    <div className="max-w-md mx-auto pt-24 px-6">
       <h1 className="text-3xl font-bold mb-8">Login</h1>
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         
         <Input
           label="Email"
           {...register('email')} 
           error={errors.email?.message}
         />
         
         <Input
           label="Password"
           type="password"
           {...register('password')} 
           error={errors.password?.message}
         />
   
         {error && (
           <div className="p-3 mb-4 text-sm text-red-600">
             {error}
           </div>
         )}
   
         <Button type="submit" disabled={isLoading} className="w-full">
           {isLoading ? "Loading..." : "Login"}
         </Button>
       </form>
    </div>
  );
};
  

