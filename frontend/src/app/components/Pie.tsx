import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

type GraphProps = {
  selectedCountry: string | null;
};

type Country = {
  name: string;
  foodName: string;
  foodQuantityInTons: number;
};

export default function Pie({ selectedCountry }: GraphProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [countryData, setCountryData] = useState<Country[]>([]);
  const pieContainer = useRef(null);

  useEffect(() => {
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
        .style("display", "none");
    }

    return () => {
      d3.select(".tooltip").remove();
    };
  }, []);

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
    if (isVisible && countryData.length > 0) {
      drawPieChart(countryData, true);
    }
  }, [isVisible, countryData]);

  const drawPieChart = (data: Country[], initial = false) => {
    const totalQuantity = d3.sum(data, (d: Country) => d.foodQuantityInTons);
    const threshold = totalQuantity * 0.05; 
    let dataToDisplay = data.filter((d) => d.foodQuantityInTons > threshold);
    const otherQuantity =
      totalQuantity -
      d3.sum(dataToDisplay, (d: Country) => d.foodQuantityInTons);

    if (otherQuantity > threshold || initial) {
      dataToDisplay.push({
        name: "Other",
        foodName: "Other",
        foodQuantityInTons: otherQuantity,
      });
    }

    const width = 500;
    const height = 500;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(pieContainer.current)
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d: Country) => d.foodQuantityInTons);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    const color = d3.scaleOrdinal([
      "#abd9e9",
      "#74add1",
      "#4575b4",
      "#313695", 
    ]);
    const otherColor = "#18B05A";

    const update = svg.selectAll("path").data(pie(dataToDisplay));

    update
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d: any) =>
        d.data.foodName === "Other" ? otherColor : color(d.data.foodName)
      )
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function (event: any, d: any) {
        if (d.data.foodName === "Other") {
          d3.select(event.currentTarget)
            .style("transform", "scale(1.1)")
            .style("transition", "transform 0.2s")
            .style("cursor", "pointer");
        }
        d3.select(".tooltip")
          .style("display", "block")
          .style("opacity", 1)
          .html(`${d.data.foodName}: ${d.data.foodQuantityInTons} tons`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event: any, d: any) {
        if (d.data.foodName === "Other") {
          d3.select(event.currentTarget).style("transform", "scale(1)");
        }
        d3.select(".tooltip").style("opacity", 0).style("display", "none");
      })
      .on("click", (event: any, d: any) => {
        if (d.data.foodName === "Other") {
          drawPieChart(
            data.filter((d) => d.foodQuantityInTons <= threshold),
            false
          );
        } else {
          drawPieChart(countryData, true);
        }
      })
      .each(function (this: any, d: any) {
        this._current = { startAngle: d.startAngle, endAngle: d.startAngle };
      })
      .transition()
      .duration(750)
      .attrTween("d", function (this: any, d: any) {
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t: any) {
          return arcGenerator(interpolate(t));
        };
      });

    // Text labels
    const text = svg.selectAll("text").data(pie(dataToDisplay));

    text
      .enter()
      .append("text")
      .merge(text)
      .attr("transform", (d: any) => `translate(${arcGenerator.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .text((d: any) => d.data.foodName)
      .style("fill", "white");

    text.exit().remove();
  };

  return (
    <div className="flex flex-col justify-center items-center text-center">
      {isVisible && (
        <div>
          <p className="text-3xl font-bold text-green-600">Data at a glace</p>
          <p className="text-sm">
            Click on "Other" to see more. Click on any food to
            go back to the start.
          </p>
        </div>
      )}

      {isVisible && <div ref={pieContainer}></div>}
    </div>
  );
}
