import React from "react";

interface BannerProps {
  backgroundImage: string;

  height?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

export const Banner: React.FC<BannerProps> = ({
  backgroundImage,

  height = "400px",
  overlay = true,
  children,
}) => {
  return (
    <div
      className="relative flex items-center justify-center text-white text-center px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height,
      }}
    >
      {overlay && <div className="absolute inset-0 z-0"></div>}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
