import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { FiHome, FiSearch, FiBookmark, FiSettings, FiClock } from 'react-icons/fi'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import BookmarksPage from './pages/BookmarksPage'
import SettingsPage from './pages/SettingsPage'
import DigitalClockPage from './pages/DigitalClockPage'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 overflow-y-auto`}>
          <div className="p-6 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-2xl font-bold text-blue-600">📰 NewsAgg</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded">
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
          <nav className="space-y-2 px-4">
            <NavLink to="/" icon={<FiHome />} label="Home" sidebarOpen={sidebarOpen} />
            <NavLink to="/search" icon={<FiSearch />} label="Search" sidebarOpen={sidebarOpen} />
            <NavLink to="/bookmarks" icon={<FiBookmark />} label="Bookmarks" sidebarOpen={sidebarOpen} />
            <NavLink to="/clock" icon={<FiClock />} label="World Clock" sidebarOpen={sidebarOpen} />
            <NavLink to="/settings" icon={<FiSettings />} label="Settings" sidebarOpen={sidebarOpen} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/clock" element={<DigitalClockPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

function NavLink({ to, icon, label, sidebarOpen }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 transition"
      title={!sidebarOpen ? label : ''}
    >
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span>{label}</span>}
    </Link>
  )
}

export default App
