import { useState } from "react";
import Carousel from "react-material-ui-carousel";

import Image from "next/image";
import Link from "next/link";

import { Box, Button, Typography } from "@mui/material";

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const slides = [
    {
      image: "/images/mobile.png",
      title: "PreciFood: Kenali Makananmu, Jaga Kesehatanmu!",
      description:
        "Mulai langkah kecil untuk hidup lebih sehat dengan mengenali kandungan makanan yang kamu konsumsi bersama PreciFood.",
      buttonText: "Ayo Mulai",
    },
    {
      image: "/images/mobile2.png",
      title: "Kenali PreciFood",
      description:
        "PreciFood adalah aplikasi berbasis web yang memberikan rekomendasi menu dengan kalori dan gizi seimbang, dipersonalisasi sesuai kebutuhanmu.",
      buttonText: "Lanjut",
    },
    {
      image: "/images/pilihan.png",
      title: "Jelajahi PreciFood",
      description:
        "Mulai perjalanan makan sehatmu dengan fitur rekomendasi makanan restoran spesifik. PreciFood memberikan pilihan makanan dan minuman yang dipersonalisasi, baik untuk individu sehat maupun yang memiliki riwayat Penyakit Tidak Menular (PTM).",
      buttonText: "Lanjut",
    },
    {
      image: "/images/makan.png",
      title: "Untukmu, Kondisimu. Untukmu, Makananmu.",
      description:
        "Setiap tubuh memiliki kebutuhan unik. PreciFood hadir untuk membantumu menemukan makanan terbaik yang sesuai dengan kondisimu.",
      buttonText: "Lanjut",
    },
    {
      image: "/images/join.png",
      title: "Selamat Datang!",
      description:
        "Sebelum memulai perjalanan sebagai 'Petarung Makan Sehat', yuk masuk atau daftarkan akunmu terlebih dahulu dan temukan makanan terbaik untukmu!",
      buttons: [
        {
          text: "Masuk",
          link: "/login",
          variant: "contained" as const,
        },
        {
          text: "Daftar",
          link: "/register",
          variant: "outlined" as const,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-br from-primary to-primary/80 relative">
      <Box className="relative z-10 flex justify-center">
        <Image
          src="/images/PreciFoodLogo.png"
          alt="Logo"
          width={200}
          height={100}
        />
      </Box>

      <Typography
        variant="body1"
        color="black" // diubah
        className="mt-2  mb-5 text-center italic"
      >
        Untuk Restoran Spesifik
      </Typography>

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8">
        <Carousel
          index={activeIndex}
          onChange={(index) => setActiveIndex(index ?? 0)}
          indicators={true}
          navButtonsAlwaysInvisible
          autoPlay={false}
          animation="slide"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 h-[36rem] justify-between"
            >
              <div className="relative w-64 h-64 bg-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="rounded-lg"
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold mt-6 text-gray-900">
                  {slide.title}
                </h2>
                <p className="text-gray-600 text-base mt-3">
                  {slide.description}
                </p>
                {index === 0 && (
                  <Button
                    variant="contained"
                    className="mt-6 w-full rounded-full"
                    color="primary"
                    onClick={() => setActiveIndex(1)}
                  >
                    {slide.buttonText}
                  </Button>
                )}
                {(index === 1 || index === 2 || index === 3) && (
                  <Button
                    variant="contained"
                    className="mt-6 w-full rounded-full"
                    color="primary"
                    onClick={() => setActiveIndex(index + 1)}
                  >
                    {slide.buttonText}
                  </Button>
                )}

                {slide.buttons && (
                  <div className="mt-6 flex flex-col space-y-4 w-full">
                    {slide.buttons.map((button, btnIndex) => (
                      <Link key={btnIndex} href={button.link} passHref>
                        <Button
                          variant={button.variant}
                          fullWidth
                          className="rounded-full border border-primary text-primary hover:bg-primary/50 hover:text-primary transition-all"
                          style={
                            // button.variant === "contained"
                            //   ? { backgroundColor: "primary", color: "black" }
                            //   : {}
                              button.variant === "contained"
                            ? { backgroundColor: "primary", color: "black" }
                            : button.variant === "outlined"
                            ? { color: "#A49A74", borderColor: "#A49A74" }
                            : {}
                          }
                        >
                          {button.text}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
