'use client'

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const SESSION_KEY = 'zb_auth'
const PASSWORD = 'Virus2026$'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY)
    setAuthenticated(stored === 'true')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 500)
    }
  }

  if (authenticated === null) return null

  if (authenticated) return <>{children}</>

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ae8b4d]/10 mb-4">
            <Lock className="h-8 w-8 text-[#ae8b4d]" />
          </div>
          <h1 className="text-3xl font-bold text-[#ae8b4d]">Factures Immeubles</h1>
          <p className="text-muted-foreground text-sm">
            Entrez le mot de passe pour continuer
          </p>
        </div>

        <Card
          className={`border-[#ae8b4d]/20 transition-transform ${shake ? 'animate-shake' : ''}`}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-center text-gray-700">
              Accès sécurisé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(false)
                  }}
                  placeholder="••••••••••"
                  autoFocus
                  className={`border-[#ae8b4d]/20 focus:border-[#ae8b4d] focus:ring-[#ae8b4d] ${
                    error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                  }`}
                />
                {error && (
                  <p className="text-xs text-red-500 mt-1">Mot de passe incorrect</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ae8b4d] hover:bg-[#9a7a42] text-white"
              >
                Accéder
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Développé sur mesure par Zéro Bureau Inc.
        </p>
      </div>
    </div>
  )
}
