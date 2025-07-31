import { Card, CardActions, CardContent } from "@mui/material";

import InfoOrderDialog from "@/components/order/InfoOrderDialog";
import { SimpleOrder } from "@/interfaces/order";
import { formatDate } from "@/utils/string";

export default function OrderCard({
  order,
  onRemove,
}: {
  order: SimpleOrder;
  onRemove: (id: number) => void;
}) {
  return (
    <Card className="flex items-center p-2 rounded-3xl">
      <div className="flex-1 flex flex-col justify-between">
        <CardContent className="flex-1 p-2 flex justify-between items-start">
          <div>
            <div className="font-bold text-xl">{order.restaurant_name}</div>
            <div className="text-sm">
              Rp{order.total_price.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="text-gray-500 text-xs text-right mt-2">
            {formatDate(order.ordered_at)}
          </div>
        </CardContent>
        <CardActions className="justify-end p-2">
          <InfoOrderDialog id={order.id} onRemove={onRemove} />
        </CardActions>
      </div>
    </Card>
  );
}
