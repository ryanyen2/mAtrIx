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
    data = d3.range(100).map((d) => Math.random());
    d3.select(selector).select("svg").remove();

    svg = d3
      .select(selector)
      .on("touchstart", function (e) {
        // d3.event.preventDefault();
        e.preventDefault();
      })
      .on("touchmove", function (e) {
        e.preventDefault();
      })
      .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("viewBox", "0 0 " + outerWidth + " " + outerHeight);

    defs = svg.append("defs");
    defs
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    // outer rectangle
    svg
      .append("rect")
      .attr("class", "outer")
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    // outer group (padding around the axes)
    g = svg
      .append("g")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

    // inner rectangle
    g.append("rect")
      .attr("class", "inner")
      .attr("width", width)
      .attr("height", height);

    // horizontal axis
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // horizontal axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .attr(
        "transform",
        "translate(" + 0.95 * width + "," + (height + 40) + ")"
      )
      .text("Time");
    // .text(this.meta.xlabel);

    // vertical axis
    g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(0, 0)")
      .call(yAxis);

    // vertical axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("class", "axis-label")
      .attr("transform", "rotate(270) translate(-" + height / 2 + ", -50)")
      .text("Regret");
    // .text(this.meta.ylabel);

    legend = g.append("g").attr("class", "legend").attr("display", "none");
    // legend text
    legend
      .append("text")
      .attr("class", "legend-text")
      .attr("y", -8)
      .attr(
        "transform",
        "translate(" + 0.5 * width + "," + (height + 50) + ")"
      );

    if (data.length > 0) {
      var x = d3.scaleLinear().domain([0, 100]).range([0, width]);

      var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
      var line = d3
        .line()
        .x((d, i) => x(i))
        .y((d) => y(d));

      g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + padding.left + "," + padding.top + ")"
        );

      var gZoom = g.append("g").attr("class", "zoom");
      // zoom Object
      var zoomObj = d3
        .zoom()
        .scaleExtent([1, 10]) // max zoom
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", zoomTransform);

      gZoom.call(zoomObj);

      // var bisect = d3.bisector(function(d) { return d.x; }).left;
      var bisect = d3.bisector((d) => d.x).left;
      var focus = gZoom
        .append("g")
        .append("circle")
        .style("fill", "none")
        .attr("stroke", "black")
        .attr("r", 8.5)
        .style("opacity", 0);

      var focusText = gZoom
        .append("g")
        .append("text")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");

      var gView = gZoom.append("g").attr("class", "view");
      gView
        .append("path")
        .attr("class", "line")
        .attr("d", line(data))
        .attr("stroke", "steelblue")
        .attr("fill", "none")
        .attr("stroke-width", 2);

      gView
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () {
          focus.style("opacity", 1);
          focusText.style("opacity", 1);
        })
        .on("mouseout", function () {
          focus.style("opacity", 0);
          focusText.style("opacity", 0);
        })
        .on("mousemove", mousemove);

      function mousemove() {

        if (data.length <= 1) return;
        
        // export 'mouse' (imported as 'd3') was not found in 'd3'
        // var x0 = x.invert(d3.mouse(this)[0]);
        var x0 = x.invert(d3.pointer(this)[0]);
        var i = bisect(data, x0, 1);
        var d0 = data[i - 1];
        var d1 = data[i];
        console.log("mousemove", i, d0, d1);

        var d = x0 - d0.x > d1.x - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")");
        focusText
          .attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")")
          .text(d.y);

        // console.log(d);
      }

      var zoomTransform = function () {
        var t = d3.transition().duration(0);
        gView.attr("transform", t);
        gView.attr("stroke-width", 1 / t.k);
      };
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
      <div id="eval-graph-wrap">
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
