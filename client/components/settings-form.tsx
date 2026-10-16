'use client'

import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { ContainerWithMarks } from './container-with-marks'
import { Label } from './ui/label'
import { UserSettings, useUpdateUserSettings } from '@/hooks/use-user'
import { useState } from 'react'

export const SettingsForm = ({ settings }: { settings: UserSettings }) => {
  const updateSettings = useUpdateUserSettings()
  const initial = toFormValues(settings)

  const [emailsEnabled, setEmailsEnabled] = useState(initial.emailsEnabled)
  const [email, setEmail] = useState(initial.email)
  const [lookbackDays, setLookbackDays] = useState(initial.lookbackDays)
  const [alertThreshold, setAlertThreshold] = useState(initial.alertThreshold)

  const isDirty =
    emailsEnabled !== initial.emailsEnabled ||
    email !== initial.email ||
    lookbackDays !== initial.lookbackDays ||
    alertThreshold !== initial.alertThreshold

  function toFormValues(settings: UserSettings) {
    return {
      emailsEnabled: settings.emails_enabled,
      email: settings.recipient_email_address ?? '',
      lookbackDays: settings.lookback_days?.toString() ?? '',
      alertThreshold: settings.threshold_pct != null ? String(Number(settings.threshold_pct)) : '',
    }
  }

  function syncForm(values: ReturnType<typeof toFormValues>) {
    setEmailsEnabled(values.emailsEnabled)
    setEmail(values.email)
    setLookbackDays(values.lookbackDays)
    setAlertThreshold(values.alertThreshold)
  }

  function handleReset() {
    syncForm(initial)
  }

  function handleSave() {
    updateSettings.mutate(
      {
        emails_enabled: emailsEnabled,
        recipient_email_address: email || null,
        lookback_days: lookbackDays ? Number(lookbackDays) : null,
        threshold_pct: alertThreshold ? Number(alertThreshold) : null,
      },
      { onSuccess: (saved) => syncForm(toFormValues(saved)) }
    )
  }

  return (
    <div className="space-y-4">
      <ContainerWithMarks className="space-y-4">
        <p className="text-label mb-4">Alert Emails</p>

        <div className="space-y-2">
          <Label htmlFor="email-enabled">Enable emails</Label>
          <Switch id="email-enabled" checked={emailsEnabled} onCheckedChange={(checked) => setEmailsEnabled(checked)} />
        </div>

        <div className="space-y-2">
          <Label>Email address</Label>
          <Input
            className="w-125"
            type="email"
            disabled={!emailsEnabled}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Lookback days</Label>
          <Input
            className="w-12"
            type="numeric"
            disabled={!emailsEnabled}
            placeholder="2"
            value={lookbackDays}
            onChange={(e) => setLookbackDays(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Alert threshold percentage</Label>
          <Input
            className="w-12"
            type="numeric"
            disabled={!emailsEnabled}
            placeholder="2"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(e.target.value)}
          />
        </div>
      </ContainerWithMarks>

      <div className="flex w-full justify-end gap-2">
        {isDirty && (
          <Button onClick={handleReset} variant="secondary">
            Reset
          </Button>
        )}
        <Button onClick={handleSave} disabled={!isDirty || updateSettings.isPending}>
          Save
        </Button>
      </div>
    </div>
  )
}
