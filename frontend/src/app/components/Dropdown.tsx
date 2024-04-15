import { useEffect, useState } from "react"

type Country = {
  key: string
  doc_count: number
}

type DropdownProps = {
  selectedCountry: string | null
  onSelectedCountry: (country: string) => void
}

export default function Dropdown({selectedCountry, onSelectedCountry} : DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
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
  }, []) // Empty array = runs only once after the initial render


  return (
    <div className="flex justify-center items-center">
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="border border-blue-800 py-2 px-4 rounded hover:border-blue-300 focus:outline-none"
      >
        {selectedCountry || 'Choose a country'}
      </button>
      {isOpen && (
        <ul className="absolute left-1/2 transform -translate-x-1/2 text-center bg-white border border-gray-200 w-52 max-h-56 overflow-y-scroll rounded shadow-lg mt-1">
          {countries.map((country, index) => (
            <li 
              key={index} 
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelectedCountry(country.key)
                setIsOpen(false)
              }}
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