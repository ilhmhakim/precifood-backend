import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { openToast } from "@/components/Toast";
import { Profile } from "@/interfaces/profile";
import { putDataAuthenticated } from "@/utils/http";
import { ChangeEmailSchema } from "@/validations/updateData";

export default function ChangeEmailDialog({
  profile,
}: {
  profile: Profile | null;
}) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const changeEmailForm = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = changeEmailForm;

  const handleUpdate = handleSubmit(async (data) => {
    try {
      await putDataAuthenticated("/auth/email", data);
      openToast({ type: "success", message: "Data berhasil diperbarui" });
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        openToast({ type: "error", message: error.message });
        console.error(error.message);
      }
    }
  });

  const handleDialogOpen = () => {
    reset();
    setOpen(true);
  };

  const handleDialogClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <TextField
          {...register("new_email")}
          required
          disabled
          id="email"
          label="Email"
          size="small"
          className="w-full mr-4"
          value={profile?.user.email || ""}
          key={profile?.user.email}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <Button
          size="small"
          onClick={handleDialogOpen}
          variant="contained"
          // className="h-10 px-6 whitespace-nowrap text-xs text-primary bg-primary/20"
          className="h-10 px-6 whitespace-nowrap text-xs text-black bg-primary/40"
        >
          Ganti Email
        </Button>
      </div>

      <Dialog onClose={handleDialogClose} open={open}>
        <DialogTitle
          id="alert-dialog-title"
          className="text-lg text-center font-semibold text-gray-800"
        >
          Ganti Email
        </DialogTitle>
        <DialogContent>
          <TextField
            className="mb-4"
            {...register("new_email")}
            required
            label="Email"
            type="email"
            size="small"
            variant="outlined"
            fullWidth
            margin="dense"
            error={!!errors.new_email}
            helperText={errors.new_email?.message}
          />
          <TextField
            {...register("password")}
            required
            id="password"
            label="Password"
            size="small"
            type={showPassword ? "text" : "password"} 
            className="w-full"
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions className="pb-8 pt-0 px-6">
          <Button onClick={handleDialogClose}>Batal</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}