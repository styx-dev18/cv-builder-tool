import { useSearchParams } from 'react-router-dom'
import { AlertCircle, FileText } from 'lucide-react'
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons'

function BrandMark({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm font-semibold tracking-tight ${className ?? ''}`}>
      <FileText className="size-4" />
      CV Builder
    </div>
  )
}

export function LoginPage() {
  const [params] = useSearchParams()
  const error = params.get('error')

  return (
    <div className="flex min-h-svh flex-col lg:grid lg:grid-cols-2">
      <div className="relative flex h-48 shrink-0 flex-col justify-end overflow-hidden bg-neutral-900 p-6 text-white sm:h-64 sm:p-10 lg:h-auto lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[32px_32px]"
        />
        <BrandMark className="absolute top-6 left-6 sm:top-10 sm:left-10 lg:top-12 lg:left-12" />
        <div className="relative">
          <div className="mb-4 h-1 w-10 bg-white/70" />
          <h2 className="max-w-xs text-xl leading-tight font-semibold sm:text-2xl lg:text-3xl">
            Build a CV that gets read.
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm space-y-6">
          <BrandMark className="lg:hidden" />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Continue with an account to build and save your CV.
            </p>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              Sign-in failed. Please try again.
            </div>
          )}
          <SocialLoginButtons />
          <p className="text-xs text-muted-foreground">
            By continuing you agree to CV Builder&apos;s Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
