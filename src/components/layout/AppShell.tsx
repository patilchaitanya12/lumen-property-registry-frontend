import {
  useEffect,
  useState,
} from 'react'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({
  children,
}: AppShellProps) {
  const [dark, setDark] = useState(() => {
    return (
      localStorage.getItem(
        'lumen-theme',
      ) === 'dark'
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      dark,
    )

    localStorage.setItem(
      'lumen-theme',
      dark ? 'dark' : 'light',
    )
  }, [dark])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Topbar
            dark={dark}
            onToggleTheme={() =>
              setDark((value) => !value)
            }
          />

          <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}