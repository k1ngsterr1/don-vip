import type * as React from "react";

interface HomeIconProps {
  size?: number;
  color?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({
  size = 18,
  color = "#AAAAAB",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 18 18"
  >
    <g clipPath="url(#clip0_1_209)">
      <path
        fill={color}
        fillRule="evenodd"
        d="M.293 5.284C-.194 6.299-.023 7.487.32 9.863l.251 1.745c.44 3.052.659 4.578 1.717 5.49s2.612.911 5.717.911h1.992c3.105 0 4.658 0 5.717-.912 1.058-.911 1.278-2.437 1.717-5.489l.251-1.745c.342-2.376.513-3.564.026-4.58-.487-1.015-1.523-1.632-3.596-2.867l-1.248-.743C10.981.552 10.04-.01 9-.01s-1.981.56-3.863 1.682l-1.248.743C1.816 3.651.78 4.268.293 5.284m5.329 9.121c0-.373.302-.675.675-.675h5.406a.676.676 0 1 1 0 1.35H6.297a.676.676 0 0 1-.675-.675"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_1_209">
        <path fill="#fff" d="M0 0h18v18H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default HomeIcon;
