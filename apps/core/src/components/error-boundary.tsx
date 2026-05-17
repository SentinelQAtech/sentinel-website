'use client'

import { Component, ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { hasError: boolean; errorMessage: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message ?? String(error) }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Component crash:', error, info.componentStack)
  }

  reset = () => this.setState({ hasError: false, errorMessage: '' })

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-surface-950 text-white/70">
        <div className="text-4xl">⚠</div>
        <p className="text-lg font-medium text-white">Algo deu errado</p>
        <p className="text-sm">Um erro inesperado ocorreu. Tente recarregar a página.</p>
        {this.state.errorMessage && (
          <p className="text-xs text-red-400/70 font-mono max-w-sm text-center px-4">
            {this.state.errorMessage}
          </p>
        )}
        <div className="flex gap-3 mt-2">
          <button
            onClick={this.reset}
            className="rounded-lg bg-primary/20 px-4 py-2 text-sm text-primary hover:bg-primary/30 transition-colors"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
          >
            Recarregar página
          </button>
        </div>
      </div>
    )
  }
}
