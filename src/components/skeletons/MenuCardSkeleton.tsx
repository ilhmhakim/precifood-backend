import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
} from "@mui/material";

export default function MenuCardSkeleton() {
  return (
    <Card className="flex items-center p-3 rounded-3xl">
      <CardMedia className="w-24 h-24 relative rounded-3xl overflow-hidden">
        <Skeleton variant="rectangular" className="w-full h-full rounded-3xl" />
      </CardMedia>

      <div className="flex-1 flex flex-col justify-between pl-3">
        <CardContent className="flex-1 px-4">
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-4/5 mt-1" />
          <Skeleton className="h-4 w-4/5 mt-1" />
        </CardContent>

        <CardActions className="justify-end p-0">
          <Skeleton variant="rectangular" className="w-24 h-9 rounded-md" />
        </CardActions>
      </div>
    </Card>
  );
}
