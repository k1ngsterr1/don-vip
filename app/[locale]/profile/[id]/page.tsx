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
    <div className="md:max-w-6xl md:mx-auto md:px-8 md:py-8 lg:py-12">
      <div className="md:flex md:gap-8 lg:gap-12">
        {/* Left column for desktop - profile header */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-100 md:p-6">
            <ProfileHeaderEditable user={mockUser} />
          </div>
        </div>

        {/* Right column for desktop - menu */}
        <div className="md:w-2/3 lg:w-3/4">
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}
