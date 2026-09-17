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

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false)

  const [mobileSidebarOpen, setMobileSidebarOpen] =
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

  const onToggleSidebar = () => {
    setSidebarCollapsed(
      (current) => !current,
    )
  }

  const onOpenMobileSidebar = () => {
    setMobileSidebarOpen(true)
  }

  const onCloseMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={onCloseMobileSidebar}
        />

        <div className="min-w-0 flex-1">
          <Topbar
            dark={dark}
            sidebarCollapsed={sidebarCollapsed}
            onToggleTheme={onToggleTheme}
            onOpenSearch={() =>
              setSearchOpen(true)
            }
            onToggleSidebar={onToggleSidebar}
            onOpenMobileSidebar={
              onOpenMobileSidebar
            }
          />

          <GlobalSearch
            open={searchOpen}
            onClose={() =>
              setSearchOpen(false)
            }
          />

          <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
