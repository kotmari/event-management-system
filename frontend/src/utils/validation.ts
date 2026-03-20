import * as yup from 'yup';
import { ObjectSchema } from "yup";
import type { IEventForm } from '../types';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Min 6 characters'),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Min 6 characters'),
 });

export const eventSchema: ObjectSchema<IEventForm> = yup.object({
  title: yup.string().required("Title is required").min(3),
  description: yup.string().required().min(10).max(500),
  date: yup.string().required("Date is required"), 
  time: yup.string().required("Time is required"), 
  location: yup.string().required(),
  tagIds: yup.array().of(yup.number().required()).optional().default([]),
  capacity: yup.number().transform((v) => (isNaN(v) ? null : v)).nullable().optional(),
  isPublic: yup.boolean().default(true),
});