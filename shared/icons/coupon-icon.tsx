import * as React from "react";

interface CouponIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  width?: number;
  height?: number;
}

const CouponIcon: React.FC<CouponIconProps> = ({
  color = "#F6FBFE",
  width = 14,
  height = 20,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 14 20"
    {...props}
  >
    <path
      fill={color}
      d="m11.827 13.264.957-.956a.96.96 0 0 0 .008-1.36L6.127 4.293a.964.964 0 0 0-1.363.007l-.964.963c.294.393.26.955-.101 1.316a1.01 1.01 0 0 1-1.318.101l-.965.963a.96.96 0 0 0-.007 1.36l6.665 6.655a.964.964 0 0 0 1.362-.007l.958-.957a1.007 1.007 0 0 1 .04-1.39 1.01 1.01 0 0 1 1.393-.04m-8.76-3.468-.233-.233.615-.613.233.232zm1.08-1.078-.233-.233.614-.613.233.232zm1.08-1.078-.234-.233.615-.614.233.233zm1.079-1.078-.233-.233.614-.613.233.232z"
    />
  </svg>
);

export default CouponIcon;
