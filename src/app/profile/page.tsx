import type { Metadata } from "next";

import ProfileView from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "My Profile — BookNook",
  description:
    "Update your BookNook name and photo, then play the daily riddle to level up your reading profile.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
