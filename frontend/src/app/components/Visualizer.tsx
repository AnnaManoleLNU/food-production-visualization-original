"use client"
import BarChart from "./BarChart"
import Dropdown from "./Dropdown"
import Pie from "./Pie"
import { useState } from "react"

export default function Visualizer() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country)
  }

  return (
    // React fragment.
    <> 
      <Dropdown
        selectedCountry={selectedCountry}
        onSelectedCountry={handleSelectCountry}
       />
       <div className="flex justify-center items-center" >
      <Pie 
        selectedCountry={selectedCountry}
      />
      <BarChart
         selectedCountry={selectedCountry}
        />
        </div>
    </>
  )
}