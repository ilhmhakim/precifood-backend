import { UseFormReturn } from "react-hook-form";

import dayjs from "dayjs";
import { z } from "zod";

import { MenuItem, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Profile } from "@/interfaces/profile";
import { UpdateProfileSchema } from "@/validations/updateData";

export default function ProfileDataForm({
  form,
  profile,
}: {
  form: UseFormReturn<z.infer<typeof UpdateProfileSchema>>;
  profile: Profile | null;
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-wrap gap-4">
      <TextField
        required
        disabled
        id="name"
        label="Nama"
        size="small"
        className="w-full"
        placeholder="Masukkan Nama"
        value={profile?.personal_information.name || ""}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Tanggal Lahir"
          format="DD/MM/YYYY"
          disabled
          value={profile ? dayjs(profile.personal_information.birth) : null}
          slotProps={{
            textField: {
              size: "small",
              placeholder: "Masukkan Tanggal Lahir",
              required: true,
            },
          }}
          size-="small"
          className="w-full"
        />
      </LocalizationProvider>
      <TextField
        select
        required
        disabled
        label="Jenis Kelamin"
        size="small"
        className="w-full"
        value={profile?.personal_information.sex || ""}
        key={profile?.personal_information.sex}
      >
        <MenuItem value="">
          <em>Pilih Jenis Kelamin</em>
        </MenuItem>
        <MenuItem value="Laki-laki">Laki-laki</MenuItem>
        <MenuItem value="Perempuan">Perempuan</MenuItem>
      </TextField>
      <TextField
        {...register("weight", {
          setValueAs: (value) => +value,
        })}
        required
        id="weight"
        label="Berat Badan (kg)"
        type="number"
        size="small"
        className="w-full"
        placeholder="Enter Weight"
        error={!!errors.weight}
        helperText={errors.weight?.message}
        value={watch("weight") || ""}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <TextField
        {...register("height", {
          setValueAs: (value) => +value,
        })}
        required
        id="height"
        label="Tinggi Badan (cm)"
        type="number"
        size="small"
        className="w-full"
        placeholder="Masukkan Tinggi Badan"
        error={!!errors.height}
        helperText={errors.height?.message}
        value={watch("height") || ""}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <TextField
        {...register("phone")}
        required
        id="phone-number"
        label="Nomor Telepon"
        type="tel"
        size="small"
        className="w-full"
        placeholder="Masukkan Nomor Telepon"
        error={!!errors.phone}
        helperText={errors.phone?.message}
        value={watch("phone") || ""}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <TextField
        select
        {...register("medical_history")}
        required
        label="Riwayat Penyakit"
        size="small"
        className="w-full"
        error={!!errors.medical_history}
        helperText={errors.medical_history?.message}
        value={watch("medical_history") || ""}
      >
        <MenuItem value="">
          <em>Pilih Kondisi Riwayat Penyakit</em>
        </MenuItem>
        <MenuItem value="no_history">Tidak Ada</MenuItem>
        <MenuItem value="cardiovascular">Jantung Koroner/Kolesterol</MenuItem>
        <MenuItem value="diabetes">Diabetes</MenuItem>
        <MenuItem value="hypertension">Hipertensi</MenuItem>
      </TextField>
    </div>
  );
}
