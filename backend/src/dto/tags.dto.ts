import * as yup from "yup";

export interface TagsDTO {
  name: string;
}

export const tagsSchema = yup.object({
   name: yup.string().trim().min(2).required("Tag name is required"),
});

export type TagsDto = yup.InferType<typeof tagsSchema>;
