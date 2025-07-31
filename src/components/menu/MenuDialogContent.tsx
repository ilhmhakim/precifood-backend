import React from "react";

import Image from "next/image";

import { DialogContent, Divider, Typography } from "@mui/material";

import { Menu } from "@/interfaces/menu";

export default function MenuDialogContent({ menu }: { menu: Menu }) {
  return (
    (<DialogContent className="space-y-6">
      <Typography
        variant="h6"
        className="text-xl text-center font-semibold text-gray-800"
      >
        {menu.name}
      </Typography>
      <div className="w-full flex justify-center relative">
        <Image
          src={menu.image_url}
          alt={`Foto ${menu.name}`}
          width={500}
          height={500}
          className="rounded-lg shadow-md"
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
      </div>
      <div>
        <Typography variant="subtitle1" className="text-sm text-gray-600 mt-1">
          {menu.description}
        </Typography>
      </div>
      <Divider className="my-4" />
      <div className="space-y-1">
        <Typography variant="body1" className="text-gray-800">
          <strong>Porsi:</strong> {menu.portion} orang
        </Typography>
        <Typography variant="body1" className="text-gray-800">
          <strong>Kategori:</strong> {menu.category}
        </Typography>
        <Typography variant="body1" className="text-gray-800 font-medium">
          <strong>Harga:</strong> Rp{menu.price.toLocaleString("id-ID")}
        </Typography>
        <Typography variant="body1" className="font-semibold text-gray-800">
          Nutrisi:
        </Typography>
        <div className="italic text-gray-600">
          <Typography variant="body2">
            Kalori: {menu.nutrition?.calory} kcal
          </Typography>
          <Typography variant="body2">
            Protein: {menu.nutrition?.protein} gram
          </Typography>
          <Typography variant="body2">
            Karbohidrat: {menu.nutrition?.carbohydrate} gram
          </Typography>
          <Typography variant="body2">
            Lemak: {menu.nutrition?.fat} gram
          </Typography>
        </div>
      </div>
    </DialogContent>)
  );
}
