import { useState } from 'react'
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid'
import { Chat, type Message, type User } from '@progress/kendo-react-conversational-ui'
import { Card } from '@progress/kendo-react-layout'
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts'

type CompanyData = {
  Company: string
  Revenue: number
  EBITDA: number
}

export default function GridDemo() {
  // Mock financial data
  const companyData: CompanyData[] = [
    { Company: 'Apple', Revenue: 560000, EBITDA: 347000 },
    { Company: 'Microsoft', Revenue: 333000, EBITDA: 210000 },
    { Company: 'Amazon', Revenue: 322000, EBITDA: 220000 },
    { Company: 'Google', Revenue: 296000, EBITDA: 260000 },
    { Company: 'Tesla', Revenue: 118000, EBITDA: 140000 },
    { Company: 'Facebook', Revenue: 119000, EBITDA: 169000 },
    { Company: 'IBM', Revenue: 119000, EBITDA: 63000 },
    { Company: 'Intel', Revenue: 68000, EBITDA: 94000 },
    { Company: 'Cisco', Revenue: 58000, EBITDA: 38000 },
    { Company: 'Oracle', Revenue: 30000, EBITDA: 23000 }
  ]

  // Mock cash flow data
  const cashFlowData = [
    { quarter: 'Q1 2023', value: 300 },
    { quarter: 'Q2 2023', value: 380 },
    { quarter: 'Q4 2023', value: 520 }
  ]

  // Chat users
  const user: User = {
    id: 1,
    name: 'Demo User',
  }

  const bot: User = { 
    id: 0, 
    name: 'Financial Assistant',
  }

  // Chat state using KendoReact Message type
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: user,
      timestamp: new Date(),
      text: "Show me Tesla's free cash flow trend over the past 4 quarters"
    },
    {
      id: 2,
      author: bot,
      timestamp: new Date(),
      text: "Tesla's free cash flow grew 15% YoY but declined last quarter"
    }
  ])

  // Handle new messages from Chat component
  const handleSendMessage = (event: { message: Message }) => {
    const userMessage = {
      ...event.message,
      author: user
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now(),
        author: bot,
        timestamp: new Date(),
        text: "I can help you analyze financial data. Please ask about specific companies or metrics."
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div className="k-d-grid k-grid-cols-1 k-grid-cols-xl-3 k-bg-surface k-gap-lg k-p-lg k-h-full">
      {/* Left Panel - Chat */}
      <div className="k-col-span-1 k-col-span-xl-1 k-col-start-xl-1 k-col-end-xl-2">
        <Card>
          <div className="k-p-lg k-d-flex k-flex-col">
            <h2 className="k-font-size-xl k-font-bold k-mb-lg">Chat</h2>
            
            <Chat
              messages={messages}
              authorId={user.id}
              onSendMessage={handleSendMessage}
              placeholder="Type your message..."
              height={"840px"}
            />
          </div>
        </Card>
      </div>

      {/* Right Panel - Financial Analysis */}
      <div className="k-col-span-1 k-col-span-xl-2 k-col-start-xl-2 k-col-end-xl-4">
        <Card>
          <div className="k-p-lg">
            <h2 className="k-font-size-xl k-font-bold k-mb-lg">Financial Analysis</h2>
            
            <div className="k-d-flex k-flex-col k-gap-lg">
              {/* KPI Comparison Table */}
              <div>
                <h3 className="k-font-size-lg k-font-semibold k-mb-md">KPI Comparison</h3>
                <Grid
                  data={companyData}
                  style={{ height: 350 }}
                  sortable
                  filterable
                >
                  <Column field="Company" title="Company" width="300px" />
                  <Column field="Revenue" title="Revenue" format="{0:n0}" />
                  <Column field="EBITDA" title="EBITDA" format="{0:n0}" />
                </Grid>
              </div>

              {/* Free Cash Flow Trend - KendoReact Chart */}
              <div>
                <h3 className="k-font-size-lg k-font-semibold k-mb-md">Free Cash Flow Trend</h3>
                <Chart style={{ height: 350 }}>
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={cashFlowData.map(d => d.quarter)} />
                  </ChartCategoryAxis>
                  <ChartValueAxis>
                    <ChartValueAxisItem 
                      labels={{ format: "{0}M" }}
                      title={{ text: "Cash Flow (Millions)" }}
                    />
                  </ChartValueAxis>
                  <ChartSeries>
                    <ChartSeriesItem 
                      type="line" 
                      data={cashFlowData.map(d => d.value)}
                      markers={{ visible: true }}
                      color="#ff6800"
                      tooltip={{ visible: true, format: "{0}M" }}
                    />
                  </ChartSeries>
                </Chart>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
