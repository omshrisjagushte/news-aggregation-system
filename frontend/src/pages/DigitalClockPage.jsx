import React, { useState, useEffect } from 'react'
import { FiPlus, FiX, FiClock } from 'react-icons/fi'

const TIMEZONES = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Singapore', tz: 'Asia/Singapore' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'Mexico City', tz: 'America/Mexico_City' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
  { name: 'Moscow', tz: 'Europe/Moscow' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Bangkok', tz: 'Asia/Bangkok' },
  { name: 'Istanbul', tz: 'Europe/Istanbul' },
  { name: 'Mumbai', tz: 'Asia/Kolkata' },
  { name: 'Bangkok', tz: 'Asia/Bangkok' },
  { name: 'Seoul', tz: 'Asia/Seoul' },
  { name: 'Toronto', tz: 'America/Toronto' },
  { name: 'Vancouver', tz: 'America/Vancouver' },
]

function DigitalClockPage() {
  const [selectedClocks, setSelectedClocks] = useState([
    { id: 1, name: 'New York', tz: 'America/New_York' },
    { id: 2, name: 'London', tz: 'Europe/London' },
    { id: 3, name: 'Tokyo', tz: 'Asia/Tokyo' },
  ])
  const [times, setTimes] = useState({})
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = {}
      selectedClocks.forEach(clock => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: clock.tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        newTimes[clock.id] = formatter.format(new Date())
      })
      setTimes(newTimes)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [selectedClocks])

  const addClock = (timezone) => {
    if (!selectedClocks.find(c => c.tz === timezone.tz)) {
      setSelectedClocks(prev => [
        ...prev,
        { id: Date.now(), name: timezone.name, tz: timezone.tz }
      ])
      setShowDropdown(false)
    }
  }

  const removeClock = (id) => {
    setSelectedClocks(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiClock /> World Clock
          </h2>
          <p className="text-gray-600 mt-1">Track time across different time zones</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Timezone
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {TIMEZONES.map(tz => (
                <button
                  key={tz.tz}
                  onClick={() => addClock(tz)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition"
                >
                  {tz.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedClocks.map(clock => (
          <div key={clock.id} className="card hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{clock.name}</h3>
              <button
                onClick={() => removeClock(clock.id)}
                className="p-1 hover:bg-red-50 rounded-lg transition"
              >
                <FiX className="text-red-600" size={20} />
              </button>
            </div>

            {/* Digital Display */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 text-center">
              <div className="font-mono text-5xl text-green-400 font-bold tracking-wider">
                {times[clock.id]}
              </div>
              <div className="text-green-300 text-sm font-mono mt-3">
                {clock.tz.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">UTC Offset</p>
                  <p className="font-semibold text-gray-900">
                    {new Intl.DateTimeFormat('en-US', {
                      timeZone: clock.tz,
                      timeZoneName: 'short',
                    }).formatToParts(new Date())
                      .find(p => p.type === 'timeZoneName')
                      ?.value || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString('en-US', {
                      timeZone: clock.tz,
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedClocks.length === 0 && (
        <div className="card text-center py-12">
          <FiClock className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No time zones added yet</p>
          <p className="text-gray-400 mt-2">Click 'Add Timezone' to get started</p>
        </div>
      )}
    </div>
  )
}

export default DigitalClockPage
