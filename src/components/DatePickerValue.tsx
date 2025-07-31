import { useState } from "react";

import { Dayjs } from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DatePickerValue({
  onDateChange,
}: {
  onDateChange?: (date: string) => void;
}) {
  const [value, setValue] = useState<Dayjs | null>(null);

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (onDateChange) {
      onDateChange(newValue?.format("YYYY-MM-DD") || "");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date of birth"
        value={value}
        className="w-96"
        onChange={handleDateChange}
        slotProps={{
          textField: {
            placeholder: "Enter Date of Birth",
            required: true,
            InputLabelProps: {
              shrink: true,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
