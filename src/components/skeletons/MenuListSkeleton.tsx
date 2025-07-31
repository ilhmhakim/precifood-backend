import MenuCardSkeleton from "@/components/skeletons/MenuCardSkeleton";

export default function MenuListSkeleton({
  itemCount = 5,
}: {
  itemCount?: number;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: itemCount }).map((_, index) => (
        <MenuCardSkeleton key={index} />
      ))}
    </div>
  );
}
