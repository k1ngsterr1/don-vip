import React from "react";
import { CheckIcon } from "lucide-react";
import PendingIcon from "@/shared/icons/pending-icon";
import CancelIcon from "@/shared/icons/cancel-icon";

interface PurchaseStatusProps {
  status: "success" | "pending" | "fail";
  isAbsolute?: boolean;
}

export const PurchaseStatus: React.FC<PurchaseStatusProps> = ({
  status,
  isAbsolute = false,
}) => {
  const renderIcon = () => {
    switch (status) {
      case "success":
        return <CheckIcon size={12} strokeWidth={3} color="#03CC60" />;
      case "pending":
        return <PendingIcon />;
      case "fail":
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (status) {
      case "success":
        return "bg-[#C4FFD9]";
      case "pending":
        return "bg-[#E4E4E4]";
      case "fail":
        return "bg-[#FFE1E1]";
      default:
        return "bg-gray-200";
    }
  };

  const baseClass =
    "w-[20px] h-[20px] rounded-full flex items-center justify-center";
  const absoluteClass = "absolute bottom-[-4px] right-[-4px] shadow-md";
  const className = `${baseClass} ${getBgColor()} ${
    isAbsolute ? absoluteClass : ""
  }`;

  return <div className={className}>{renderIcon()}</div>;
};
