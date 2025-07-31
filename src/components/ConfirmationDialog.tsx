import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmationDialogProps {
  title: string;
  description: string;
}

let openConfirmationDialog: (
  props: ConfirmationDialogProps,
) => Promise<boolean>;

export function ConfirmationDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resolvePromise, setResolvePromise] = useState<
    (value: boolean) => void
  >(() => {});

  const handleOpen = (props: ConfirmationDialogProps) => {
    setTitle(props.title);
    setDescription(props.description);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleClose = (result: boolean) => {
    setOpen(false);
    resolvePromise(result);
  };

  openConfirmationDialog = handleOpen;

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle
        id="alert-dialog-title"
        className="text-lg font-semibold text-center text-gray-800"
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions className="pb-8 pt-0 px-6">
        <Button onClick={() => handleClose(false)}>Batal</Button>
        <Button variant="contained" onClick={() => handleClose(true)}>
          Ya
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { openConfirmationDialog };
