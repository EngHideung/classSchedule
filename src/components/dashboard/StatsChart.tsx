import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useScheduleStore } from '@/stores/scheduleStore'
import { getDurationMinutes } from '@/lib/schedule'
import { DAY_NAMES_SHORT } from '@/lib/schedule'

export function StatsChart() {
  const classes = useScheduleStore((s) => s.classes)

  const data = DAY_NAMES_SHORT.map((day, i) => {
    const dayClasses = classes.filter((c) => c.dayOfWeek === i)
    const hours = dayClasses.reduce(
      (acc, c) => acc + getDurationMinutes(c.startTime, c.endTime) / 60,
      0
    )
    return { day, hours: Math.round(hours * 10) / 10 }
  }).filter((_, i) => i > 0 && i < 6)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" unit="h" />
        <Tooltip
          contentStyle={{
            background: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? '#6366f1' : '#06b6d4'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
