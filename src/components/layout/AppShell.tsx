import {
  useEffect,
  useState,
} from 'react'

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { GlobalSearch } from '../search/GlobalSearch'

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

  const [searchOpen, setSearchOpen] =
    useState(false)

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

  const onToggleTheme = () => {
    setDark((current) => !current)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Topbar
            dark={dark}
            onToggleTheme={onToggleTheme}
            onOpenSearch={() => setSearchOpen(true)}
          />

          <GlobalSearch
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
          />

          <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}