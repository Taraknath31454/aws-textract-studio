import type { Metadata } from "next";
import { SignupExperience } from "@/components/auth/signup-form";
export const metadata: Metadata = { title: "Create Account" };
export default function SignupPage() { return <SignupExperience />; }

