import React, { useEffect } from "react";
import * as d3 from "d3";
import { useRecoilState } from "recoil";
import { barChartData } from "../../state/atoms";


export function BarChart (props) {
  const [data, setData] = useRecoilState(barChartData);
  const editBarChartData = (event) => {
    setData(event.target.value.split(","))
  }

  useEffect(() => {
    drawChart();
    console.log(data);
  }, [data]);

  const drawChart = () => {

    // clear the previous chart
    d3.select("#barchart").selectAll("svg").remove();

    const svg = d3
      .select("#barchart")
      .append("svg")
      .attr("width", props.width)
      .attr("height", props.height);

    const h = props.height;
    
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i *20)
      .attr("y", (d, i) => h - 10 * d)
      .attr("width", 15)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green");

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (d, i) => i * 20)
      .attr("y", (d, i) => h - (10 * d) - 3);
  }


  return (
    <div id='barchart'>
      <input type="text" value={data} onChange={editBarChartData} />
    </div>
  )
}

export default BarChart;
