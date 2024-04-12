"use client";
import { useEffect, useState } from "react"

type Country = {
  key: string
  doc_count: number
}

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const toggleDropdown = () => setIsOpen(!isOpen)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/elastic/countries")
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }

        const jsonData = await response.json()
        setCountries(jsonData.countries)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country)
    setIsOpen(false) // Close the dropdown after selection
  }

  return (
    <div className="flex justify-center items-center">
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800 focus:outline-none"
      >
        {selectedCountry || '-- Choose a country --'}
      </button>
      {isOpen && (
        <ul className="absolute left-1/2 transform -translate-x-1/2 text-center bg-white border border-gray-200 w-52 max-h-56 overflow-y-scroll rounded shadow-lg mt-1">
          {countries.map((country, index) => (
            <li 
              key={index} 
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectCountry(country.key)}
            >
              {country.key}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  )
}