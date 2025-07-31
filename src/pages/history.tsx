import { Alert } from "@mui/material";

import LayoutWithBottomNav from "@/components/LayoutWithBottomNav";
import OrderList from "@/components/order/OrderList";
import MenuListSkeleton from "@/components/skeletons/MenuListSkeleton";
import { useGetOrders } from "@/hooks/useGetData";

export default function History() {
  const { data: orders, errorMessage, isLoading } = useGetOrders();

  return (
    <LayoutWithBottomNav>
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
        <hr className="border-t-2 border-primary mt-2 w-24 mx-auto" />
      </div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isLoading ? (
        <MenuListSkeleton />
      ) : orders ? (
        <OrderList orderlist={orders} />
      ) : null}
    </LayoutWithBottomNav>
  );
}
