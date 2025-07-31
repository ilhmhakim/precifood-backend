import { useCallback, useRef, useState } from "react";

import { Button, Dialog, DialogActions } from "@mui/material";

import { openConfirmationDialog } from "@/components/ConfirmationDialog";
import SuccessOrderDialogContent from "@/components/order/SuccessOrderDialogContent";
import { SuccessOrder } from "@/interfaces/order";
import { postDataAuthenticated } from "@/utils/http";

export default function InfoSuccessOrderDialog({
  id,
  closeRecommendationDialog,
}: {
  id: number;
  closeRecommendationDialog: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState<SuccessOrder | null>(null);
  const orderFetched = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      if (orderFetched.current) return;
      const data = await postDataAuthenticated(`/consumers/orders/${id}`);
      setSuccess(data);
      orderFetched.current = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [id]);

  const openInfoSuccessOrderDialog = async () => {
    const confirmation = await openConfirmationDialog({
      title: "Konfirmasi Order",
      description: "Apakah Anda yakin ingin memesan menu ini?",
    });
    if (!confirmation) return;
    fetchData();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeRecommendationDialog();
  };

  return (
    <div>
      <Button
        className="rounded-3xl"
        size="small"
        variant="contained"
        onClick={openInfoSuccessOrderDialog}
      >
        Order
      </Button>

      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        {success ? <SuccessOrderDialogContent success={success} /> : null}
        <DialogActions className="justify-center mb-2">
          <Button
            variant="contained"
            className="rounded-3xl"
            onClick={handleClose}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
