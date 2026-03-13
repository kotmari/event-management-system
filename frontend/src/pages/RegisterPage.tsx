import { useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../utils/validation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/useAuthStore';
import type { RegisterFormData } from '../types';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset,  formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema)
  });
  
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();


  const onSubmit = async (data: RegisterFormData) => {
const success = await registerUser(data);
  
  if (success) {
    reset(); 
    navigate('/'); 
  }
  };

  return (
    <div className="max-w-md mx-auto pt-24 px-6">
      <h1 className="text-3xl font-bold mb-8">Create an account</h1>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        {...register('name', { onChange: () => clearError() })}
        error={errors.name?.message}
      />
      
      <Input
        label="Email"
        {...register('email', { onChange: () => clearError() })}
        error={errors.email?.message}
      />
      
      <Input
        label="Password"
        type="password"
        {...register('password', { onChange: () => clearError() })}
        error={errors.password?.message}
      />

      {error && (
    <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
      {error}
    </div>
  )}

      <Button type="submit" disabled={isLoading}>
       {isLoading ? "Loading..." : "Register"}
      </Button>
    </form>
    </div>
  );
};



