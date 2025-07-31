import Image from "next/image";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import InfoMenuDialog from "@/components/menu/InfoMenuDialog";
import { Menu } from "@/interfaces/menu";
import { truncateText } from "@/utils/string";

export default function MenuCard({ menu }: { menu: Menu }) {
  return (
    (<Card className="flex items-center p-4 rounded-3xl">
      <CardMedia className="w-24 h-24 rounded-3xl">
        <Image
          src={menu.image_url}
          alt={`Foto ${menu.name}`}
          width={200}
          height={200}
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
      </CardMedia>
      <div className="flex-1 flex flex-col justify-between">
        <CardContent className="flex-1 px-4">
          <div className="font-bold text-xl">{menu.name}</div>
          <div className="text-sm">{truncateText(menu.description, 50)}</div>
          <div className="text-base font-medium">Rp{menu.price.toLocaleString("id-ID")}</div>
        </CardContent>
        <CardActions className="justify-end p-0">
          <InfoMenuDialog id={menu.id} />
        </CardActions>
      </div>
    </Card>)
  );
}
