"use client"
import { PrivyProvider } from '@privy-io/react-auth'
import React from 'react'

const PrivyProviderr = ({children}: {children: React.ReactNode}) => {
  return (
    <PrivyProvider 
                appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
                config={{
                "appearance": {
                  "accentColor": "#6A6FF5",
                  "theme": "#FFFFFF",
                  "showWalletLoginFirst": false,
                  "logo": "https://auth.privy.io/logos/privy-logo.png",
                  "walletChainType": "solana-only",
                  "walletList": [
                    "detected_solana_wallets",
                    "phantom",
                    "solflare",
                    "backpack",
                    "okx_wallet"
                  ]
                },
                "loginMethods": [
                  "email"
                ],
                "fundingMethodConfig": {
                  "moonpay": {
                    "useSandbox": true
                  }
                },
                "embeddedWallets": {
                  "requireUserPasswordOnCreate": false,
                  "showWalletUIs": true,
                  "ethereum": {
                    "createOnLogin": "off"
                  },
                  "solana": {
                    "createOnLogin": "users-without-wallets"
                  }
                },
                "mfa": {
                  "noPromptOnMfaRequired": false
                },
                "externalWallets": {
                  "solana": {
                    "connectors": {
                      "onMount": () => {},
                      "onUnmount": () => {},
                      "get": () => []
                    }
                  }
                }
              }}
              >
      {children}
    </PrivyProvider>
  )
}

export default PrivyProviderr