import * as yup from "yup";

export interface CreateEventDTO {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity?: number | null;
  tagIds?: number[];
  isPublic: boolean;
}

export const eventSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Minimum 3 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Minimum 10 characters")
    .max(500, "Description is too long"),
  date: yup
    .date()
    .required("Date and time are required")
    .min(new Date(), "Event cannot be in the past"),

  location: yup.string().required("Location is required"),

  capacity: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .positive("Capacity must be a positive number")
    .optional(),

    tagIds: yup
    .array()
    .of(yup.number())
    .max(5, "You can select up to 5 tags maximum")
    .optional()
    .default([]),

  isPublic: yup.boolean().default(true),
});

export type CreateEventDto = yup.InferType<typeof eventSchema>;
