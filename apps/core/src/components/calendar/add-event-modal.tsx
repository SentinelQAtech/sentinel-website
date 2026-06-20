'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, Tag, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useCalendarStore,
  EventType, EventRegion,
  EVENT_TYPE_CONFIG, REGION_CONFIG,
} from '@/store/calendar'
import { useI18nStore } from '@/store/i18n'
import { useCreateDailyMeeting } from '@/hooks/useDaily'
import { calendarEventToDailyMeeting } from '@/lib/calendar-meeting-sync'
import { getApiErrorMessage } from '@/lib/api-error'
import toast from 'react-hot-toast'

interface Props {
  open:         boolean
  onClose:      () => void
  defaultDate?: string
}

export function AddEventModal({ open, onClose, defaultDate = '' }: Props) {
  useI18nStore(s => s.locale)
  const t = useI18nStore(s => s.t)
  const { addEvent } = useCalendarStore()
  const createMeeting = useCreateDailyMeeting()

  const [title,       setTitle]       = useState('')
  const [date,        setDate]        = useState(defaultDate)
  const [startTime,   setStartTime]   = useState('09:00')
  const [endTime,     setEndTime]     = useState('10:00')
  const [type,        setType]        = useState<EventType>('meeting')
  const [region,      setRegion]      = useState<EventRegion | ''>('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) {
      setDate(defaultDate)
      setTitle('')
      setStartTime('09:00')
      setEndTime('10:00')
      setType('meeting')
      setRegion('')
      setDescription('')
    }
  }, [open, defaultDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return
    const event = {
      title:       title.trim(),
      date,
      startTime,
      endTime,
      type,
      region:      region || undefined,
      description: description.trim() || undefined,
    }

    if (type === 'meeting') {
      try {
        await createMeeting.mutateAsync(calendarEventToDailyMeeting({ ...event, id: 'new' }))
        toast.success('Reuniao salva no Calendar e no Daily.')
        onClose()
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Nao foi possivel salvar a reuniao.'))
      }
      return
    }

    addEvent(event)
    onClose()
  }

  const inputCls = cn(
    'w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.04] border border-white/[0.08]',
    'text-white placeholder-white/20 outline-none',
    'focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-150'
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-4 m-auto h-fit max-h-[calc(100vh-2rem)] w-full max-w-[420px] dropdown-panel z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-white/85">{t('newEvent')}</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block mb-1.5">{t('eventTitle')} *</label>
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Sprint Planning, Code Review..."
                  className={inputCls}
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block mb-1.5">{t('date')} *</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className={cn(inputCls, '[color-scheme:dark]')}
                />
              </div>

              {/* Start / End time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block mb-1.5">{t('start')}</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className={cn(inputCls, '[color-scheme:dark]')}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block mb-1.5">{t('end')}</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className={cn(inputCls, '[color-scheme:dark]')}
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block mb-1.5">
                  <Tag className="w-3 h-3 inline mr-1" />{t('type')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map(t => {
                    const cfg = EVENT_TYPE_CONFIG[t]
                    const active = type === t
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150',
                          !active && 'border-white/[0.08] text-white/40 hover:text-white/60'
                        )}
                        style={active ? {
                          backgroundColor: cfg.color + '25',
                          color:           cfg.color,
                          borderColor:     cfg.color + '50',
                        } : {}}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block mb-1.5">
                  <Globe className="w-3 h-3 inline mr-1" />{t('region')} ({t('optional')})
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRegion('')}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150',
                      !region
                        ? 'bg-white/10 border-white/20 text-white/60'
                        : 'border-white/[0.08] text-white/40 hover:text-white/60'
                    )}
                  >
                    {t('none')}
                  </button>
                  {(Object.keys(REGION_CONFIG) as EventRegion[]).map(r => {
                    const cfg = REGION_CONFIG[r]
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegion(r)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150',
                          region === r
                            ? 'bg-white/10 border-white/20 text-white/80'
                            : 'border-white/[0.08] text-white/40 hover:text-white/60'
                        )}
                      >
                        {cfg.flag} {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block mb-1.5">Descrição (opcional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t('notesOrDetails')}
                  className={cn(inputCls, 'resize-none')}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all duration-150"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !date || createMeeting.isPending}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {createMeeting.isPending ? 'Salvando...' : t('createEvent')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
