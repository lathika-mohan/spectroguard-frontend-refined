import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spotlight } from "@/components/ui/spotlight"
import { SplineScene } from "@/components/ui/splite"
import { ShieldCheck, Fingerprint } from "lucide-react"
import loginBg from "@/landing_page/assets/images/login_bg.jpg"

export function LoginPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [statusText, setStatusText] = useState("SYSTEM INITIALIZING...")
  const [username, setUsername] = useState("op-4471")
  const [password, setPassword] = useState("••••••••••••")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Sequential stage timers
    const t2 = setTimeout(() => {
      setStage(2)
      setStatusText("Activating Optical Sensors...")
    }, 1500)

    const t3 = setTimeout(() => {
      setStage(3)
      setStatusText("Synchronizing Security Core...")
    }, 3500)

    const t4 = setTimeout(() => {
      setStage(4)
      setStatusText("Operator Console Ready")
    }, 5000)

    const t5 = setTimeout(() => {
      setStage(5)
    }, 7500)

    return () => {
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setAuthStatus('error')
      return
    }

    setAuthStatus('idle')
    setIsAuthenticating(true)

    // Simulate backend response delay
    setTimeout(() => {
      setIsAuthenticating(false)
      setAuthStatus('success')

      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)
    }, 1200)
  }

  // Dynamic visual configurations based on the current initialization stage
  let robotOpacity = 0
  let robotScale = 1.15
  let robotBrightness = 0.06
  let screenOverlayOpacity = 0.85 // Start dark

  if (stage === 1) {
    robotOpacity = 0
    robotScale = 1.15
    robotBrightness = 0.06
    screenOverlayOpacity = 0.85
  } else if (stage === 2) {
    robotOpacity = 1 // Slow fade-in triggers
    robotScale = 1.15
    robotBrightness = 0.06
    screenOverlayOpacity = 0.0 // Reveal background
  } else if (stage === 3) {
    robotOpacity = 1
    robotScale = 1.15
    robotBrightness = 1.0 // Eyes power on (cyan glow)
    screenOverlayOpacity = 0.0
  } else if (stage === 4) {
    robotOpacity = 1
    robotScale = 1.15
    robotBrightness = 1.0
    screenOverlayOpacity = 0.0
  } else if (stage === 5) {
    robotOpacity = 1
    robotScale = 1.15
    robotBrightness = 1.0
    screenOverlayOpacity = 0.25 // Light dimming for card readability
  }

  // Smooth, ease-out-expo transitions for hardware-accelerated animations
  const robotStyle = {
    opacity: robotOpacity,
    filter: `brightness(${robotBrightness})`,
    transform: `scale(${robotScale})`,
    transition: 'opacity 2000ms cubic-bezier(0.16, 1, 0.3, 1), filter 1500ms cubic-bezier(0.16, 1, 0.3, 1), transform 2500ms cubic-bezier(0.16, 1, 0.3, 1)',
    transformOrigin: 'center center',
  }

  // Glass Login Card reveal animation configuration (blur fade, slide up, opacity)
  const cardStyle = {
    opacity: stage === 5 ? 1 : 0,
    transform: stage === 5 ? 'translateY(0px)' : 'translateY(24px)',
    filter: stage === 5 ? 'blur(0px)' : 'blur(10px)',
    transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1), filter 600ms cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-black overflow-hidden select-none">
      
      {/* Layer 0: Full-screen Page Background */}
      <div 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      {/* Layer 0.5: Constant subtle dark background overlay (22% opacity) to separate background and robot */}
      <div className="absolute inset-0 bg-black/22 pointer-events-none z-10" />

      {/* Layer 1: Live Animated Robot Background */}
      <div className="absolute inset-0 w-full h-full z-20 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full" style={robotStyle}>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Layer 2: Dynamic Transition Screen Overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-[1500ms] ease-out z-30" 
        style={{ opacity: screenOverlayOpacity }}
      />

      {/* Phase 1-4: Monospace Ticker Status Message */}
      {stage < 5 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none">
          <p className="font-mono text-xs sm:text-sm tracking-widest text-live uppercase animate-pulse">
            {statusText}
          </p>
        </div>
      )}

      {/* Layer 3: Centered Glassmorphism Floating Login Card (Phase 5) */}
      <div 
        className="relative z-50 w-full max-w-md mx-4 pointer-events-auto"
        style={cardStyle}
      >
        {stage === 5 && (
          <Card className="overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-8 sm:p-10 rounded-[28px]">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={280} />
            
            <div className="relative z-10 flex flex-col gap-6">
              {/* Logo Branding */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-live" strokeWidth={1.75} />
                  <span className="font-display text-sm font-bold tracking-widest text-ink">
                    SPECTRAGUARD
                  </span>
                </div>
                <span className="text-[10px] tracking-wider text-live font-semibold ml-7">
                  SECURE OPERATOR ACCESS
                </span>
              </div>

              {/* Main Heading & Description */}
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Operator Authentication</h1>
                <p className="mt-2 text-xs sm:text-sm text-ink-dim leading-relaxed">
                  Authenticate to access the SpectraGuard Operator Console and begin monitoring camera integrity across your surveillance infrastructure.
                </p>
              </div>

              {/* Status Alert Panels */}
              {authStatus === 'error' && (
                <div className="p-3.5 bg-alarm-dim/30 border border-alarm/20 rounded-2xl text-xs text-alarm font-medium leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                  Authentication failed. Please verify your credentials and try again.
                </div>
              )}

              {authStatus === 'success' && (
                <div className="p-3.5 bg-live-dim/30 border border-live/20 rounded-2xl text-xs text-live font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                  Authentication successful.
                </div>
              )}

              {/* Form Input Fields & Authenticate Controls */}
              <form
                className="flex flex-col gap-4"
                onSubmit={handleAuth}
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-ink-dim uppercase tracking-wider">Operator Username</label>
                  <Input 
                    placeholder="Enter operator username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isAuthenticating || authStatus === 'success'}
                    className="bg-white/5 border-white/10 text-ink placeholder:text-ink-faint rounded-2xl px-4 py-3 focus:border-white/20 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-ink-dim uppercase tracking-wider">Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isAuthenticating || authStatus === 'success'}
                    className="bg-white/5 border-white/10 text-ink placeholder:text-ink-faint rounded-2xl px-4 py-3 focus:border-white/20 transition-colors"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="mt-2 gap-2 rounded-full font-semibold shadow-lg text-sm tracking-wide transition-all select-none"
                  disabled={isAuthenticating || authStatus === 'success'}
                >
                  {isAuthenticating ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="h-4 w-4" />
                      Authenticate
                    </>
                  )}
                </Button>
                
                <p className="font-mono text-[11px] text-ink-faint text-center tracking-wide mt-1">
                  Secure operator access • Session protected
                </p>
              </form>
            </div>
          </Card>
        )}
      </div>

    </div>
  )
}
