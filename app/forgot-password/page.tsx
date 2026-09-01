import type { Metadata } from "next";
import { ForgotPasswordExperience } from "@/components/auth/forgot-password-form";
export const metadata: Metadata = { title: "Forgot Password" };
export default function ForgotPasswordPage() { return <ForgotPasswordExperience />; }

