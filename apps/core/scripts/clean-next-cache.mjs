import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

const nextDir = resolve(process.cwd(), '.next')

rmSync(nextDir, { recursive: true, force: true })
