import React, { useState } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = (e) => {
    e.preventDefault()
    // Mock search results
    setResults([
      { id: 1, title: 'React 18 New Features', source: 'Dev.to', date: '2 hours ago' },
      { id: 2, title: 'Node.js Performance Tips', source: 'Medium', date: '4 hours ago' },
    ])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Search News</h2>
        <p className="text-gray-600 mt-1">Find articles across all your subscribed feeds</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="card">
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, keywords, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <FiSearch /> Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FiFilter className="text-gray-600" />
          <p className="font-semibold text-gray-900">Filters</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Categories</option>
            <option>Technology</option>
            <option>Business</option>
            <option>Sports</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Time</option>
            <option>Last 24 Hours</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Most Recent</option>
            <option>Most Relevant</option>
            <option>Trending</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map(article => (
            <div key={article.id} className="card hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-gray-600">Source: {article.source}</p>
                    <p className="text-sm text-gray-500">{article.date}</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  Save
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">Enter a search term to find articles</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
