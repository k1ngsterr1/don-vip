import { ProfileEditForm } from "@/entities/user/ui/profile-edit-form/profile-edit-form";
import { ProfileHeaderEditable } from "@/entities/user/ui/profile-header-editable/profile-header-editable";

// Mock user data
const mockUser = {
  id: "6758797",
  firstName: "Винсент",
  lastName: "Вега",
  gender: "male" as const,
  birthDate: "02.11.1992",
  phone: "+7 903 000 00 00",
  email: "mail@gmail.com",
};

export default function ProfileEditPage() {
  return (
    <main className="px-4">
      <ProfileHeaderEditable user={mockUser} />
      <ProfileEditForm user={mockUser} />
    </main>
  );
}
