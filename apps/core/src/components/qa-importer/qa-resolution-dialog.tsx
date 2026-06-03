'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useMemo, useState } from 'react'
import { Check, Clipboard, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { QAItem, QAResolutionResult } from '@/store/qa-importer'

interface QAResolutionDialogProps {
  item: QAItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, resolution: {
    result: QAResolutionResult
    coreObjective: string
    coreFlow: string
    secondaryFlows: string
    visualValidation: string
    regressionRisk: string
    validatedItems: string
    failedItems: string
    observedBehavior: string
    evidence: string
    environment: string
    browser: string
    buildVersion: string
  }) => void
}

const defaultBrowser = 'Chrome Version 148.0.7778.217'

export function QAResolutionDialog({ item, open, onOpenChange, onSave }: QAResolutionDialogProps) {
  const [result,           setResult]           = useState<QAResolutionResult>('PASS')
  const [coreObjective,    setCoreObjective]    = useState('')
  const [coreFlow,         setCoreFlow]         = useState('')
  const [secondaryFlows,   setSecondaryFlows]   = useState('')
  const [visualValidation, setVisualValidation] = useState('')
  const [regressionRisk,   setRegressionRisk]   = useState('')
  const [validatedItems,   setValidatedItems]   = useState('')
  const [failedItems,      setFailedItems]      = useState('')
  const [observedBehavior, setObservedBehavior] = useState('')
  const [evidence,         setEvidence]         = useState('')
  const [environment,      setEnvironment]      = useState('QA2 / Stage')
  const [browser,          setBrowser]          = useState(defaultBrowser)
  const [buildVersion,     setBuildVersion]     = useState('')
  const [copied,           setCopied]           = useState(false)

  useEffect(() => {
    if (!item || !open) return
    const resolution = item.resolution
    setResult(resolution?.result ?? 'PASS')
    setCoreObjective(resolution?.coreObjective ?? '')
    setCoreFlow(resolution?.coreFlow ?? '')
    setSecondaryFlows(resolution?.secondaryFlows ?? '')
    setVisualValidation(resolution?.visualValidation ?? '')
    setRegressionRisk(resolution?.regressionRisk ?? '')
    setValidatedItems(resolution?.validatedItems ?? '')
    setFailedItems(resolution?.failedItems ?? '')
    setObservedBehavior(resolution?.observedBehavior ?? '')
    setEvidence(resolution?.evidence ?? '')
    setEnvironment(resolution?.environment ?? 'QA2 / Stage')
    setBrowser(resolution?.browser ?? defaultBrowser)
    setBuildVersion(resolution?.buildVersion ?? '')
    setCopied(false)
  }, [item, open])

  const report = item?.resolution?.report
  const canSave = Boolean(item && coreObjective.trim() && observedBehavior.trim())

  const resultHint = useMemo(() => {
    if (result === 'PASS')    return 'Core flow works and regression was validated.'
    if (result === 'FAIL')    return 'Core objective is broken or relevant issue was found.'
    if (result === 'PARTIAL') return 'Core worked, but full validation was limited.'
    return 'Validation is blocked by environment, data, or dependency.'
  }, [result])

  if (!item) return null

  const handleSave = () => {
    if (!canSave) return
    onSave(item.id, {
      result, coreObjective, coreFlow, secondaryFlows, visualValidation,
      regressionRisk, validatedItems, failedItems, observedBehavior,
      evidence, environment, browser, buildVersion,
    })
  }

  const copyReport = async () => {
    if (!report) return
    await navigator.clipboard?.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-900 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="text-lg font-semibold text-white">QA Resolution</Dialog.Title>
                <Dialog.Description className="mt-1 truncate text-sm text-white/45">
                  {item.issueKey ? `${item.issueKey} - ` : ''}{item.title}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="rounded-lg p-2 text-white/35 hover:bg-white/[0.06] hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="grid max-h-[calc(100vh-7rem)] grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_420px]">
              <div className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Resultado">
                    <select
                      aria-label="Resultado"
                      value={result}
                      onChange={e => setResult(e.target.value as QAResolutionResult)}
                      className={inputClass}
                    >
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                      <option value="PARTIAL">PARTIAL</option>
                      <option value="BLOCKED">BLOCKED</option>
                    </select>
                    <p className="mt-1 text-[11px] text-white/30">{resultHint}</p>
                  </Field>
                  <Field label="Environment">
                    <input aria-label="Environment" value={environment} onChange={e => setEnvironment(e.target.value)} className={inputClass} />
                  </Field>
                  <Field label="Build / Version">
                    <input aria-label="Build / Version" value={buildVersion} onChange={e => setBuildVersion(e.target.value)} className={inputClass} placeholder="PR XXX / release/vX.X.X" />
                  </Field>
                </div>

                <Field label="Core objective">
                  <textarea aria-label="Core objective" value={coreObjective} onChange={e => setCoreObjective(e.target.value)} rows={2} className={textareaClass} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Core flow">
                    <textarea aria-label="Core flow" value={coreFlow} onChange={e => setCoreFlow(e.target.value)} rows={3} className={textareaClass} />
                  </Field>
                  <Field label="Secondary flows">
                    <textarea aria-label="Secondary flows" value={secondaryFlows} onChange={e => setSecondaryFlows(e.target.value)} rows={3} className={textareaClass} />
                  </Field>
                  <Field label="Visual validation">
                    <textarea aria-label="Visual validation" value={visualValidation} onChange={e => setVisualValidation(e.target.value)} rows={3} className={textareaClass} />
                  </Field>
                  <Field label="Regression risk">
                    <textarea aria-label="Regression risk" value={regressionRisk} onChange={e => setRegressionRisk(e.target.value)} rows={3} className={textareaClass} />
                  </Field>
                </div>

                <Field label="Validated items">
                  <textarea aria-label="Validated items" value={validatedItems} onChange={e => setValidatedItems(e.target.value)} rows={4} className={textareaClass} placeholder="One item per line" />
                </Field>

                <Field label="Failed items">
                  <textarea aria-label="Failed items" value={failedItems} onChange={e => setFailedItems(e.target.value)} rows={3} className={textareaClass} placeholder="Use for FAIL, PARTIAL or BLOCKED" />
                </Field>

                <Field label="Observed behavior">
                  <textarea aria-label="Observed behavior" value={observedBehavior} onChange={e => setObservedBehavior(e.target.value)} rows={4} className={textareaClass} />
                </Field>

                <Field label="Evidence">
                  <textarea aria-label="Evidence" value={evidence} onChange={e => setEvidence(e.target.value)} rows={3} className={textareaClass} placeholder="Screenshots, video, network response, console/backend error" />
                </Field>

                <Field label="Browser">
                  <input aria-label="Browser" value={browser} onChange={e => setBrowser(e.target.value)} className={inputClass} />
                </Field>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Fechar</Button>
                  <Button variant="glow" type="button" onClick={handleSave} disabled={!canSave} leftIcon={<Check className="h-4 w-4" />}>
                    Salvar resolução
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/[0.08] bg-black/15 p-5 lg:border-l lg:border-t-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white/80">Report final</p>
                  <Button type="button" variant="outline" size="xs" onClick={copyReport} disabled={!report} leftIcon={<Clipboard className="h-3.5 w-3.5" />}>
                    {copied ? 'Copiado' : 'Copiar'}
                  </Button>
                </div>
                <pre className="min-h-80 whitespace-pre-wrap rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-xs leading-relaxed text-white/65">
                  {report || 'Salve a resolução para gerar o report final.'}
                </pre>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const inputClass = 'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary/50'
const textareaClass = `${inputClass} resize-none leading-relaxed`

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-white/45">{label}</span>
      {children}
    </label>
  )
}
