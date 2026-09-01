import type { Metadata } from "next";
import { LoginExperience } from "@/components/auth/login-form";
export const metadata: Metadata = { title: "Sign In" };
export default function LoginPage() { return <LoginExperience />; }

