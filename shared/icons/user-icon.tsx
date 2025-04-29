import type * as React from "react";

interface UserIconProps {
  size?: number;
  color?: string;
}

const UserIcon: React.FC<UserIconProps> = ({
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
    <path
      fill={color}
      d="M9.011.011a4.493 4.493 0 0 1 4.495 4.495A4.493 4.493 0 0 1 9.01 9a4.493 4.493 0 0 1-4.494-4.494A4.493 4.493 0 0 1 9.01.01m0 17.978s8.989 0 8.989-2.247c0-2.697-4.382-5.618-8.989-5.618S.022 13.044.022 15.742c0 2.247 8.99 2.247 8.99 2.247"
    ></path>
  </svg>
);

export default UserIcon;
