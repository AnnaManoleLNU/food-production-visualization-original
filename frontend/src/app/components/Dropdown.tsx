"use client";
import { useEffect, useState } from "react";

type Country = {
  key: string;
  doc_count: number;
};

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const toggleDropdown = () => setIsOpen(!isOpen);

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
    };

    fetchData()
  }, [])

  return (
    <div>
      <button onClick={toggleDropdown}>
        {isOpen} Choose a country
      </button>
      {isOpen && (
        <ul>
          {countries.map((country, index) => (
            <li key={index}>{country.key}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
