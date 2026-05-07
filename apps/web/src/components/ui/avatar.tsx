import { cn, getInitials, stringToColor } from '@/lib/utils'
import type { User } from '@/types'
import Image from 'next/image'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

interface AvatarProps {
  user: Pick<User, 'name' | 'avatar'>
  size?: AvatarSize
  className?: string
  showStatus?: boolean
  isOnline?: boolean
}

export function Avatar({ user, size = 'md', className, showStatus, isOnline }: AvatarProps) {
  const initials = getInitials(user.name)
  const color = stringToColor(user.name)

  return (
    <div className={cn('relative shrink-0', sizeMap[size], className)}>
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            'w-full h-full rounded-full flex items-center justify-center font-semibold text-white',
            sizeMap[size]
          )}
          style={{ backgroundColor: color + '33', border: `1px solid ${color}55` }}
        >
          <span style={{ color }}>{initials}</span>
        </div>
      )}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full border-2 border-background',
            size === 'xs' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5',
            isOnline ? 'bg-emerald-400' : 'bg-slate-500'
          )}
        />
      )}
    </div>
  )
}

interface AvatarGroupProps {
  users: Pick<User, 'name' | 'avatar'>[]
  max?: number
  size?: AvatarSize
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <div key={i} className="ring-2 ring-background rounded-full">
          <Avatar user={user} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'ring-2 ring-background rounded-full flex items-center justify-center',
            'bg-white/10 text-white/60 font-medium',
            sizeMap[size]
          )}
        >
          <span className="text-[10px]">+{remaining}</span>
        </div>
      )}
    </div>
  )
}
