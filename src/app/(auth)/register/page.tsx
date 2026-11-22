"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Eye, EyeOff, Lock, Mail, Sparkles, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";


const strengthSteps = [
  { label: "Too weak", color: "bg-[#C4B0F5]" },
  { label: "Weak", color: "bg-[#8B5CF6]" },
  { label: "Good", color: "bg-[#5426B8]" },
  { label: "Strong", color: "bg-[#451D96]" },
];

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const score = useMemo(() => passwordScore(password), [password]);
  const step = score > 0 ? strengthSteps[score - 1] : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#5426B8] via-[#451D96] to-[#2E1266] px-4 py-10">
      {/* Decorative background shapes */}
      <BookOpen size={340} className="absolute -left-24 -top-20 text-white/5" />
      <Sparkles size={220} className="absolute -right-16 top-24 text-white/5" />
      <BookOpen size={260} className="absolute -bottom-20 right-24 text-white/5" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#8B5CF6]/20 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#C4B0F5]/10 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-6 flex flex-col items-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
            <BookOpen size={28} strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Book<span className="text-[#C4B0F5]">Nook</span>
          </h1>
          <p className="text-[10px] font-semibold tracking-[2.5px] text-white/60">
            READ • BORROW • EXPLORE
          </p>
        </Link>

        {/* Card */}
        <Card className="rounded-3xl border-white/60 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#19152B]">
              Create your account
            </CardTitle>
            <CardDescription>
              Join the nook — borrow, read, and grow.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Social */}

            

            <form
              className="space-y-4"
              action="/"
              onSubmit={(e) => {
                if (!agreed) e.preventDefault();
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="first-name" className="font-semibold text-[#19152B]">
                    First name
                  </Label>
                  <div className="relative">
                    <UserRound
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="h-11 rounded-xl border-[#dcd6cc] bg-white pl-10 pr-4 text-sm text-[#19152B] placeholder:text-gray-400 focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="last-name" className="font-semibold text-[#19152B]">
                    Last name
                  </Label>
                  <div className="relative">
                    <UserRound
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="last-name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="h-11 rounded-xl border-[#dcd6cc] bg-white pl-10 pr-4 text-sm text-[#19152B] placeholder:text-gray-400 focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email" className="font-semibold text-[#19152B]">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 rounded-xl border-[#dcd6cc] bg-white pl-10 pr-4 text-sm text-[#19152B] placeholder:text-gray-400 focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="password" className="font-semibold text-[#19152B]">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="h-11 rounded-xl border-[#dcd6cc] bg-white pl-10 pr-11 text-sm text-[#19152B] placeholder:text-gray-400 focus-visible:border-[#5426B8] focus-visible:ring-[#5426B8]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#5426B8]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Strength meter */}
                {step && (
                  <div className="mt-2">
                    <div className="flex gap-1.5">
                      {strengthSteps.map((s, i) => (
                        <div
                          key={s.label}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i < score ? s.color : "bg-[#EAE7F2]"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs font-medium text-gray-500">
                      Strength:{" "}
                      <span className="font-semibold text-[#19152B]">
                        {step.label}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="mt-0.5 border-[#dcd6cc] bg-white data-checked:border-[#5426B8] data-checked:bg-[#5426B8]"
                />
                <Label
                  htmlFor="terms"
                  className="font-normal text-sm leading-relaxed text-gray-500"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="font-semibold text-[#5426B8] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-[#5426B8] hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#5426B8] font-semibold text-white shadow-md shadow-purple-300/50 hover:bg-[#451D96] hover:text-white"
              >
                Create Account
              </Button>
              <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1 bg-[#EAE7F2]" />
              <span className="text-xs font-medium text-gray-400">
                or sign up with email
              </span>
              <Separator className="flex-1 bg-[#EAE7F2]" />
            </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 ">
                  <Button className="w-full" >
                    <Icon icon="devicon:google" />
                    Sign in with Google
                  </Button>
                  <Button className="w-full" >
                    <Icon icon="mdi:github" />
                    Sign in with GitHub
                  </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 font-semibold text-[#5426B8] hover:text-[#451D96]"
                render={<Link href="/login" />}
              >
                Sign In
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
