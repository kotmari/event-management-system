import * as yup from "yup";

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export const registerSchema = yup.object({
  name: yup.string().required("Name is required").min(3, "Minimum 3 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Minimum 6 characters"),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Minimum 6 characters"),
});


export type RegisterDto = yup.InferType<typeof registerSchema>
export type LoginDto = yup.InferType<typeof loginSchema>;

