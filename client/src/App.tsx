import { useEffect, useState } from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'

type Product = {
  ProductID: number
  ProductName: string
  UnitPrice: number
  UnitsInStock: number
}

export default function App() {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/products')
      const json = await res.json()
      setData(json)
      setLoading(false)
    })()
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Express + Vite + KendoReact</h1>
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
    </div>
  )
}
