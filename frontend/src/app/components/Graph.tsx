import { useEffect, useState } from "react"

type GraphProps = {
  selectedCountry: string | null
}

type Country = {
  name: string,
  foodName: string,
  foodQuantityInTons: number,
  yearFoodProduction: Date
}

export default function Graph({selectedCountry} : GraphProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [countryData, setCountryData] = useState<Country[]>([])

  useEffect(() => {
    if (selectedCountry) {
      setIsVisible(true)
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:3001/elastic/countries/${selectedCountry}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`)
          }
          const jsonData = await response.json()
          setCountryData(jsonData.documents)
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }
      fetchData()
    } else {
      setIsVisible(false)
    }
  }, [selectedCountry])

  return (
    <div>
    {isVisible && (        
       <div>
        <h1>The selected country is {selectedCountry}.</h1>
        <ul>
          {countryData.map((country, index) => (
            <li key={index}>
              {country.foodName} - {country.foodQuantityInTons} tons
            </li>
          )
        )}
        </ul>
      </div>          
      )}
    </div>
  )
}