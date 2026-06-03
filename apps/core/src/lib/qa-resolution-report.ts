import type { QAItem, QAResolution, QAResolutionResult } from '@/store/qa-importer'

function linesToList(value: string): string {
  const lines = value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return '1.'
  return lines.map((line, index) => `${index + 1}. ${line.replace(/^\d+\.\s*/, '')}`).join('\n')
}

function resultSummary(result: QAResolutionResult): string {
  if (result === 'PASS') return 'Validated the implemented behavior according to the acceptance criteria.'
  if (result === 'FAIL') return 'Validated the implemented behavior and identified issues affecting the expected flow.'
  return 'Core functionality was validated, but full validation could not be completed due to environment/data limitations.'
}

function resultSections(result: QAResolutionResult, resolution: QAResolution): string {
  if (result === 'PASS') {
    return [
      'Validated items:',
      linesToList(resolution.validatedItems),
      '',
      'Observed behavior:',
      resolution.observedBehavior || 'The feature behaved as expected during validation.',
    ].join('\n')
  }

  if (result === 'FAIL') {
    return [
      'Validated items:',
      linesToList(resolution.validatedItems),
      '',
      'Failed items:',
      linesToList(resolution.failedItems),
      '',
      'Observed behavior:',
      resolution.observedBehavior || 'Describe the issue objectively and reproducibly.',
      '',
      'Evidence:',
      resolution.evidence || '-',
    ].join('\n')
  }

  return [
    'Validated items:',
    linesToList(resolution.validatedItems),
    '',
    'Blocked / Limited validation:',
    linesToList(resolution.failedItems || resolution.evidence),
    '',
    'Observed behavior:',
    resolution.observedBehavior || 'Describe limitation clearly.',
  ].join('\n')
}

export function generateQAResolutionReport(item: QAItem, resolution: QAResolution): string {
  const result = resolution.result

  return [
    `Issue: ${item.issueKey || item.title}`,
    `Card: ${item.title}`,
    '',
    'Summary:',
    resultSummary(result),
    '',
    'Core objective:',
    resolution.coreObjective || '-',
    '',
    'Scope:',
    `Core flow: ${resolution.coreFlow || '-'}`,
    `Secondary flows: ${resolution.secondaryFlows || '-'}`,
    `Visual validation: ${resolution.visualValidation || '-'}`,
    `Regression risk: ${resolution.regressionRisk || '-'}`,
    '',
    resultSections(result, resolution),
    '',
    'Environment:',
    resolution.environment || 'QA2 / Stage',
    '',
    'Browser:',
    resolution.browser || 'Chrome',
    '',
    'Build / Version:',
    resolution.buildVersion || '-',
    '',
    'Result:',
    result,
  ].join('\n')
}
