import React, { useState } from 'react'
import { FiTrash2, FiExternalLink } from 'react-icons/fi'

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: 'Getting Started with React Hooks', source: 'Dev.to', date: '2024-01-15' },
    { id: 2, title: 'PostgreSQL Query Optimization', source: 'Medium', date: '2024-01-14' },
  ])

  const handleDelete = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Bookmarks</h2>
        <p className="text-gray-600 mt-1">Your saved articles for later reading</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="card hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{bookmark.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-gray-600">{bookmark.source}</p>
                    <p className="text-sm text-gray-500">{bookmark.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <FiExternalLink className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No bookmarks yet</p>
          <p className="text-gray-400 mt-2">Start bookmarking articles to read them later</p>
        </div>
      )}
    </div>
  )
}

export default BookmarksPage
