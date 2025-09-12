import { useEffect, useState } from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { buildApiUrl } from '../config/api'

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
  incomplete?: boolean
}

export default function GridDemo() {
  const [data, setData] = useState<Product[]>([])

  // Ask feature state
  const [question, setQuestion] = useState('')
  const [askLoading, setAskLoading] = useState(false)
  const [askResult, setAskResult] = useState<AskResponse | null>(null)
  const [askError, setAskError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(buildApiUrl('/api/products'))
        const json = await res.json()
        setData(json)
      } catch (err) {
        // swallow for demo
        // eslint-disable-next-line no-console
        console.error('Failed to load products', err)
      } finally {
      }
    })()
  }, [])

  const ask = async () => {
    if (!question.trim() || askLoading) return
    setAskLoading(true)
    setAskError(null)
    setAskResult(null)
    try {
      const res = await fetch(buildApiUrl('/api/ask'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      })
      if (!res.ok || !res.body) {
        const maybe = await res.json().catch(() => ({}))
        throw new Error(maybe.error || 'Request failed')
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        // SSE messages separated by double newlines
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''
        for (const part of parts) {
          const lines = part.split('\n').filter(Boolean)
          let dataLine = lines.find(l => l.startsWith('data: '))
          // handle "event: error" lines
          const isError = lines.some(l => l.startsWith('event: error'))
          if (isError) {
            if (dataLine) {
              try {
                const payload = JSON.parse(dataLine.replace(/^data: /, ''))
                setAskError(payload.error || 'Error')
              } catch {
                setAskError('Error')
              }
            } else {
              setAskError('Error')
            }
            setAskLoading(false)
            return
          }
          if (dataLine) {
            try {
              const payload = JSON.parse(dataLine.replace(/^data: /, '')) as AskResponse
              setAskResult(prev => ({ ...(prev || {}), ...payload }))
              if (!payload.incomplete) {
                setAskLoading(false)
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('Failed to parse SSE chunk', e, part)
            }
          }
        }
      }
      // Ensure loading cleared if stream ended without explicit final flag
      setAskLoading(false)
    } catch (err: any) {
      setAskError(err?.message || 'Network error')
      setAskLoading(false)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      ask()
    }
  }

  return (
    <div className="k-p-lg k-d-flex k-flex-col k-gap-lg">
      <h1 className="k-font-size-xl k-font-bold">Express + Vite + KendoReact</h1>

      <section className="k-border k-border-subtle k-p-md k-rounded-md">
        <h2 className="k-mt-0 k-font-size-lg k-font-semibold">Ask</h2>
        <div className="k-d-flex k-gap-sm">
          <input
            className="k-flex-1 k-p-sm k-border k-border-subtle k-rounded-sm"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={askLoading}
          />
          <button 
            className="k-p-sm k-border k-border-primary k-bg-primary k-text-surface k-rounded-sm" 
            onClick={ask} 
            disabled={askLoading || !question.trim()}
          >
            {askLoading ? 'Streaming...' : 'Ask'}
          </button>
        </div>
        <div className="k-mt-md k-min-h-16">
          {askError && (
            <div className="k-text-error">Error: {askError}</div>
          )}
          {askResult && !askError && (
            <div>
              <strong>Answer:</strong>
              <div className="k-mt-xs" style={{ whiteSpace: 'pre-wrap' }}>
                {askResult.answer || '(No answer yet)'}
              </div>
              {askResult.sources && askResult.sources.length > 0 && !askResult.incomplete && (
                <details className="k-mt-sm">
                  <summary>Sources ({askResult.sources.length})</summary>
                  <pre className="k-bg-surface-alt k-p-sm k-rounded-sm k-overflow-auto" style={{ maxHeight: 200 }}>
                    {JSON.stringify(askResult.sources, null, 2)}
                  </pre>
                </details>
              )}
              <details className="k-mt-sm">
                <summary>Raw (latest chunk)</summary>
                <pre className="k-bg-surface-alt k-p-sm k-rounded-sm k-overflow-auto" style={{ maxHeight: 240 }}>
                  {JSON.stringify(askResult.raw, null, 2)}
                </pre>
              </details>
            </div>
          )}
          {askLoading && !askResult && !askError && (
            <div className="k-text-subtle">Waiting for first chunk...</div>
          )}
        </div>
      </section>

      <section>
        <h2 className="k-mt-0 k-font-size-lg k-font-semibold">Products</h2>
        <Grid
          style={{ height: 400 }}
          data={data}
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
