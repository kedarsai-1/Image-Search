import React, { useEffect, useState } from 'react'
import { doSearch, topSearches, history } from '../api'

export default function SearchPage() {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState({})
  const [top, setTop] = useState([])
  const [hist, setHist] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchTop()
    fetchHist()
  }, [])

  async function fetchTop() {
    const t = await topSearches()
    setTop(t)
  }

  async function fetchHist() {
    const h = await history()
    setHist(h)
  }

  async function onSearch(e) {
    e.preventDefault()
    const r = await doSearch(term)
    setMessage(`You searched for ${r.term} -- ${r.total} results.`)
    setResults(r.results || [])
    setSelected({})
    fetchTop()
    fetchHist()
  }

  function toggle(i) {
    const id = i.id || i.urls.small
    const s = { ...selected }
    if (s[id]) delete s[id]
    else s[id] = i
    setSelected(s)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Searches Section */}
        {top.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Searches</h3>
            <div className="flex flex-wrap gap-3">
              {top.map(t => (
                <div key={t.term} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                  {t.term} <span className="ml-1 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={onSearch} className="flex gap-3 max-w-2xl">
            <input
              value={term}
              onChange={e => setTerm(e.target.value)}
              placeholder="Search for amazing images..."
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg shadow-sm"
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Info */}
        {message && (
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">{message}</p>
            </div>
          </div>
        )}
        
        {Object.keys(selected).length > 0 && (
          <div className="mb-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                Selected: {Object.keys(selected).length} images
              </p>
            </div>
          </div>
        )}

        {/* Image Results Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map(r => (
              <div key={r.id} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src={r.urls.small}
                  className="w-full h-64 object-cover"
                  alt={r.alt_description || 'Search result'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {r.alt_description || 'Beautiful image'}
                    </p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    checked={!!selected[r.id]}
                    onChange={() => toggle(r)}
                    className="w-6 h-6 rounded-full border-2 border-white bg-white bg-opacity-80 checked:bg-blue-500 checked:border-blue-500 transition-all duration-200 cursor-pointer hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search History */}
        {hist.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Your Search History
            </h3>
            <div className="space-y-3">
              {hist.map(h => (
                <div key={h._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <span className="font-medium text-gray-800">{h.term}</span>
                  <span className="text-sm text-gray-500">{new Date(h.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
