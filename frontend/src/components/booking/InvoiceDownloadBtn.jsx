import React from "react";
import { Printer, Download, Receipt } from "lucide-react";
import Button from "../common/Button";

export const InvoiceDownloadBtn = ({ bill, onPrint, label = "Print / Download Invoice" }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      icon={Printer}
      onClick={handlePrint}
      className="no-print"
    >
      {label}
    </Button>
  );
};

export default InvoiceDownloadBtn;
