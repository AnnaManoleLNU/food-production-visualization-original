"use client"
import Dropdown from "./Dropdown"
import Graph from "./Graph"
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
      <Graph 
        selectedCountry={selectedCountry}
      />
    </>
  )
}