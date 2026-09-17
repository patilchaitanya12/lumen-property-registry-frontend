import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'
import { Locations } from './pages/Locations'
import { LocationProfile } from './pages/LocationProfile'
import { Orders } from './pages/Orders'
import { OwnerProfile } from './pages/OwnerProfile'
import { Owners } from './pages/Owners'
import { Search } from './pages/Search'
import { UnitProfile } from './pages/UnitProfile'
import { Units } from './pages/Units'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/search" element={<Search />} />

          <Route path="/owners" element={<Owners />} />
          <Route
            path="/owners/:ownerId"
            element={<OwnerProfile />}
          />

          <Route path="/properties" element={<Units />} />
          <Route
            path="/properties/:unitId"
            element={<UnitProfile />}
          />

          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/:locationId" element={<LocationProfile />} />
          <Route path="/history" element={<History />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
