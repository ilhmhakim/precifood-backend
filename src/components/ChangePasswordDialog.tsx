import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import { openToast } from "@/components/Toast";
import { putDataAuthenticated } from "@/utils/http";
import { ChangePasswordSchema } from "@/validations/updateData";

export default function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = changePasswordForm;

  const handleUpdate = handleSubmit(async (data) => {
    try {
      await putDataAuthenticated("/auth/password", data);
      openToast({ type: "success", message: "Password berhasil diperbarui" });
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        openToast({ type: "error", message: error.message });
        console.error(error.message);
      }
    }
  });

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <TextField
          required
          disabled
          id="password"
          type="password"
          label="Password"
          size="small"
          className="w-full mr-4"
          value="password"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <Button
          size="small"
          onClick={() => setOpen(true)}
          variant="contained"
          // className="h-10 px-3 text-xs text-primary bg-primary/20"
          className="h-10 px-6 whitespace-nowrap text-xs text-black bg-primary/40"
        >
          Ganti Password
        </Button>
      </div>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle
          id="alert-dialog-title"
          className="text-xl font-semibold text-center text-gray-800"
        >
          Ganti Password
        </DialogTitle>
        <DialogContent>
          <TextField
            {...register("old_password")}
            required
            label="Password saat ini"
            type={showOldPassword ? "text" : "password"}
            size="small"
            name="old_password"
            variant="outlined"
            fullWidth
            margin="dense"
            error={!!errors.old_password}
            helperText={errors.old_password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            {...register("new_password")}
            required
            label="Password baru"
            type={showNewPassword ? "text" : "password"}
            size="small"
            name="new_password"
            variant="outlined"
            fullWidth
            margin="dense"
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            {...register("password_confirmation")}
            required
            label="Konfirmasi password"
            type={showConfirmPassword ? "text" : "password"}
            size="small"
            name="password_confirmation"
            variant="outlined"
            fullWidth
            margin="dense"
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions className="pb-8 pt-0 px-6">
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
