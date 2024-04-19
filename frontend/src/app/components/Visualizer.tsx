"use client"
import BarChart from "./BarChart"
import Dropdown from "./Dropdown"
import Pie from "./Pie"
import PiePopup from "./PiePopup"
import { useState } from "react"

export default function Visualizer() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedFood, setSelectedFood] = useState<{name: string | null, quantity: number | null}>({name: null, quantity: null});

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country)
  }

  const handleSelectFood = (food: string, quantity: number) => { 
    setSelectedFood({name: food, quantity: quantity});
  }

  return (
    // React fragment.
    <> 
      <Dropdown
        onSelectedCountry={handleSelectCountry}
        selectedFood={handleSelectFood}
       />
       <div className="flex justify-center items-center flex-col gap-20 md:flex-col desktop:flex-row desktop:gap-20" >
      <Pie 
        selectedCountry={selectedCountry}
      />
      <BarChart
         selectedCountry={selectedCountry}
         onSelectedFood={handleSelectFood}
        />
        </div>

        <PiePopup
         selectedFood={selectedFood}
         selectedCountry={selectedCountry}
         />
    </>
  )
}