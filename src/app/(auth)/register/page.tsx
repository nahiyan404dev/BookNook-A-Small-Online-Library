
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Camera,
  Eye,
  EyeOff,
  Check,
  X,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {Icon} from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
 
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import AuthAside from "@/components/auth/AuthAside";




export default function SignUpPage() {

  const handleEmailSignUp =async(e:React.SubmitEvent<HTMLElement>)=>{
    e.preventDefault();
    const formData= new FormData(e.target);
    const user= Object.fromEntries(formData.entries()) as {name:string, image?:string, email:string, password:string};
     
    const {data, error}= await authClient.signUp.email({
        ...user,
    });
    if(data){
       toast.success("Account Created Successfully!",{ 
      description: "Welcome to BookNook! Your account has been create successfully.",
    });
      redirect('/')
    }
    if(error){
      toast.error
      ("Registration Failed!",{ 
      description: error.message,
      
    });
    }
  }


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);
  const isConfirmPasswordValid =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen flex bg-[#F5F4FA] dark:bg-black">
      <AuthAside />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#451D96] text-white shadow-lg shadow-purple-200">
            <BookOpen size={28} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            BookNook
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Your next favorite book starts here.
          </p>
        </div>

        <Card className="border border-purple-100/80 bg-white dark:bg-black shadow-xl shadow-purple-100/50 rounded-2xl">

          <CardHeader className="space-y-2 text-center pb-5">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-[#5426B8]" />
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-[#5426B8]">
                Create an account
              </CardTitle>
            </div>

            <CardDescription className="text-gray-500">
              Join BookNook and discover your next great read.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleEmailSignUp}>

              <FieldGroup className="gap-4">

                {/* Full Name */}
                <Field>
                  <FieldLabel htmlFor="name">
                    <UserRound size={16} />
                    Full Name
                  </FieldLabel>

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="h-11 rounded-xl focus-visible:ring-[#5426B8]"
                    autoComplete="name"
                    required
                  />
                </Field>

                {/* Profile Image */}
                <Field>
                  <FieldLabel htmlFor="image">
                    <Camera size={16} />
                    Profile Image URL
                  </FieldLabel>

                  <Input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="h-11 rounded-xl focus-visible:ring-[#5426B8]"
                    required
                  />
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">
                    <Mail size={16} />
                    Email Address
                  </FieldLabel>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11 rounded-xl focus-visible:ring-[#5426B8]"
                    autoComplete="email"
                    required
                  />
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">
                    <LockKeyhole size={16} />
                    Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl pr-12 focus-visible:ring-[#5426B8]"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5426B8]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>

                  {/* Password Validation */}
                  {password.length > 0 && (
                    <div className="mt-3 rounded-xl bg-gray-50 p-3 space-y-2">
                      <p className="text-xs font-semibold text-gray-700">
                        Password requirements
                      </p>

                      {passwordRules.map((rule) => (
                        <div
                          key={rule.label}
                          className="flex items-center gap-2 text-xs"
                        >
                          {rule.valid ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <X size={14} className="text-gray-400" />
                          )}

                          <span
                            className={
                              rule.valid
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            {rule.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>

                {/* Confirm Password */}
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    <LockKeyhole size={16} />
                    Confirm Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      className="h-11 rounded-xl pr-12 focus-visible:ring-[#5426B8]"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5426B8]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <p
                      className={`mt-1 text-xs ${
                        isConfirmPasswordValid
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {isConfirmPasswordValid
                        ? "Passwords match!"
                        : "Passwords do not match."}
                    </p>
                  )}
                </Field>

              </FieldGroup>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!isPasswordValid || !isConfirmPasswordValid}
                className="h-12 w-full rounded-xl bg-[#451D96] text-base font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-[#5426B8] disabled:opacity-50"
              >
                Create Account
              </Button>

              <FieldDescription className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login" 
                  className="font-semibold text-[#5426B8] hover:underline"
                >
                  Log In
                </Link>
              </FieldDescription>

              <div className="my-6 flex items-center gap-3">
                <Separator className="h-px flex-1 bg-[#EAE7F2]" />
                <span className="text-xs font-medium text-gray-400">
                  or continue with email
                </span>
                <Separator className="h-px flex-1 bg-[#EAE7F2]" />
              </div>
                    {/* Social Sign-in */}
              
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
                    <Button className="w-ful" >
                      <Icon icon="devicon:google" />
                      Sign in with Google
                    </Button>
                    <Button className="w-full" >
                      <Icon icon="mdi:github" />
                      Sign in with GitHub
                    </Button>
                </div>
            </form>

            <FieldSeparator className="my-5">
              Secure registration
            </FieldSeparator>

            <p className="text-center text-xs leading-relaxed text-gray-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-[#5426B8] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#5426B8] hover:underline">
                Privacy Policy
              </Link>.
            </p>

          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 BookNook. Made for book lovers.
        </p>

      </div>
      </main>
    </div>
  );
}
