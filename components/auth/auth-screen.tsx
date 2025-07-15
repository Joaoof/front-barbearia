"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { BarbershopIllustration } from "./barbershop-illustration"
import { useAuth } from "@/contexts/auth-context"

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const { continueAsGuest } = useAuth()

  const toggleMode = () => setIsLogin(!isLogin)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Illustration on top */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="w-full max-w-sm">
            <BarbershopIllustration />
            <div className="text-center mt-6">
              <h2 className="text-white text-lg font-semibold mb-2">A melhor experiência de agendamento</h2>
              <p className="text-blue-100 text-sm">que você já teve na sua vida.</p>
            </div>
          </div>
        </div>

        {/* Form on bottom */}
        <div className="bg-white p-6 rounded-t-3xl shadow-2xl">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} onContinueAsGuest={continueAsGuest} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} onContinueAsGuest={continueAsGuest} />
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Form on left */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} onContinueAsGuest={continueAsGuest} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} onContinueAsGuest={continueAsGuest} />
          )}
        </div>

        {/* Illustration on right */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="w-full max-w-lg">
            <BarbershopIllustration />
            <div className="text-center mt-8">
              <h2 className="text-white text-2xl font-bold mb-4">A melhor experiência de agendamento</h2>
              <p className="text-blue-100 text-lg">que você já teve na sua vida.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
