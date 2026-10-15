'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-slate-300">
            {submitted
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive reset instructions'}
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-300">✓ Email sent successfully</p>
              <p className="text-sm text-slate-300 mt-2">
                Check your inbox and follow the link to reset your password.
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-300 mb-4">Didn't receive the email? Check your spam folder.</p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="w-full border-white/30 hover:bg-white/10"
              >
                Try Another Email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 h-11 font-semibold"
            >
              Send Reset Link
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800">or</span>
              </div>
            </div>

            <div className="space-y-2 text-center text-sm">
              <p className="text-slate-300">Remember your password?</p>
              <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-semibold">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-xs text-slate-400 text-center">
            Need help? <a href="/contact" className="text-orange-400 hover:text-orange-300">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  )
}
