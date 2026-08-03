import { Suspense, lazy, Component, type ReactNode } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

class SplineErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.2),_transparent_45%),linear-gradient(135deg,_rgba(2,6,23,0.95),_rgba(15,23,42,0.7))]">
          <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-4 text-center text-sm text-slate-200 backdrop-blur-xl">
            Immersive scene unavailable in this environment.
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loader h-8 w-8 rounded-full border-2 border-live/30 border-t-live animate-spin" />
        </div>
      }
    >
      <SplineErrorBoundary>
        <Spline scene={scene} className={className} />
      </SplineErrorBoundary>
    </Suspense>
  )
}
