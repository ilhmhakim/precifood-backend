import UserSchema from "@/validations/user";
import { z } from "zod";

export const RegisterSchema = UserSchema.omit({
  new_email: true,
  new_password: true,
  old_password: true,
});

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
}).merge(
  z.object({
    restaurant_id: z.string(),
  })
);
