import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { count } from "console";

type GraphProps = {
  selectedCountry: string | null;
};

type Country = {
  name: string;
  foodName: string;
  foodQuantityInTons: number;
};

export default function BarChart({ selectedCountry }: GraphProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [countryData, setCountryData] = useState<Country[]>([]);
  const barContainer = useRef(null);

  useEffect(() => {
    if (selectedCountry) {
      setIsVisible(true);
      const fetchData = async () => {
        const response = await fetch(
          `http://localhost:3001/elastic/countries/${selectedCountry}`
        );
        if (!response.ok) {
          console.error("Failed to fetch:", response.statusText);
          return;
        }
        const jsonData = await response.json();
        setCountryData(jsonData.documents);
      };
      fetchData();
    } else {
      setIsVisible(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    // Clear the container before redrawing it
    d3.select(barContainer.current).selectAll("*").remove();

    if (isVisible && countryData.length > 0) {
      drawBarChart(countryData);
    }
  }, [isVisible, countryData]);

  const drawBarChart = (data: Country[]) => {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(barContainer.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis.
    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.2)
      .domain(data.map((d) => d.foodName));

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.foodQuantityInTons)]);

    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.foodName))
      .attr("y", (d) => y(d.foodQuantityInTons))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.foodQuantityInTons))
      .attr("fill", "#1E3A8A");
  };

  return <>{isVisible && <div ref={barContainer}></div>}</>;
}
