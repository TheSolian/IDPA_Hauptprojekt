import { ThemeProvider } from '@/lib/theme-provider'
import { store } from '@/redux/store'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme='system' storageKey='theme'>
        {children}
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default Providers
