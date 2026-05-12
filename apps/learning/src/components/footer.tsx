import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-950 py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20 ring-1 ring-primary/30">
            <BookOpen className="h-3 w-3 text-primary-400" />
          </div>
          <span className="text-sm font-medium">Sentinel <span className="text-primary-400">Learning</span></span>
        </div>
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} Sentinel Tech QA · Plataforma de aprendizado interno
        </p>
        <p className="text-xs text-white/20 font-mono">RC::0bfeeace</p>
      </div>
    </footer>
  )
}
