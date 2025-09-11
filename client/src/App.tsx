import { useEffect, useState } from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'

type Product = {
  ProductID: number
  ProductName: string
  UnitPrice: number
  UnitsInStock: number
}

type AskResponse = {
  question: string
  answer: string | null
  sources?: any[]
  raw?: any
  error?: string
}

export default function App() {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Ask feature state
  const [question, setQuestion] = useState('')
  const [askLoading, setAskLoading] = useState(false)
  const [askResult, setAskResult] = useState<AskResponse | null>(null)
  const [askError, setAskError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products')
        const json = await res.json()
        setData(json)
      } catch (err) {
        // swallow for demo
        // eslint-disable-next-line no-console
        console.error('Failed to load products', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const ask = async () => {
    if (!question.trim()) return
    setAskLoading(true)
    setAskError(null)
    setAskResult(null)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      })
      const json = await res.json()
      if (!res.ok) {
        setAskError(json.error || 'Request failed')
      } else {
        setAskResult(json)
      }
    } catch (err: any) {
      setAskError(err?.message || 'Network error')
    } finally {
      setAskLoading(false)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      ask()
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1>Express + Vite + KendoReact</h1>

      <section style={{ border: '1px solid #ddd', padding: 16, borderRadius: 4 }}>
        <h2 style={{ marginTop: 0 }}>Ask</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ flex: 1, padding: '8px 12px' }}
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={askLoading}
          />
          <button onClick={ask} disabled={askLoading || !question.trim()}>{askLoading ? 'Asking...' : 'Ask'}</button>
        </div>
        <div style={{ marginTop: 12, minHeight: 60 }}>
          {askError && (
            <div style={{ color: 'crimson' }}>Error: {askError}</div>
          )}
          {askResult && !askError && (
            <div>
              <strong>Answer:</strong>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>
                {askResult.answer || '(No answer)'}
              </div>
              {askResult.sources && askResult.sources.length > 0 && (
                <details style={{ marginTop: 8 }}>
                  <summary>Sources ({askResult.sources.length})</summary>
                  <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>
                    {JSON.stringify(askResult.sources, null, 2)}
                  </pre>
                </details>
              )}
              <details style={{ marginTop: 8 }}>
                <summary>Raw</summary>
                <pre style={{ maxHeight: 240, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>
                  {JSON.stringify(askResult.raw, null, 2)}
                </pre>
              </details>
            </div>
          )}
          {askLoading && !askResult && !askError && (
            <div style={{ opacity: 0.7 }}>Waiting for answer...</div>
          )}
        </div>
      </section>

      <section>
        <h2 style={{ marginTop: 0 }}>Products</h2>
        <Grid
          style={{ height: 400 }}
          data={data}
          loading={loading}
          sortable
          filterable
        >
          <Column field="ProductID" title="ID" width="80px" />
          <Column field="ProductName" title="Product" />
          <Column field="UnitPrice" title="Price" />
          <Column field="UnitsInStock" title="In Stock" />
        </Grid>
      </section>
    </div>
  )
}
