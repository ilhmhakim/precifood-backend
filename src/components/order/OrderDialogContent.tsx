import { useEffect, useState } from "react";
import React from "react";

import { openToast } from "../Toast";

import { Button, DialogContent, Divider, Typography } from "@mui/material";

import { Order } from "@/interfaces/order";
import { deleteDataAuthenticated } from "@/utils/http";
import { formatDate } from "@/utils/string";

export default function OrderDialogContent({
  order,
  onDelete,
}: {
  order: Order;
  onDelete: () => void;
}) {
  const [isCancelDisabled, setIsCancelDisabled] = useState(true);

  useEffect(() => {
    const checkIfDisable = () => {
      const orderDate = new Date(order.ordered_at);
      const now = new Date();
      const oneHour = 60 * 60 * 1000;
      const timeElapsed = now.getTime() - orderDate.getTime();
      setIsCancelDisabled(timeElapsed >= oneHour);
    };

    checkIfDisable();

    const interval = setInterval(checkIfDisable, 1000);

    return () => clearInterval(interval);
  }, [order.ordered_at]);

  const deleteOrder = async () => {
    try {
      console.log("Deleting order with ID:", order.id);
      await deleteDataAuthenticated(`/consumers/orders/${order.id}`);
      openToast({
        type: "success",
        message: "Pesanan berhasil dibatalkan!",
      });
      onDelete(); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        openToast({ type: "error", message: error.message });
      }
    }
  };

  return (
    <DialogContent>
      <Typography
        variant="h6"
        className="font-semibold text-lg text-gray-800 mb-2"
      >
        {order.restaurant_name}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        className="text-sm text-gray-500"
      >
        {formatDate(order.ordered_at)}
      </Typography>

      {order.order_detail.map((orderDetail) => (
        <div
          key={orderDetail.id}
          className="mb-4 p-2 rounded-lg bg-gray-50 shadow-sm"
        >
          <Typography
            variant="subtitle1"
            component="div"
            className="flex justify-between items-center text-gray-700 text-lg w-full"
          >
            <span className="mr-4 flex-1">{orderDetail.menu_name}</span>
            <span className="ml-4 whitespace-nowrap">
              Rp{orderDetail.menu_price.toLocaleString("id-ID")}
            </span>
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            className="text-sm text-gray-600"
          >
            Porsi untuk: {orderDetail.menu_portion} orang
          </Typography>
        </div>
      ))}

      <Divider className="my-4" />

      <div className="flex justify-between items-center mt-4">
        <Typography variant="body1" className="text-gray-800 font-semibold">
          Total Harga: Rp{order.total_price.toLocaleString("id-ID")}
        </Typography>
      </div>

      <Button
        variant="contained"
        color="error"
        disabled={isCancelDisabled}
        onClick={deleteOrder}
        className="mt-4 w-full"
      >
        Batalkan Pesanan
      </Button>

      {isCancelDisabled && (
        <Typography
          variant="body2"
          color="textSecondary"
          className="mt-2 text-center text-sm text-gray-500 italic"
        >
          Pesanan yang sudah melewati 1 jam tidak dapat dibatalkan
        </Typography>
      )}
    </DialogContent>
  );
}
