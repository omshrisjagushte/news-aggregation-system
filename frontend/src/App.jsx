import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://news-aggregation-system-production.up.railway.app/api'

function App() {
  const [user, setUser] = useState(null)
  const [articles, setArticles] = useState([])
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch articles
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/articles`)
      setArticles(response.data.articles || [])
      setError('')
    } catch (err) {
      setError('Failed to load articles: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeeds = async () => {
    try {
      const response = await axios.get(`${API_URL}/feeds`)
      setFeeds(response.data.feeds || [])
    } catch (err) {
      console.error('Failed to load feeds:', err)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/articles/search?q=${searchTerm}`)
      setArticles(response.data.results || [])
    } catch (err) {
      setError('Search failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFeed = async () => {
    const url = prompt('Enter RSS feed URL:')
    if (!url) return

    try {
      const response = await axios.post(`${API_URL}/feeds`, {
        title: url.split('/')[2] || 'New Feed',
        url: url,
        description: ''
      })
      setFeeds([...feeds, response.data.feed])
    } catch (err) {
      setError('Failed to add feed: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">📰 News Aggregator</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('search')}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Search
            </button>
            <button
              onClick={() => setCurrentPage('feeds')}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'feeds'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Feeds
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Dashboard */}
        {currentPage === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading articles...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="grid gap-6">
                {articles.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {article.title || 'Untitled'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {article.description || article.content?.substring(0, 200) || 'No description'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {article.author || 'Unknown Author'}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">No articles found</p>
                <p className="text-gray-400">Add some RSS feeds to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        {currentPage === 'search' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Search Articles</h2>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </form>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-bold text-gray-900">{article.title}</h3>
                    <p className="text-gray-600 mt-2">{article.description?.substring(0, 150)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No search results</p>
              </div>
            )}
          </div>
        )}

        {/* Feeds */}
        {currentPage === 'feeds' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">RSS Feeds</h2>
              <button
                onClick={handleAddFeed}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add Feed
              </button>
            </div>

            {feeds.length > 0 ? (
              <div className="grid gap-4">
                {feeds.map((feed, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900">{feed.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm">{feed.url}</p>
                    <p className="text-gray-500 mt-2">{feed.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">No feeds added yet</p>
                <button
                  onClick={handleAddFeed}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Your First Feed
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-800 text-white text-center">
        <p>News Aggregation System v1.0 | API: {API_URL}</p>
      </footer>
    </div>
  )
}

export default App
