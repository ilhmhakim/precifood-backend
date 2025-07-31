import { useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { useRouter } from "next/router";

import { Dayjs } from "dayjs";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Link,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { postData } from "@/utils/http";
import { RegisterSchema } from "@/validations/auth";

export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue("birth", newValue?.format("YYYY-MM-DD") || "");
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = registerForm;

  const signup = handleSubmit(async (data) => {
    try {
      await postData("/signup/consumer", data);
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  });

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-primary px-4">
      <Box className="relative z-10 flex justify-center mt-6">
        <Image
          src="/images/PreciFoodLogo.png"
          alt="Logo"
          width={100}
          height={40}
        />
      </Box>

      <Typography
        variant="body1"
        color="black" // diubah
        className="mt-1 text-center italic"
      >
        Untuk Restoran Spesifik
      </Typography>

      <Paper
        elevation={4}
        className="relative z-10 w-full max-w-sm p-4 mt-3 bg-white rounded-lg shadow-lg mb-8"
      >
        <Box className="flex items-center mb-3">
          <IconButton onClick={() => router.push("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1" className="font-medium ml-2">
            Daftar Akun
          </Typography>
        </Box>

        <Box className="flex justify-center">
          <Image
            src="/images/daftar.svg"
            alt="Join Illustration"
            width={150}
            height={100}
          />
        </Box>

        <Typography variant="h6" className="text-center font-bold mt-2">
          Daftar Akun
        </Typography>
        <Typography variant="body2" className="text-center text-gray-600">
          Peduli dengan apa yang kamu konsumsi?
          <br />
          Daftar Sekarang!
        </Typography>

        <form onSubmit={signup} className="mt-3">
          <Box className="mb-3">
            <TextField
              {...register("name")}
              required
              label="Nama"
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Masukkan Nama"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>

          <Box className="mb-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal Lahir"
                format="DD/MM/YYYY"
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    error: !!errors.birth,
                    helperText: errors.birth?.message,
                    required: true,
                    size: "small",
                  },
                }}
                className="w-full"
              />
            </LocalizationProvider>
          </Box>

          <Box className="mb-3">
            <TextField
              select
              {...register("sex")}
              required
              label="Jenis Kelamin"
              fullWidth
              variant="outlined"
              size="small"
              error={!!errors.sex}
              helperText={errors.sex?.message}
              value={watch("sex") || ""}
            >
              <MenuItem value="">
                <em>Pilih Jenis Kelamin</em>
              </MenuItem>
              <MenuItem value="Laki-laki">Laki-laki</MenuItem>
              <MenuItem value="Perempuan">Perempuan</MenuItem>
            </TextField>
          </Box>

          <Box className="mb-3">
            <TextField
              {...register("weight", {
                setValueAs: (value) => +value,
              })}
              required
              id="weight"
              label="Berat Badan (kg)"
              type="number"
              className="w-full"
              size="small"
              placeholder="Masukkan Berat Badan"
              error={!!errors.weight}
              helperText={errors.weight?.message}
            />
          </Box>

          <Box className="mb-3">
            <TextField
              {...register("height", {
                setValueAs: (value) => +value,
              })}
              required
              id="height"
              label="Tinggi Badan (cm)"
              type="number"
              className="w-full"
              size="small"
              placeholder="Mausukkan Tinggi Badan"
              error={!!errors.height}
              helperText={errors.height?.message}
            />
          </Box>

          <Box className="mb-3">
            <TextField
              {...register("email")}
              required
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Masukkan Email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>

          <Box className="mb-3">
            <TextField
              {...register("phone")}
              required
              label="Nomor Telepon"
              type="tel"
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Masukkan Nomor Telepon"
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Box>

          <Box className="mb-3">
            <TextField
              {...register("password")}
              required
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Masukkan Password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>

          <Box className="mb-3">
            <TextField
              {...register("password_confirmation")}
              required
              label="Konfirmasi Password"
              type="password"
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Masukkan Konfirmasi Password"
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
            />
          </Box>

          <Box className="mb-3">
            <TextField
              select
              {...register("medical_history")}
              required
              label="Riwayat Penyakit"
              fullWidth
              variant="outlined"
              size="small"
              error={!!errors.medical_history}
              helperText={errors.medical_history?.message}
              value={watch("medical_history") || ""}
            >
              <MenuItem value="">
                <em>Pilih Kondisi Riwayat Penyakit</em>
              </MenuItem>
              <MenuItem value="no_history">Tidak Ada</MenuItem>
              <MenuItem value="cardiovascular">
                Jantung Koroner/Kolesterol
              </MenuItem>
              <MenuItem value="diabetes">Diabetes</MenuItem>
              <MenuItem value="hypertension">Hipertensi</MenuItem>
            </TextField>
          </Box>

          <Button
            variant="contained"
            fullWidth
            type="submit"
            className="bg-primary text-black py-2 mt-3" // diubah
          >
            Daftar
          </Button>
        </form>

        {errorMessage && (
          <Alert severity="error" className="mt-3 mb-2">
            {errorMessage}
          </Alert>
        )}

        <Typography variant="body2" className="text-center mt-3">
          Sudah Punya Akun?{" "}
          {/* <Link href="/login" className="font-bold"> */}
          <Link href="/login" className="font-bold" style={{ color: "#A49A74" }}>
            Masuk
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
