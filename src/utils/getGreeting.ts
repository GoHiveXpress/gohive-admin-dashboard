
import { CloudSun, Sun, Moon } from 'lucide-react'
import type { FC } from 'react'

export function getGreeting(): {
  text: string
  Icon: FC<{ className?: string }>
} {
  const hour = new Date().getHours()

  if (hour < 12) return { text: 'Good morning', Icon: CloudSun }
  if (hour < 18) return { text: 'Good afternoon', Icon: Sun }
  return { text: 'Good evening', Icon: Moon }
}
