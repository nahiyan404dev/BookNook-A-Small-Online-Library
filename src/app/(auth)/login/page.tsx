
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  LockKeyhole,
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




export default function LogInPage() {

  const handleEmailLogin =async(e:React.SubmitEvent<HTMLElement>)=>{
    e.preventDefault();
    const formData= new FormData(e.target);
    const user= Object.fromEntries(formData.entries()) as {email:string, password:string};
    
    const {data, error}= await authClient.signIn.email({
        ...user,
    });
    if(data){
       toast.success("Login Successfully!",{
      description: "You've successfully logged into BookNook.",
      
    });
      redirect('/')
    }
    if(error){
      toast.error("Login Failed!",{
    
      description: error.message,
      
    });
    }
  }
   const handleGoogleSignIn= async() =>{
        const resData = await authClient.signIn.social({
      provider: "google",
      });
      console.log('Sign In with Google',resData)
    }

  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
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



  return (
    <div className="min-h-screen flex bg-[#F5F4FA] dark:bg-black">
      <AuthAside />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm: px-8">
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
                Welcome Back
              </CardTitle>
            </div>

            <CardDescription className="text-gray-500">
              Join BookNook and discover your next great read.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleEmailLogin}>

              <FieldGroup className="gap-4">
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
                      placeholder="Enter your Password"
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
                 
              </FieldGroup>

              {/* Submit */}
              <Button
                type="submit"
                
                className="h-12 w-full rounded-xl bg-[#451D96] text-base font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-[#5426B8] disabled:opacity-50"
              >
                Log In
              </Button>

              <FieldDescription className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register" 
                  className="font-semibold text-[#5426B8] hover:underline"
                >
                  sign up
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
                    <Button onClick={handleGoogleSignIn} className="w-ful" >
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

