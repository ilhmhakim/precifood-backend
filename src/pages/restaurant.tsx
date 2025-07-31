import Image from "next/image";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { Box, Card, CardContent, Typography } from "@mui/material";
import LayoutWithBottomNav from "@/components/LayoutWithBottomNav";
import { useGetRestaurantProfile } from "@/hooks/useGetData";

export default function Restaurant() {
  const { data: restaurant_profile } = useGetRestaurantProfile();

  return (
    <LayoutWithBottomNav>
      <Box className="mb-6 text-center">
        <Typography variant="h5" className="font-bold text-gray-800">
          Restoran
        </Typography>
        <hr className="border-t-2 border-primary mt-2 w-24 mx-auto" />
      </Box>

      <Box className="flex justify-center">
        <Card elevation={3} className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
          <Box className="relative w-full h-32 bg-gray-200 flex items-center justify-center">
            <Typography variant="body2" className="text-gray-500 italic">
              Gambar Belum Tersedia
            </Typography>
          </Box>

          <CardContent className="p-4">
            <Box className="flex items-center space-x-3 mb-3">
              <Typography variant="h6" className="font-bold text-gray-800">
                {restaurant_profile?.contact.name}
              </Typography>
            </Box>

            <Box className="grid grid-cols-1 gap-2">
              <Box className="flex items-center space-x-2">
                <EmailIcon className="text-gray-500" fontSize="small" />
                <Typography variant="body2" className="text-gray-700">
                  {restaurant_profile?.contact.email}
                </Typography>
              </Box>

              <Box className="flex items-center space-x-2">
                <PhoneIcon className="text-gray-500" fontSize="small" />
                <Typography variant="body2" className="text-gray-700">
                  {restaurant_profile?.contact.phone}
                </Typography>
              </Box>

              <Box className="flex items-center space-x-2">
                <LocationOnIcon className="text-gray-500" fontSize="small" />
                <Typography variant="body2" className="text-gray-700">
                  {restaurant_profile?.address.address_detail}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box className="flex justify-center mt-4">
        <Image src="/images/resto.png" alt="Restoran" width={200} height={100} />
      </Box>
    </LayoutWithBottomNav>
  );
}
