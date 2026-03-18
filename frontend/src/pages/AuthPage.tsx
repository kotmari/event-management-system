import { useForm } from "react-hook-form";
import { Button } from "../components/ui-components/Button";
import { Input } from "../components/ui-components/Input";

import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, registerSchema } from "../utils/validation";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuthFormData, FormValues } from "../types";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const {
    token,
    login,
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    reset();
    clearError();
  }, [isLogin, reset, clearError]);

  useEffect(() => {
    if (token) navigate("/events", { replace: true });
  }, [token, navigate]);

  const toggleMode = () => setIsLogin(!isLogin);

  const onSubmit = async (data: AuthFormData) => {
    if (isLogin) {
      await login({
        email: data.email,
        password: data.password,
      });
    } else {
      await registerUser({
        name: data.name!,
        email: data.email,
        password: data.password,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto pt-24 px-6">
      <h1 className="text-3xl font-bold mb-8">
        {isLogin ? "Login" : "Register"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <Input
            label="Name"
            placeholder="Enter full name..."
            {...register("name")}
            error={errors.name?.message}
          />
        )}
        <Input
          label="Email"
          placeholder="exemple@email.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          placeholder="********"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        {error && <div className="p-3 text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Loading..." : isLogin ? "Login" : "Register"}
        </Button>
      </form>

      <button
        onClick={toggleMode}
        className="mt-4 text-sm text-accent hover:underline w-full text-center"
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};
