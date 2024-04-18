import { useEffect, useRef, useState } from "react"

type Country = {
  key: string
  doc_count: number
}

type DropdownProps = {
  onSelectedCountry: (country: string) => void
  selectedFood: (food: string, quantity: number) => void
}

export default function Dropdown({ selectedFood, onSelectedCountry} : DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [inputValue, setInputValue] = useState("")
  const dropdownComponent = useRef(null)


  const useOutsideClick = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return() => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref])
  }

  useOutsideClick(dropdownComponent)

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    setIsOpen(true)
  }

  const handleClearInput = () => {
    setInputValue("")
    setIsOpen(false)
    onSelectedCountry("") // Notify the parent component that no country is selected
    selectedFood("", 0) // Notify the parent component that no food is selected
  }

  const filteredCountries = countries.filter(country =>
    country.key.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className="flex justify-center items-center mb-20" >
      <div className="relative" ref={dropdownComponent}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          placeholder="Choose a country"
          className="text-center border border-blue-900 py-2 px-4 rounded hover:border-blue-300 focus:outline-none"
          />
        {inputValue && (
          <button
            onClick={handleClearInput}
            className="absolute text-green-500 font-bold right-0 top-0 mt-2 mr-4"
          >
            ✕
          </button>
        )}
        {isOpen && (
          <ul className="absolute left-1/2 transform -translate-x-1/2 text-center bg-white border border-gray-200 w-52 max-h-56 overflow-y-scroll rounded shadow-lg mt-1">
            {filteredCountries.map((country, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelectedCountry(country.key)
                  setInputValue(country.key)
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