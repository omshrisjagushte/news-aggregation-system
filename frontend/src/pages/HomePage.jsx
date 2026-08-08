import React, { useState, useEffect } from 'react'
import { FiPlus, FiTrendingUp, FiCalendar } from 'react-icons/fi'

function HomePage() {
  const [feeds, setFeeds] = useState([
    { id: 1, title: 'TechCrunch', category: 'Technology' },
    { id: 2, title: 'BBC News', category: 'General' },
    { id: 3, title: 'HackerNews', category: 'Technology' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's your personalized news feed</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Feed
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Feeds</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <FiTrendingUp className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Bookmarks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">48</p>
            </div>
            <FiCalendar className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Articles Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
            </div>
            <FiTrendingUp className="text-3xl text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Feeds */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Feeds</h3>
        <div className="space-y-3">
          {feeds.map(feed => (
            <div key={feed.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{feed.title}</p>
                <p className="text-sm text-gray-600">{feed.category}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
