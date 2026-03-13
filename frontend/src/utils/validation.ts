import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name too short'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
});

export const eventSchema = yup.object({
  title: yup.string().required("Title is required").min(3),
  description: yup.string().required().min(10).max(500),
  date: yup.string().required("Date is required"), 
  time: yup.string().required("Time is required"), 
  location: yup.string().required(),
  capacity: yup.number().nullable().transform((v) => (isNaN(v) ? null : v)).optional(),
  isPublic: yup.boolean().default(true),
});