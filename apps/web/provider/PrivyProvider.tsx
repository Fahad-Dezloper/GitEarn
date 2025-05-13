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
                  "theme": "#222224",
                  "showWalletLoginFirst": false,
                  "logo": "https://ox35safakaidjuzg.public.blob.vercel-storage.com/GITEARN%20%282%29-EbGaOHcbaiC81M4aO8Y4olTmGPYdIy.png",
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