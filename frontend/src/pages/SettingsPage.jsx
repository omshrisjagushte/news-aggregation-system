import React, { useState } from 'react'
import { FiSave, FiBell, FiMoon, FiMail } from 'react-icons/fi'

function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailDigest: 'daily',
    itemsPerPage: 20,
  })

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Customize your News Aggregation experience</p>
      </div>

      {/* Display Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <FiMoon /> Display
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
            <select
              value={settings.itemsPerPage}
              onChange={(e) => handleChange('itemsPerPage', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <FiBell /> Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700">Enable notifications</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          {settings.notifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email digest frequency</label>
              <select
                value={settings.emailDigest}
                onChange={(e) => handleChange('emailDigest', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="off">Off</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="btn-primary flex items-center gap-2">
          <FiSave /> Save Settings
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          Reset to Default
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
