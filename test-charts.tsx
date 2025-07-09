"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const testData = [
  { name: "A", value: 10 },
  { name: "B", value: 20 },
  { name: "C", value: 30 },
]

export default function TestCharts() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Recharts</h1>

      <div className="bg-white p-4 rounded border">
        <h2 className="text-lg mb-2">Datos de prueba:</h2>
        <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(testData, null, 2)}</pre>
      </div>

      <div className="bg-white p-4 rounded border mt-4">
        <h2 className="text-lg mb-2">Gráfico Simple:</h2>
        <div style={{ width: "100%", height: "200px" }}>
          <ResponsiveContainer>
            <BarChart data={testData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded border mt-4">
        <h2 className="text-lg mb-2">Gráfico Sin ResponsiveContainer:</h2>
        <BarChart width={400} height={200} data={testData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  )
}
