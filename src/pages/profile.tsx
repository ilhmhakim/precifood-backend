import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import dayjs from "dayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";

import ChangeEmailDialog from "@/components/ChangeEmailDialog";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { openConfirmationDialog } from "@/components/ConfirmationDialog";
import LayoutWithBottomNav from "@/components/LayoutWithBottomNav";
import { LogoutButton } from "@/components/LogoutButton";
import ProfileDataForm from "@/components/ProfileDataForm";
import { openToast } from "@/components/Toast";
import { useGetProfile } from "@/hooks/useGetData";
import { patchDataAuthenticated } from "@/utils/http";
import { UpdateProfileSchema } from "@/validations/updateData";

export default function Profile() {
  const { data: profile } = useGetProfile();
  const profileForm = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
  });

  const { handleSubmit, setValue } = profileForm;

  const handleUpdate = handleSubmit(async (data) => {
    const confirmation = await openConfirmationDialog({
      title: "Konfirmasi Edit Profil",
      description: "Apakah Anda yakin ingin mengedit profil Anda?",
    });
    if (!confirmation) return;
    try {
      await patchDataAuthenticated("/users/consumers/profile", data);
      openToast({ type: "success", message: "Profil berhasil diperbarui" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        openToast({ type: "error", message: error.message });
        console.error(error.message);
      }
    }
  });

  useEffect(() => {
    if (!profile) return;
    setValue("phone", profile.personal_information.phone);
    setValue("height", profile.personal_information.height);
    setValue("weight", profile.personal_information.weight);
    setValue("medical_history", profile.medical_history);
  }, [profile, setValue]);

  return (
    <LayoutWithBottomNav>
      <Box className="flex flex-col items-center text-center">
        <Typography variant="h5" className="font-semibold">
          {profile?.personal_information?.name || "Pengguna"}
        </Typography>
        <Typography variant="body2" className="text-gray-500 italic">
          Terdaftar:{" "}
          {profile?.user?.registered_at
            ? dayjs(profile.user.registered_at).format("DD/MM/YYYY")
            : "-"}
        </Typography>
      </Box>

      <Divider className="my-4" />

      <Paper className="w-full max-w-md p-5 mx-auto bg-white rounded-lg shadow-lg">
        <Box className="flex justify-center">
          <Image src="/images/edit.png" alt="Edit Profil" width={200} height={100} />
        </Box>

        <Box className="mb-6">
          <ProfileDataForm form={profileForm} profile={profile} />
        </Box>

        <Box className="space-y-4">
          <ChangeEmailDialog profile={profile} />
          <ChangePasswordDialog />
        </Box>
      </Paper>

      <Box className="flex flex-col items-center w-full max-w-md mx-auto space-y-4 mt-6">
        <Button
          variant="contained"
          onClick={handleUpdate}
          className="w-full border-2 border-primary bg-primary text-black rounded-full py-3 font-semibold hover:bg-primary/50 hover:text-primary"
        >
          Simpan
        </Button>
        <LogoutButton />
      </Box>
    </LayoutWithBottomNav>
  );
}
