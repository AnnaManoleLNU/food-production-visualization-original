import { useEffect, useState, useRef } from "react"
import * as d3 from "d3"

type GraphProps = {
  selectedCountry: string | null
};

type Country = {
  name: string
  foodName: string
  foodQuantityInTons: number
};

export default function Graph({ selectedCountry }: GraphProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [countryData, setCountryData] = useState<Country[]>([])
  const d3Container = useRef(null)

  useEffect(() => {
    // Append tooltip only if it doesn't exist
    if (d3.select("body").selectAll(".tooltip").empty()) {
      d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("padding", "8px")
        .style("background", "white")
        .style("border", "solid")
        .style("border-color", "#1e3a8a")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("display", "none")
    }

    return () => {
      // Select the tooltip and remove it when the component is unmounted
      d3.select(".tooltip").remove()
    }
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      setIsVisible(true)
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/elastic/countries/${selectedCountry}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
          const jsonData = await response.json();
          setCountryData(jsonData.documents);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchData()
    } else {
      setIsVisible(false)
    }
  }, [selectedCountry])

  useEffect(() => {
    if (isVisible && countryData.length > 0) {
      drawChart()
    }
  }, [isVisible, countryData])

  const drawChart = (dataSubset?: Country[] | null) => {
    const width = 500
    const height = 500
    const margin = 40
    const radius = Math.min(width, height) / 2 - margin

    d3.select(d3Container.current).selectAll("*").remove()
    const svg = d3
      .select(d3Container.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius)
    const totalQuantity = d3.sum(countryData, (d) => d.foodQuantityInTons)
    const threshold = totalQuantity * 0.05;
    
    const largeValues = countryData.filter(
      (d) => d.foodQuantityInTons > threshold
    );
    const otherValues = countryData.filter(
      (d) => d.foodQuantityInTons < threshold
    );   
    const otherValuesTotal = d3.sum(
      countryData.filter((d) => d.foodQuantityInTons <= threshold),
      (d) => d.foodQuantityInTons
    );

    const dataToDisplay = dataSubset ? dataSubset : largeValues
    
    if (otherValuesTotal > 0) {
      largeValues.push({
        name: "Other",
        foodName: "Other",
        foodQuantityInTons: otherValuesTotal,
      })
    }

    const color = d3.scaleOrdinal(d3.schemeBlues[3])
    const otherColor = "#18B05A"

    const pie = d3.pie().value((d) => d.foodQuantityInTons)
    const dataReady = pie(dataToDisplay)
    
    const tooltip = d3.select(".tooltip")

    // Create the arc paths and animate them
    svg
      .selectAll("path")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("fill", (d) =>
        d.data.foodName === "Other" ? otherColor : color(d.data.foodName)
      )
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .attr("d", arcGenerator)
      .each(function (d) {
        this._current = d;
      }) // store the initial angles
      .transition() 
      .duration(750) 
      .attrTween("d", function (d) {
        var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
        return function (t) {
          return arcGenerator(interpolate(t))
        }
      })

    // Tooltip interaction
    svg
      .selectAll("path")
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .style("opacity", 1)
          .html(`${d.data.foodName}: ${d.data.foodQuantityInTons} tons`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0).style("display", "none");
      })
      .on("click", function (event, d) {
        if (d.data.foodName === "Other") {
          drawChart(otherValues)
        }
      })

    svg
      .selectAll("text")
      .data(dataReady)
      .enter()
      .append("text")
      // .filter((d) => d.data.foodQuantityInTons > threshold)
      .text((d) => d.data.foodName)
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 14)
      .style("color", "white")
  }

  return (
    <div className="flex justify-center">
      {isVisible && <div ref={d3Container}></div>}
    </div>
  )
}
