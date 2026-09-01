"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

export function ForgotPasswordExperience() {
  const [email, setEmail] = useState(""); const [complete, setComplete] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); if (email) setComplete(true); };
  return <AuthShell><div className="auth-form-wrap forgot-wrap reveal">{complete ? <div className="auth-success"><span><CheckCircle2 size={30} /></span><p className="eyebrow">DEMO REQUEST COMPLETE</p><h1>Reset flow previewed.</h1><p>No email was sent because authentication is not connected. In a future Cognito flow, instructions would be sent to <strong>{email}</strong>.</p><Link className="btn btn-primary btn-lg full-width" href="/login"><ArrowLeft size={17} /> Return to Sign In</Link><small><ShieldCheck size={14} /> Honest frontend demo state</small></div> : <><span className="forgot-icon"><KeyRound size={24} /></span><div className="auth-title"><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Forgot your password?</h1><p>Enter your email to preview the future password-reset experience.</p></div><form className="auth-form" onSubmit={submit}><label><span>Email Address</span><div className="auth-input"><Mail size={16} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@university.edu" required /></div></label><button type="submit" className="btn btn-primary btn-lg full-width">Send Reset Link <ArrowRight size={17} /></button></form><p className="auth-switch"><Link href="/login"><ArrowLeft size={14} /> Back to Sign In</Link></p><div className="auth-honesty"><ShieldCheck size={14} /><span><strong>No email will be sent</strong>This page demonstrates the frontend success and recovery states only.</span></div></>}</div></AuthShell>;
}

