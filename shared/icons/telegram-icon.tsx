import * as React from "react";

interface TelegramIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

const TelegramIcon: React.FC<TelegramIconProps> = ({
  width = 14,
  height = 13,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 14 13"
    {...props}
  >
    <path
      fill="#C8DAEA"
      d="M5.21 9.115c-.436.069-.411-.03-.567-.24L2.99 6.66l9.21-4.854"
    />
    <path
      fill="#A9C9DD"
      d="M5.07 9.137c.229-.016.356-.072.516-.13l1.437-.608-1.86-.27"
    />
    <path
      fill="#F6FBFE"
      d="m5.46 8.51 5.216 4.108c.54.374 1.004.166 1.159-.58L13.96 1.328c.193-.913-.348-1.328-.927-1.037L.629 5.438c-.811.332-.811.872-.154 1.08l3.207 1.078 7.342-5.022c.347-.207.656-.124.425.166"
    />
  </svg>
);

export default TelegramIcon;
