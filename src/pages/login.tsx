import { useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { useRouter } from "next/router";

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

import { useGetRestaurants } from "@/hooks/useGetData";
import { setCookie } from "@/utils/cookie";
import { postData } from "@/utils/http";
import { LoginSchema } from "@/validations/auth";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: restaurants } = useGetRestaurants(); // Fetch restaurants
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = loginForm;

  const login = handleSubmit(async (data) => {
    try {
      const responseData = await postData("/auth/login", data);
      setCookie("token", responseData.access_token);
      setCookie("restaurant_id", data.restaurant_id);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  });

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-primary p-6">
      {/* Logo */}
      <Box className="relative z-10 flex justify-center">
        <Image
          src="/images/PreciFoodLogo2.png"
          alt="Logo"
          width={200}
          height={100}
        />
      </Box>

      <Typography
        variant="body1"
        color="black" //diubah
        className="mt-2 text-center italic"
      >
        Untuk Restoran Spesifik
      </Typography>

      <Paper
        elevation={4}
        className="relative z-10 w-full max-w-sm p-5 mt-6 bg-white rounded-lg shadow-lg"
      >
        <Box className="flex items-center mt-2">
          <IconButton onClick={() => router.push("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1" className="font-medium ml-2">
            Masuk Akun
          </Typography>
        </Box>

        <Box className="flex justify-center">
          <Image
            src="/images/masuk.png"
            alt="Join Illustration"
            width={250}
            height={120}
          />
        </Box>

        <Typography variant="h5" className="text-center font-bold mt-2">
          Masuk Akun
        </Typography>
        <Typography variant="body2" className="text-center text-gray-600">
          Pilihan kecil, dampak besar! Masuk ke akunmu dan terus jaga pilihan
          makananmu yang lebih baik!
        </Typography>

        <form onSubmit={login} className="mt-4">
          <Box className="mb-3">
            <TextField
              {...register("email")}
              required
              label="Email"
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
              select
              {...register("restaurant_id")}
              required
              label="Pilih Restoran"
              fullWidth
              variant="outlined"
              size="small"
              error={!!errors.restaurant_id}
              helperText={errors.restaurant_id?.message}
              value={watch("restaurant_id") || ""}
            >
              <MenuItem value="">
                <em>Pilih Restoran</em>
              </MenuItem>
              {restaurants?.map((restaurant) => (
                <MenuItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Button
            variant="contained"
            fullWidth
            type="submit"
            className="bg-primary text-black py-2 mt-3" // diubah
          >
            Masuk
          </Button>
        </form>

        {errorMessage && (
          <Alert severity="error" className="mt-3 mb-2">
            {errorMessage}
          </Alert>
        )}

        <Typography variant="body2" className="text-center mt-3">
          Tidak Punya Akun?{" "}
          {/* <Link href="/register" className="font-bold"> */}
          <Link href="/register" className="font-bold" style={{ color: "#A49A74" }}>
            Daftar
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
