import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@emotion/react'
import { theme } from '@/styles/theme'
import { MemoryRouter } from 'react-router-dom'

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/' } = {}
) {
  const queryClient = new QueryClient()

  return render(
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}
