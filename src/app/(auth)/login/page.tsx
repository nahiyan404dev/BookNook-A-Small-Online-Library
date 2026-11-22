"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import {Icon} from "@iconify/react";
import AuthAside from "@/components/auth/AuthAside";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F4FA]">
      <AuthAside />

      {/* Login Form */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5426B8] text-white">
              <BookOpen size={23} strokeWidth={2.2} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#19152B]">
              Book<span className="text-[#5426B8]">Nook</span>
            </h1>
          </Link>

          <Card className="gap-0 rounded-2xl border border-[#EAE7F2] bg-white p-6 shadow-xl shadow-purple-100/50 ring-0 sm:p-8">
            <CardHeader className="gap-0 p-0">
              <CardTitle
                role="heading"
                aria-level={2}
                className="text-2xl font-bold text-[#19152B]"
              >
                Welcome back
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                Sign in to continue to your reading space.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">              

              {/* Email + Password */}
              <form className="space-y-4" action="/">
                <div>
                  <Label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-[#19152B]"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-11 rounded-xl border-[#dcd6cc] bg-white pl-10 pr-4 text-sm text-[#19152B] placeholder:text-gray-400 focus-visible:border-[#5426B8] focus-visible:ring-2 focus-visible:ring-[#5426B8]/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="block text-sm font-semibold text-[#19152B]"
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#5426B8] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-[#dcd6cc] bg-white pl-10 pr-11 text-sm text-[#19152B] placeholder:text-gray-400 focus-visible:border-[#5426B8] focus-visible:ring-2 focus-visible:ring-[#5426B8]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#5426B8]"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div className="mt-5">
                    <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-[#5426B8] font-semibold text-white shadow-md shadow-purple-200 hover:bg-[#451D96] hover:text-white"
                >
                  Sign In
                </Button>
                  </div>
                </div>
                {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <Separator className="h-px flex-1 bg-[#EAE7F2]" />
                <span className="text-xs font-medium text-gray-400">
                  or continue with email
                </span>
                <Separator className="h-px flex-1 bg-[#EAE7F2]" />
              </div>
                    {/* Social Sign-in */}
              
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
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

            <CardFooter className="mt-6 justify-center p-0">
              <p className="text-sm text-gray-500">
                New to BookNook?{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 font-semibold text-[#5426B8] hover:text-[#451D96]"
                  render={<Link href="/register" />}
                >
                  Create an account
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
