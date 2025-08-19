'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Chrome, Facebook, Phone } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log user credentials (for now)
    console.log('Login attempt with:', { email, password });

    // Optional: Set fake session
    localStorage.setItem('loggedIn', 'true');

    // Redirect to landing page
    router.push('/');
  };
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-black-50 dark:bg-white-950 px-4 py-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Welcome to Assitify
          </h1>
          <CardDescription className="mt-0 text-gray-600 dark:text-gray-400">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-0">
          <form className="space-y-1" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex justify-end -mt-1 -mb-1">
              <div className="text-xs">
                <Link
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 focus-visible:ring-blue-500"
              />
            </div>
            <div className="mt-2">
              <Button
                type="submit"
                onClick={()=>{
                  router.push("/login")
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-1 pt-0">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            Don't have an account?
            <Link
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
            >
              Sign up
            </Link>
          </div>

          {/* OR separator */}
          <div className="relative flex items-center w-full my-1">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col space-y-1 w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-9 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              <Chrome className="h-5 w-5" />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-9 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              <Facebook className="h-5 w-5" />
              Sign in with Facebook
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-9 hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              <Phone className="h-5 w-5" />
              Sign in with Phone Number
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-500 flex flex-col sm:flex-row sm:space-x-2 mt-1">
            <Link href="#" className="hover:underline">
              Terms of Use
            </Link>
            <span className="hidden sm:inline-block">|</span>
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}