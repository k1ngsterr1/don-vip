import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";
import { ProfileMenu } from "@/entities/user/ui/profile-menu/profile-menu";

// Mock user data
const mockUser = {
  id: "6758797",
  firstName: "Винсент",
  lastName: "Вега",
  avatar: "/ava.png",
  gender: "male" as const,
  birthDate: "02.11.1992",
  phone: "+7 903 000 00 00",
  email: "mail@gmail.com",
  socialProvider: "vk" as const,
};

export default function ProfilePage() {
  return (
    <>
      <ProfileHeaderEditable user={mockUser} />
      <ProfileMenu />
    </>
  );
}
