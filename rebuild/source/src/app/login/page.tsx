"use client"
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const router = useRouter()
  const { login, loginWithGoogle } = useAuth()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)
    
    try {
      setIsSubmitting(true)
      await login(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error('Error signing in', error)
      setLocalError(error.message || 'Failed to login. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLocalError(null)
    
    try {
      setIsGoogleSubmitting(true)
      await loginWithGoogle()
      router.push("/dashboard")
    } catch (error: any) {
      console.error('Error signing in with Google', error)
      setLocalError(error.message || 'Failed to login with Google.')
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  const displayError = localError

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333] flex flex-col">
      <Navigation showBackButton={true} />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-[#FFE5E5] border-none">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Log in to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                  <p className="font-medium">⚠️ Error</p>
                  <p>{displayError}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  onChange={(e) => setEmail(e.target.value)} 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  className="bg-white border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                  disabled={isSubmitting || isGoogleSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-[#FF6F61] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  onChange={(e) => setPassword(e.target.value)} 
                  id="password" 
                  type="password" 
                  className="bg-white border-[#FFB3B0] focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                  disabled={isSubmitting || isGoogleSubmitting}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={isSubmitting || isGoogleSubmitting} />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-[#FF6F61] text-white hover:bg-[#FFB3B0]"
                disabled={isSubmitting || isGoogleSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Logging in...
                  </span>
                ) : (
                  'Log In'
                )}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#FFB3B0]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#FFE5E5] px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button 
                type="button"
                variant="outline"
                className="w-full border-[#FFB3B0] hover:bg-white"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isGoogleSubmitting}
              >
                {isGoogleSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin inline-block" />
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </span>
                )}
              </Button>
              
              <p className="text-sm text-center">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#FF6F61] hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="border-t border-[#FFE5E5] w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-medium">© 2024 SaaSBoiler. All rights reserved.</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="#" className="text-sm font-medium hover:text-[#FF6F61] transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#FF6F61] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#FF6F61] transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
