"use client"
import { useEffect, useState } from "react"

type DataItem = {
  _id: string
  _source: {
    name: string
    foodName: string
    foodQuantityInTons: number,
    yearFoodProduction: string
  }
}

function DataComponent() {
  const [data, setData] = useState<DataItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/elastic")
      if (!response.ok) {
        console.error("Failed to fetch data:", response.statusText)
        return
      }

      const jsonData = await response.json()
      console.log(jsonData.hits.hits, jsonData.hits.hits.length)
      setData(jsonData.hits.hits)
    };

    fetchData()
  }, [])

  return (
    <div>
      <table className="min-w-full table-auto border-collapse border-spacing-0 m-4">
        <thead>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Country</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Food</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Amount in tons</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Year of production</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
          {data.map((item: DataItem) => (
            <tr key={item._id}>
              <td className="border-b dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item._source.name}</td>
              <td className="border-b dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item._source.foodName}</td>
              <td className="border-b dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item._source.foodQuantityInTons}</td>
              <td className="border-b dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item._source.yearFoodProduction.slice(0, 4)}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataComponent
