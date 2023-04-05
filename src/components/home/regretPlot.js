import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3";
import { Container } from "@material-ui/core";
import { EvaluationApplet } from "../../utils/bandits";
// import Box from "@mui/material/Box";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  allSettingsParam,
  regretPlotData,
  allRegretPlotData,
  banditInfo,
  armTags,
} from "../../state/atoms";

import * as d3 from "d3";

// import ToggleButton from "@mui/material/ToggleButton";
// import IconButton from "@mui/material/IconButton";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";

// d3.select(selector).select("svg").remove();

export function RegretPlot(props) {
  const [allSettingsParamValue, setAllSettingsParam] =
    useRecoilState(allSettingsParam);
  const banditInfoValue = useRecoilValue(banditInfo);

  const [regretPlotDataValue, setRegretPlotData] =
    useRecoilState(regretPlotData);
  const [allRegretPlotDataValue, setAllRegretPlotData] =
    useRecoilState(allRegretPlotData);
  const armTagsValue = useRecoilValue(armTags);
  // const nBandits = Object.keys(armTagsValue).length;
  const [inputParams, setInputParams] = useState({
    epsilons: [allSettingsParamValue.regretPlotParam.epsilon],
    cs: [allSettingsParamValue.regretPlotParam.c],
    ms: [allSettingsParamValue.regretPlotParam.m],
    nus: [allSettingsParamValue.regretPlotParam.nu],
    alphas: [allSettingsParamValue.regretPlotParam.alpha],
    betas: [allSettingsParamValue.regretPlotParam.beta],
    repeats: allSettingsParamValue.regretPlotParam.repeats,
  });
  // can set below var to listen to play in allSettingsParamValue
  // const [appletRunning, setAppletRunning] = useState(false);
  // const [outerSizes, setOuterSizes] = useState({
  //   outerWidth: 0,
  //   outerHeight: 0,
  // });

  // const [xy, setXY] = useState({
  //   xmin: 0,
  //   xmax: 0,
  //   ymin: 0,
  //   ymax: 0,
  // });

  // const [play, setPlay] = useState(true);

  var dw = document.documentElement.clientWidth;
  var aw = Math.floor(
    dw > 1200 ? 800 : dw > 900 ? 0.8 * dw : dw < 600 ? 0.95 * dw : 0.9 * dw
  );
  aw = 450;
  var ah = Math.min(aw, 250);
  var outerWidth = 0.95 * aw;
  var outerHeight = ah;
  const leftMar = outerWidth < 800 ? 0 : 20;

  var margin = { top: 10, right: 20, bottom: 20, left: leftMar };
  var padding = { top: 0, right: 0, bottom: 30, left: 60 };
  var innerWidth = outerWidth - margin.left - margin.right;
  var innerHeight = outerHeight - margin.top - margin.bottom;
  var width = innerWidth - padding.left - padding.right;
  var height = innerHeight - padding.top - padding.bottom;

  var xScale = d3.scaleLinear().range([0, width]);
  var xScaleOrig = d3.scaleLinear().range([0, width]);
  var yScale = d3.scaleLinear().range([height, 0]);
  var yScaleOrig = d3.scaleLinear().range([height, 0]);

  xScale.domain([xDomainMin, xDomainMax]);
  xScaleOrig.domain([xDomainMin, xDomainMax]);
  yScale.domain([yDomainMin, yDomainMax]);
  yScaleOrig.domain([yDomainMin, yDomainMax]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // for small graph sizes, use half the number of ticks
  if (width < 400) xAxis.ticks(5);

  var xy = { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };

  var xExt = [xy.xmin, xy.xmax];
  var yExt = [xy.ymin, xy.ymax];

  var xRange = xExt[1] - xExt[0];
  var xDomainMin = xExt[0] - xRange * 0.02;
  var xDomainMax = xExt[1] + xRange * 0.02;

  var yRange = yExt[1] - yExt[0];
  var yDomainMin = yExt[0] - yRange * 0.02;
  var yDomainMax = yExt[1] + yRange * 0.02;

  const selector = "#eval-graph";
  var svg = d3.select(selector);
  var g = null;
  var defs = null;
  var legend = null;

  useEffect(() => {
    // console.log("banditInfoValue.regret_t", banditInfoValue.regret_t);
    var data = banditInfoValue.regret_t;
    // data = random generate 100 data points from 0 to 1
    // data = d3.range(100).map((d) => Math.random());
    d3.select(selector).select("svg").remove();

    svg = d3
      .select(selector)
      .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + 50 + "," + margin.top + ")"
      )
      .attr("viewBox", "0 0 " + outerWidth + " " + outerHeight);

    // x axis name and label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 30)
      .style("text-anchor", "middle")
      .text("Time");

    // y axis name and label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Regret");

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width + margin.left]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([height + margin.top, margin.top]);

    const line = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d));

    svg
      .append("g")
      .attr("transform", `translate(0, ${height + margin.top})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // const tweenDash = () => {
    //   const l = this.getTotalLength();
    //   const i = d3.interpolateString("0," + l, l + "," + l);
    //   return (t) => i(t);
    // };

    var path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    var totalLength = path.node().getTotalLength();
    // start from the last point
    var lastPoint = data[data.length - 1];
    var lastPointX = x(data.length - 1);
    var lastPointY = y(lastPoint);

    // add a circle at the last point
    svg
      .append("circle")
      .attr("cx", lastPointX)
      .attr("cy", lastPointY)
      .attr("r", 5)
      .attr("fill", "steelblue");

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(200)
      .ease(d3.easeCircleOut)
      .attr("stroke-dashoffset", 0);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => x(i))
      .attr("cy", (d) => y(d))
      .attr("r", 2)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.95);
        tooltip
          .html(`Time: ${data.indexOf(d)}, Regret: ${d}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    if (data.length > 0) {
    }
  }, [banditInfoValue]);

  useEffect(() => {
    setInputParams({
      epsilons: [allSettingsParamValue.regretPlotParam.epsilon],
      cs: [allSettingsParamValue.regretPlotParam.c],
      ms: [allSettingsParamValue.regretPlotParam.m],
      nus: [allSettingsParamValue.regretPlotParam.nu],
      alphas: [allSettingsParamValue.regretPlotParam.alpha],
      betas: [allSettingsParamValue.regretPlotParam.beta],
      repeats: allSettingsParamValue.regretPlotParam.repeats,
    });
  }, [allSettingsParamValue]);

  return (
    <Container id="regretplot">
      {/* <IconButton
        id="eval-btn-reset"
        className="btn-reset"
        aria-label="Reset"
        onClick={() =>
          setAllSettingsParam({
            ...allSettingsParamValue,
            play: false,
            reset: true,
          })
        }
      >
        <RefreshIcon />
      </IconButton> */}
      {/* <div id="eval-control" style={{ opacity: 1}}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
          autoComplete="off"
          style={{ fontSize: "1rem" }}
        >
          <div>
            <ToggleButton
              id="eval-btn-toggle"
              aria-label="Play"
              value="check"
              size="small"
              onClick={() => setAllSettingsParam({ ...allSettingsParamValue, play: !allSettingsParamValue.play })}
            >
              {allSettingsParamValue.play ? <PauseIcon /> : <PlayArrowIcon />}
            </ToggleButton>
            <IconButton
              id="eval-btn-reset"
              className="btn-reset"
              aria-label="Reset"
              onClick={() => setAllSettingsParam({ ...allSettingsParamValue, play: false, reset: true })}
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </Box>
      </div> */}
      <div id="eval-graph-wrap" style={{ marginTop: "1.2rem" }}>
        <div id="eval-graph" className="graph" />
        {/* <LineGraphComponent selector={selector}/> */}
        {/* to the right most within the wrap */}
        <span style={{ display: "flex", justifyContent: "flex-end" }}>
          {regretPlotDataValue.current_time}
        </span>
      </div>
    </Container>
  );
}
