import { redirect } from 'next/navigation'
import { withCoreBasePath } from '@/lib/routes'

export default function RootPage() {
  redirect(withCoreBasePath('/dashboard'))
}
