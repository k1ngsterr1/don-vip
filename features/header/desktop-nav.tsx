"use client";

import { useTranslations } from "next-intl";
import { NavItem } from "./nav-item";

interface DesktopNavProps {
  activeMenu: "games" | "services" | null;
  onMenuToggle: (menu: "games" | "services") => void;
  onMenuMouseEnter: (menu: "games" | "services") => void;
  onMenuMouseLeave: () => void;
}

export function DesktopNav({
  activeMenu,
  onMenuToggle,
  onMenuMouseEnter,
  onMenuMouseLeave,
}: DesktopNavProps) {
  const t = useTranslations("Header");

  return (
    <div className="hidden md:flex md:items-center md:space-x-6">
      <NavItem
        label={t("games")}
        hasSubmenu
        isActive={activeMenu === "games"}
        onClick={() => onMenuToggle("games")}
        onMouseEnter={() => onMenuMouseEnter("games")}
        onMouseLeave={onMenuMouseLeave}
      />

      <NavItem
        label={t("services")}
        hasSubmenu
        isActive={activeMenu === "services"}
        onClick={() => onMenuToggle("services")}
        onMouseEnter={() => onMenuMouseEnter("services")}
        onMouseLeave={onMenuMouseLeave}
      />

      <NavItem label={t("reviews")} href="/reviews" />
      <NavItem label={t("faq")} href="/faq" />
    </div>
  );
}
