import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

type GraphProps = {
  selectedCountry: string | null
  onSelectedFood: (food:string, quantity: number) => void
};

type Country = {
  name: string;
  foodName: string;
  foodQuantityInTons: number;
};

export default function BarChart({ selectedCountry, onSelectedFood }: GraphProps, ) {
  const [isVisible, setIsVisible] = useState(false);
  const [countryData, setCountryData] = useState<Country[]>([]);
  const barContainer = useRef(null);

  useEffect(() => {
    if (selectedCountry) {
      setIsVisible(true);
      const fetchData = async () => {
        const response = await fetch(
          `https://cscloud6-228.lnu.se/wt2/elastic/countries/${selectedCountry}`
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
    if (d3.select("body").selectAll(".tooltipBar").empty()) {
      d3.select("body")
        .append("div")
        .attr("class", "tooltipBar")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("padding", "8px")
        .style("background", "white")
        .style("border", "solid")
        .style("border-color", "#1e3a8a")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("display", "none");
    }

    return () => {
      d3.select(".tooltipBar").remove();
    };
  }, []);

  useEffect(() => {
    // Clear the container before redrawing it
    d3.select(barContainer.current).selectAll("*").remove();

    if (isVisible && countryData.length > 0) {
      drawBarChart(countryData);
    }
  }, [isVisible, countryData]);

  const drawBarChart = (data: Country[]) => {
    const margin = { top: 30, right: 30, bottom: 70, left: 70 },
      width = 850 - margin.left - margin.right,
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
      .domain([0, d3.max(data, (d: Country) => d.foodQuantityInTons)]);

    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: Country) => x(d.foodName))
      .attr("y", () => y(0)) // no y at the start
      .attr("width", x.bandwidth())
      .attr("height", () => height - y(0)) // no height at the start
      .attr("fill", "#1E3A8A")
      .on("mouseover", function (event:any, d:Country) {
        const element = event.currentTarget;
        // make the bar lighter
        d3.select(event.currentTarget).style("opacity", 0.7);
        d3.select(".tooltipBar")
          .style("display", "block")
          .style("opacity", 1)
          .html(`${d.foodName}: ${d.foodQuantityInTons} tons`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event:any) {
        // make the bar normal
        d3.select(event.currentTarget).style("opacity", 1);
        d3.select(".tooltipBar").style("display", "none");
      })
      .on("click", function(event:any, d:any) {
        // set it to the text of the rect clicked and pass in the values too 
        onSelectedFood(d.foodName, d.foodQuantityInTons)
      })

    // Animation
    svg
      .selectAll("rect")
      .transition()
      .duration(750)
      .attr("y", function (d: Country) {
        return y(d.foodQuantityInTons);
      })
      .attr("height", function (d: Country) {
        return height - y(d.foodQuantityInTons);
      })
      .delay(function (d: Country, i: number) {
        return i * 100;
      });
  };

  return (
    <div className="flex flex-col justify-center items-center text-center">
      {isVisible && (
        <div>
          <p className="text-3xl font-bold text-green-600">Data summary</p>
          <p className="text-sm">
            Click on any bar to display more information in relation to global production.
          </p>
        </div>
      )}
      {isVisible && <div ref={barContainer}></div>}
    </div>
  );
}
