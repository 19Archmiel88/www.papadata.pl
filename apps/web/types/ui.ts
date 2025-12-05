export interface PricingConfig {
  sources: number
  isYearly: boolean
  expertSetup: boolean
}

export interface IntegrationItem {
  name: string
  category: string
}

export type ModalState =
  | 'initial'
  | 'cookie'
  | 'welcome'
  | 'sticky'
  | 're-engage'
  | 'definitely-closed'

export interface NavItem {
  label: string
  href: string
}
