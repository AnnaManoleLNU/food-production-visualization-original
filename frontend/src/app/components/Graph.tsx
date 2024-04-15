import { useEffect, useState, useRef } from "react"
import * as d3 from "d3"

type GraphProps = {
  selectedCountry: string | null;
};

type Country = {
  name: string;
  foodName: string;
  foodQuantityInTons: number;
};

export default function Graph({ selectedCountry }: GraphProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [countryData, setCountryData] = useState<Country[]>([])
  const d3Container = useRef(null)

  useEffect(() => {
    if (selectedCountry) {
      setIsVisible(true)
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/elastic/countries/${selectedCountry}`
          );
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
  }, [selectedCountry]) // Re-render on selectedCountry change

  useEffect(() => {
    if (isVisible && countryData.length > 0) {
      drawChart()
    }
  }, [isVisible, countryData])

  const drawChart = () => {
    const width = 500
    const height = 500
    const margin = 40

    // Clear previous svg
    d3.select(d3Container.current).selectAll("*").remove()

    const radius = Math.min(width, height) / 2 - margin

    const svg = d3
      .select(d3Container.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    const color = d3
      .scaleOrdinal()
      .domain(countryData.map((d) => d.foodName))
      .range(d3.schemeBlues[5])

    // Compute the position of each group on the pie
    const pie = d3.pie<Country>().value((d: any) => d.foodQuantityInTons);

    const data_ready = pie(countryData);

    // Shape helper to build arcs
    const arcGenerator = d3
      .arc<d3.PieArcDatum<Country>>()
      .innerRadius(0)
      .outerRadius(radius)

    // Build the pie chart
    svg
      .selectAll("slices")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (d: any) => color(d.data.foodName))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)

    const totalQuantity = d3.sum(countryData, (d: any) => d.foodQuantityInTons);
    const threshold = totalQuantity * 0.05 // 5% threshold

    // Build the pie chart
    svg
      .selectAll("text")
      .data(data_ready)
      .join("text")
      .filter((d: any) => d.data.foodQuantityInTons > threshold) // Only add labels if above threshold
      .text((d: any) => d.data.foodName)
      .attr("transform", (d: any) => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 14)
  }

  return (
    <div className="flex justify-center">
      {isVisible && (
          <div ref={d3Container}></div>
      )}
    </div>
  )
}
