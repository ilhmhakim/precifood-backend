import UserSchema from "@/validations/user";

export const UpdateDataSchema = UserSchema.pick({
  weight: true,
  height: true,
  medical_history: true,
});

export const UpdateProfileSchema = UserSchema.pick({
  phone: true,
  height: true,
  weight: true,
  medical_history: true,
});

export const ChangeEmailSchema = UserSchema.pick({
  new_email: true,
  password: true,
});

export const ChangePasswordSchema = UserSchema.pick({
  old_password: true,
  new_password: true,
  password_confirmation: true,
});
