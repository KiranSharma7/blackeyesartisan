import { getGlobalSettings } from '@lib/data/fetch'
import AgeGateProvider from '@modules/age-gate/components/age-gate-provider'

export default async function CountryCodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch global settings from Strapi
  const globalSettingsData = await getGlobalSettings()
  const settings = globalSettingsData?.data

  // Default values if settings are not available
  const ageGateEnabled = settings?.ageGateEnabled ?? true
  const ageGateTtlDays = settings?.ageGateTtlDays ?? 30
  const ageGateTitle = settings?.ageGateTitle ?? 'Age Verification Required'
  const ageGateMessage =
    settings?.ageGateMessage ??
    'You must be 18 years or older to enter this site. By entering, you confirm that you are of legal age.'

  return (
    <AgeGateProvider
      enabled={ageGateEnabled}
      ttlDays={ageGateTtlDays}
      title={ageGateTitle}
      message={ageGateMessage}
    >
      {children}
    </AgeGateProvider>
  )
}
