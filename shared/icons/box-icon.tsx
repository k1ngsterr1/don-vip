import * as React from "react";

interface BoxIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  width?: number;
  height?: number;
}

const BoxIcon: React.FC<BoxIconProps> = ({
  color = "#fff",
  width = 12,
  height = 10,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 12 10"
    {...props}
  >
    <path fill={color} d="M11.333.333H0V1.89h11.333z" />
    <path
      fill={color}
      fillRule="evenodd"
      d="M.708 8.111c0 .86.635 1.556 1.417 1.556h7.083c.783 0 1.417-.696 1.417-1.556V2.667H.708zm3.528-3.92h2.89v.858h-2.89z"
      clipRule="evenodd"
    />
  </svg>
);

export default BoxIcon;
