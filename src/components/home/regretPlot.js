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

export function RegretPlot(props) {
  const [allSettingsParamValue, setAllSettingsParam] =
    useRecoilState(allSettingsParam);
  const banditInfoValue = useRecoilValue(banditInfo);

  const [regretPlotDataValue, setRegretPlotData] =
    useRecoilState(regretPlotData);
  const [allRegretPlotDataValue, setAllRegretPlotData] =
    useRecoilState(allRegretPlotData);
  const armTagsValue = useRecoilValue(armTags);
  const selector = "#eval-graph",
    nBandits = Object.keys(armTagsValue).length;
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
  const [appletRunning, setAppletRunning] = useState(false);
  const [outerSizes, setOuterSizes] = useState({
    outerWidth: 0,
    outerHeight: 0,
  });

  const [xy, setXY] = useState({
    xmin: 0,
    xmax: 0,
    ymin: 0,
    ymax: 0,
  });

  // const [play, setPlay] = useState(true);

  useEffect(() => {}, []);

  // useEffect(() => {
  //   // console.log("regretPlotDataValue", regretPlotDataValue);
  //   setAllRegretPlotData({
  //     times: [
  //       ...allRegretPlotDataValue.times,
  //       regretPlotDataValue.current_time,
  //     ],
  //     regrets: [
  //       ...allRegretPlotDataValue.regrets,
  //       regretPlotDataValue.current_regret,
  //     ],
  //   });
  // }, [regretPlotDataValue]);

  useEffect(() => {
    var data = banditInfoValue.regret_t;
    if (data.length > 0) {
      console.log(data);
      var dw = document.documentElement.clientWidth;
      var aw = Math.floor(
        dw > 1200 ? 800 : dw > 900 ? 0.8 * dw : dw < 600 ? 0.95 * dw : 0.9 * dw
      );
      aw = 450;
      var ah = Math.min(aw, 250);
      var outerWidth = 0.95 * aw;
      var outerHeight = ah;
      setOuterSizes({
        outerWidth: outerWidth,
        outerHeight: outerHeight,
      });

      const leftMar = outerWidth < 800 ? 0 : 20;

      var margin = { top: 10, right: 20, bottom: 20, left: leftMar };
      var padding = { top: 0, right: 0, bottom: 30, left: 60 };
      var innerWidth = outerWidth - margin.left - margin.right;
      var innerHeight = outerHeight - margin.top - margin.bottom;
      var width = innerWidth - padding.left - padding.right;
      var height = innerHeight - padding.top - padding.bottom;

      var data = null;

      var xScale = d3.scaleLinear().range([0, width]);
      var xScaleOrig = d3.scaleLinear().range([0, width]);
      var yScale = d3.scaleLinear().range([height, 0]);
      var yScaleOrig = d3.scaleLinear().range([height, 0]);

      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      // for small graph sizes, use half the number of ticks
      if (width < 400) xAxis.ticks(5);

      var xExt = [xy.xmin, xy.xmax];
      var yExt = [xy.ymin, xy.ymax];

      var xRange = xExt[1] - xExt[0];
      var xDomainMin = xExt[0] - xRange * 0.02;
      var xDomainMax = xExt[1] + xRange * 0.02;

      var yRange = yExt[1] - yExt[0];
      var yDomainMin = yExt[0] - yRange * 0.02;
      var yDomainMax = yExt[1] + yRange * 0.02;

      xScale.domain([xDomainMin, xDomainMax]);
      xScaleOrig.domain([xDomainMin, xDomainMax]);
      yScale.domain([yDomainMin, yDomainMax]);
      yScaleOrig.domain([yDomainMin, yDomainMax]);

      /*
       * ##############################
       * #         Init svg           #
       * ##############################
       */
      d3.select(selector).select("svg").remove();

      // base svg
      let svg = d3
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

      /*
       * ##############################
       * #         Functions          #
       * ##############################
       */

      var zoomTransform = function () {
        // var transform = d3.event.transform;
        var transform = d3.zoomTransform(this);
        xScale.domain(transform.rescaleX(xScaleOrig).domain());
        yScale.domain(transform.rescaleY(yScaleOrig).domain());
        svg.selectAll(".line").attr("d", (d) => line(d.values));
        svg.select(".axis--x").call(xAxis);
        svg.select(".axis--y").call(yAxis);
      };

      var moved = function (e) {
        // preventdefault
        e.preventDefault();

        // var xy = d3.mouse(this);
        var xy = d3.pointer(this);
        const X = data.X;
        const ym = yScale.invert(xy[1]);
        const xm = xScale.invert(xy[0]);
        const i1 = d3.bisectLeft(X, xm, 1);
        const i0 = i1 - 1;
        const i = xm - X[i0] > X[i1] - xm ? i1 : i0;
        const s = data.series.reduce((a, b) =>
          Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b
        );
        path
          .attr("class", (d) => (d === s ? "line line-show" : "line line-hide"))
          .filter((d) => d === s)
          .raise();
        legend.select("text").text(s.name);
      };

      var entered = function () {
        legend.attr("display", null);
      };

      var left = function () {
        path
          .attr("class", "line line-show")
          .style("stroke", (d) => swatch(d.name));
        legend.attr("display", "none");
      };

      /*
       * ##############################
       * #           Objects          #
       * ##############################
       */

      // zoom Object
      var zoomObj = d3
        .zoom()
        .scaleExtent([1, 20]) // max zoom
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", zoomTransform);

      var line = d3
        .line()
        .defined((d) => !isNaN(d))
        .x((d, i) => xScale(data.X[i]))
        .y((d) => yScale(d));

      /*
       * ################################
       * #           Build SVG          #
       * ################################
       */

      // defs for keeping the clip path
      var defs = svg.append("defs");
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
      var g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + padding.left + "," + padding.top + ")"
        );

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
        );
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
        .attr("transform", "rotate(270) translate(-" + height / 2 + ", -50)");
      // .text(this.meta.ylabel);

      // zoom group, with mouse events
      var gZoom = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + padding.left + "," + padding.top + ")"
        )
        .style("pointer-events", "all");
      if ("ontouchstart" in document) {
        gZoom
          .on("touchmove", moved)
          .on("touchstart", entered)
          .on("touchend", left);
      } else {
        gZoom
          .on("mousemove", moved)
          .on("mouseenter", entered)
          .on("mouseleave", left);
      }
      gZoom.call(zoomObj);

      // zoom rectangle (this needs fill not none so we can hit it)
      gZoom
        .append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height);

      // add the group we hang all the lines under
      var gView = gZoom.append("g").attr("class", "view");

      // pick a color swatch
      var swatch = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(data.series.map((d) => d.name));

      var path = gView
        .selectAll("path")
        .data(data.series)
        .join("path")
        .attr("class", "line")
        .style("stroke", (d) => swatch(d.name))
        .attr("d", (d) => line(d.values));

      // legend
      var legend = g
        .append("g")
        .attr("class", "legend")
        .attr("display", "none");

      // legend text
      legend
        .append("text")
        .attr("class", "legend-text")
        .attr("y", -8)
        .attr(
          "transform",
          "translate(" + 0.5 * width + "," + (height + 50) + ")"
        );
    }
  }, banditInfoValue);

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
