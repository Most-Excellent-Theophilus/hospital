'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useEffect, useState } from 'react'
import { NetworkListener } from './network.listener'
import { registerAxiosInterceptors } from '@/lib/interceptor'


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
 useEffect(() => {
    registerAxiosInterceptors();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        {children}
        <NetworkListener />
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
