'use client'

import { SettingsForm } from '@/components/settings-form'
import { useUserSettings } from '@/hooks/use-user'

export default function Settings() {
  const { data: settings, isPending } = useUserSettings()

  if (isPending || !settings) return <p>Unable to load settings</p>

  return <SettingsForm settings={settings} />
}
