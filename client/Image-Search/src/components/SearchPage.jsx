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
    <div className="p-5">
      <div className="mb-2.5">
        {top.length > 0 && (
          <div className="flex gap-2">
            {top.map(t => (
              <div key={t.term} className="border border-gray-300 p-2">
                {t.term} ({t.count})
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSearch}>
        <input
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder="search images"
          className="border border-gray-300 p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Search</button>
      </form>

      <div className="mt-2.5">{message}</div>
      <div className="mt-2.5">
        Selected: {Object.keys(selected).length} images
      </div>

      <div
        className="grid grid-cols-4 gap-2 mt-2.5"
      >
        {results.map(r => (
          <div key={r.id} className="relative">
            <img
              src={r.urls.small}
              className="w-full h-36 object-cover"
              alt=""
            />
            <input
              type="checkbox"
              checked={!!selected[r.id]}
              onChange={() => toggle(r)}
              className="absolute left-2 top-2"
            />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h4>Your Search History</h4>
        <div>
          {hist.map(h => (
            <div key={h._id}>
              {h.term} - {new Date(h.timestamp).toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
