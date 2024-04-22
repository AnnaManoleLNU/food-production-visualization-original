import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

type FoodProps = {
  selectedFood: { name: string | null; quantity: number | null } | null;
  selectedCountry: string | null;
};

type Food = {
  countryName: string;
  foodName: string;
  foodQuantityInTons: number;
};

export default function PiePopup({ selectedFood, selectedCountry }: FoodProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [globalFoodData, setGlobalFoodData] = useState(0);
  const pieContainer2 = useRef(null);

  const handleClose = () => setIsVisible(false);

  useEffect(() => {
    if (d3.select("body").selectAll(".tooltipPiePopup").empty()) {
      d3.select("body")
        .append("div")
        .attr("class", "tooltipPiePopup")
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
      d3.select(".tooltipPiePopup").remove();
    };
  }, []);

  useEffect(() => {
    if (selectedFood?.name && selectedFood?.quantity) {
      setIsVisible(true);
      const fetchData = async () => {
        const response = await fetch("https://cscloud6-228.lnu.se/wt2/elastic/");
        if (!response.ok) {
          console.error("Failed to fetch:", response.statusText);
          return;
        }
        const jsonData = await response.json();
        // total food production of the selected food
        console.log("The selected food", selectedFood);
        const totalFoodProductionArray = jsonData.documents
          .filter((doc: any) => doc._source.foodName === selectedFood?.name)
          .map((doc: any) => doc._source.foodQuantityInTons);

        let totalFoodProduction = 0;
        for (let i = 0; i < totalFoodProductionArray.length; i++) {
          totalFoodProduction += totalFoodProductionArray[i];
        }

        console.log(
          `Total global food production of ${selectedFood?.name} is:`,
          totalFoodProduction
        );

        setGlobalFoodData(totalFoodProduction);
      };
      fetchData();
    } else {
      handleClose();
    }
  }, [selectedFood, selectedCountry]);

  useEffect(() => {
    if (isVisible && globalFoodData > 0) {
      drawPieChart([globalFoodData, selectedFood?.quantity as number]);
    }
  }, [isVisible, globalFoodData]);

  const drawPieChart = (data: number[], initial = false) => {
    const width = 500;
    const height = 500;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(pieContainer2.current)
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie()
      .value((d: any) => d)
      .sort(null);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    const color = d3.scaleOrdinal(["#4575b4", "#313695"]);

    const update = svg.selectAll("path").data(pie(data));

    update
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d: any, i:number) => color(i))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function (event: any, d: any) {
        d3.select(event.currentTarget).style("opacity", 0.7);
        d3.select(".tooltipPiePopup")
          .style("display", "block")
          // quantity of food in relation to global production
          .html(`${d.data} tons`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 15 + "px");
      })
      .on("mouseout", function (event: any) {
        d3.select(event.currentTarget).style("opacity", 1);
        d3.select(".tooltipPiePopup").style("display", "none");
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
    const text = svg.selectAll("text").data(pie(data));

    text
      .enter()
      .append("text")
      .merge(text)
      .attr("transform", (d: any) => `translate(${arcGenerator.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      // percentage of food in relation to global production
      .text((d: any) => {
        // Only display text if the slice represents the selected country and is the smaller slice
        if (d.data === Math.min(...data)) {
          return `${selectedCountry} ${(
            (d.data / (globalFoodData + selectedFood?.quantity!)) *
            100
          ).toFixed(2)}%`;
        }
        else {
          return `Global production ${((d.data / (globalFoodData + selectedFood?.quantity!)) * 100).toFixed(2)}%`;
        }
      })
      .style("fill", "white");

    text.exit().remove();
  };

  return isVisible ? (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-12 relative flex justify-center items-center flex-col">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-blue-900 text-xl"
        >
          ✖
        </button>
        <p className="text-xl font-light text-green-600">
          Percentage of {selectedFood?.name}, {selectedCountry} in relation to
          global production
        </p>
        <div ref={pieContainer2}></div>
      </div>
    </div>
  ) : null;
}
