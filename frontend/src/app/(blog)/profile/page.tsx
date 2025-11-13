import { Metadata } from "next";
import ProfilePageClient from "./profile-page-client";

export const metadata: Metadata = {
  title: "프로필",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
