import { useState } from "react";

import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

interface ToastProps {
  type: "success" | "warning" | "error" | "info";
  message: string;
}

let openToast: (props: ToastProps) => void;

export function Toast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "warning" | "error" | "info">(
    "success",
  );

  const handleOpen = (props: ToastProps) => {
    setType(props.type);
    setMessage(props.message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  openToast = handleOpen;

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      key="slide"
      autoHideDuration={2000}
      className="fixed bottom-20"
    >
      <Alert onClose={handleClose} severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export { openToast };
