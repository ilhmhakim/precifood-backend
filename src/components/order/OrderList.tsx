import { useMemo, useState } from "react";

import OrderCard from "@/components/order/OrderCard";
import { SimpleOrder } from "@/interfaces/order";

export default function OrderList({ orderlist }: { orderlist: SimpleOrder[] }) {
  const [orders, setOrders] = useState(orderlist);

  const sortedOrders = useMemo(() => {
    return orders.sort((a, b) => {
      const dateA = new Date(a.ordered_at);
      const dateB = new Date(b.ordered_at);
      return dateB.getTime() - dateA.getTime();
    });
  }, [orders]);

  const handleRemoveOrder = (id: number) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  return (
    <div className="space-y-2">
      {sortedOrders.map((order) => (
        <OrderCard order={order} key={order.id} onRemove={handleRemoveOrder} />
      ))}
    </div>
  );
}
