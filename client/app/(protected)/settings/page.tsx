'use client'

import { ContainerWithMarks } from '@/components/container-with-marks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

export default function Settings() {
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const [lookbackDays, setLookbackDays] = useState<string>('')

  return (
    <div className="space-y-4">
      <ContainerWithMarks className="space-y-4">
        <p className="text-label mb-4">Alert Emails</p>

        <div className="space-y-2">
          <Label htmlFor="email-enabled">Enable emails</Label>
          <Switch id="email-enabled" checked={emailEnabled} onCheckedChange={(checked) => setEmailEnabled(checked)} />
        </div>

        <div className="space-y-2">
          <Label>Email address</Label>
          <Input
            className="w-125"
            type="email"
            disabled={!emailEnabled}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Lookback days</Label>
          <Input
            className="w-12"
            type="numberic"
            disabled={!emailEnabled}
            placeholder="2"
            value={lookbackDays}
            onChange={(e) => setLookbackDays(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Alert threshold percentage</Label>
          <Input
            className="w-12"
            type="numberic"
            disabled={!emailEnabled}
            placeholder="2"
            value={lookbackDays}
            onChange={(e) => setLookbackDays(e.target.value)}
          />
        </div>
      </ContainerWithMarks>

      <div className="flex w-full justify-end gap-2">
        {isDirty && <Button variant="secondary">Reset</Button>}
        <Button>Save</Button>
      </div>
    </div>
  )
}
