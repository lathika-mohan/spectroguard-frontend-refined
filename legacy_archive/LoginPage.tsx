import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spotlight } from "@/components/ui/spotlight"
import { SplineScene } from "@/components/ui/splite"
import { ShieldCheck, Fingerprint } from "lucide-react"

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-void p-6">
      <Card className="relative grid w-full max-w-5xl grid-cols-1 overflow-hidden bg-black/[0.96] md:grid-cols-2">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={280} />

        {/* Left: operator entry */}
        <div className="relative z-10 flex flex-col justify-center gap-6 p-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-live" strokeWidth={1.75} />
            <span className="font-display text-sm font-semibold tracking-wide text-ink">
              SENTRY<span className="text-live">SOC</span>
            </span>
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Operator sign-in</h1>
            <p className="mt-2 text-sm text-ink-dim">
              Autonomous surveillance review console. Access is logged and audited.
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              navigate("/dashboard")
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-dim">Operator ID</label>
              <Input placeholder="op-4471" defaultValue="op-4471" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-dim">Passphrase</label>
              <Input type="password" placeholder="••••••••••••" defaultValue="••••••••••••" />
            </div>
            <Button type="submit" size="lg" className="mt-2 gap-2">
              <Fingerprint className="h-4 w-4" />
              Authenticate
            </Button>
            <p className="font-mono text-[11px] text-ink-faint">
              MFA device required · session watermarked to op-4471
            </p>
          </form>
        </div>

        {/* Right: live 3D scene */}
        <div className="relative min-h-[320px]">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/40 md:hidden" />
        </div>
      </Card>
    </div>
  )
}
