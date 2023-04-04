import React, { cloneElement } from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import jStat from "jstat";
// import cloneDeep from "lodash";
import { useRecoilState } from "recoil";
import { allRegretPlotData, allSettingsParam } from "../../state/atoms";

export default function AlgGraph(props) {
  const [allSettingsParamValue, setAllSettingsParam] =
    useRecoilState(allSettingsParam);
  const [trueRewards, setTrueRewards] = useState([0.4, 0.5, 0.6, 0.7]);
  const numArms = 4;
  const w = 400,
    h = 100;
  const mounted = useRef(0);
  // const [lastSelectedBanditIndex, setLastSelectedBanditIndex] = useState(-1);
  const [theBandits, setTheBandits] = useState([
    {
      // currentDistributionParameters: {
      alpha: 1,
      beta: 1,
      // },
      currentActualProbability: allSettingsParamValue.targetProbability.cat,
      // stats: {
      numberSuccesses: 0,
      numberPulls: 1,
      probabilityHistory: [],
      // },
    },
    {
      // currentDistributionParameters: {
      alpha: 1,
      beta: 1,
      // },
      currentActualProbability: allSettingsParamValue.targetProbability.dog,
      // stats: {
      numberSuccesses: 0,
      numberPulls: 1,
      probabilityHistory: [],
      // },
    },
    {
      // currentDistributionParameters: {
      alpha: 1,
      beta: 1,
      // },
      currentActualProbability: allSettingsParamValue.targetProbability.panda,
      // stats: {
      numberSuccesses: 0,
      numberPulls: 1,
      probabilityHistory: [],
      // },
    },
    {
      // currentDistributionParameters: {
      alpha: 1,
      beta: 1,
      // },
      currentActualProbability: allSettingsParamValue.targetProbability.alpaca,
      // stats: {
      numberSuccesses: 0,
      numberPulls: 1,
      probabilityHistory: [],
      // },
    },
    -1,
  ]);

  const [xArray, setXArray] = useState([]);
  var _N = 100;
  var margin = 15;

  // var unselectIt = function () {
  //     d3.selectAll(".actualProbabilityLine").classed("lineActive", false);
  //     that.currentLineSelected = null;
  // };

  // REF: https://stackoverflow.com/questions/32855077/react-get-bound-parent-dom-element-name-within-component
  // const parentNodeID = ReactDOM.findDOMNode(this).parentNode.getAttribute("id");
  // console.log(parentNodeID);

  // https://stackoverflow.com/questions/53945763/componentdidmount-equivalent-on-a-react-function-hooks-component
  // run only at the start after mounting
  useEffect(() => {
    // if (
    //   !allSettingsParamValue.play ||
    //   allSettingsParamValue.currentMode !== "automatic"
    // )
    //   return;
    xArray.push(0.0001);
    for (var i = 1; i < _N - 1; i++) {
      xArray.push(0.01 * i);
    }
    xArray.push(1 - 0.0001);
    setXArray(xArray);
    theBandits.forEach(function (b, index) {
      if (index >= numArms) return;
      var theId = "graph_" + index;

      d3.selectAll("#graph_" + index).remove();
      var vis = d3
        .select("#alggraphparent")
        .append("svg")
        .attr("id", theId)
        .attr("width", w)
        .attr("height", h);

      var g = vis.append("svg:g").attr("id", "theGraph_" + index);
    });

    draw();

    var i = setInterval(() => {
      if (
        !allSettingsParamValue.play ||
        allSettingsParamValue.currentMode !== "automatic"
      )
        return;
      runBandits();
    }, 1000);

    return () => clearInterval(i);
  }, [allSettingsParamValue.play]);

  useEffect(() => {
    setTheBandits([
      {
        ...theBandits[0],
        currentActualProbability: allSettingsParamValue.targetProbability.cat,
      },
      {
        ...theBandits[1],
        currentActualProbability: allSettingsParamValue.targetProbability.dog,
      },
      {
        ...theBandits[2],
        currentActualProbability: allSettingsParamValue.targetProbability.panda,
      },
      {
        ...theBandits[3],
        currentActualProbability:
          allSettingsParamValue.targetProbability.alpaca,
      },
      -1,
    ]);
  }, [allSettingsParamValue.targetProbability]);

  useEffect(() => {
    theBandits.forEach(function (b, index) {
      if (index >= numArms) return;
      var theId = "graph_" + index;

      d3.selectAll("#graph_" + index).remove();
      var vis = d3
        .select("#alggraphparent")
        .append("svg")
        .attr("id", theId)
        .attr("width", w)
        .attr("height", h);

      var g = vis.append("svg:g").attr("id", "theGraph_" + index);
    });

    draw();

    update();
  }, [theBandits]);

  //   useEffect(() => {
  //     // allSettingsParam
  //     console.log("In useEffect for allSettingsParam", allSettingsParamValue.targetProbability);
  //     }, [allSettingsParamValue.targetProbability]);

  function runBandits() {
    // // console.log("Running bandits");
    var selectedBandit = Math.floor(Math.random() * numArms);
    const newBanidtsList = theBandits.map((b, i) => {
      if (i === selectedBandit) {
        if (Math.random() < b.currentActualProbability) {
          b.alpha++;
        } else {
          b.beta++;
        }
      } else if (i === numArms) {
        b = selectedBandit;
      }
      return b;
    });
    setTheBandits(newBanidtsList);
  }

  function update() {
    // console.log("In update");
    if (theBandits[numArms] < 0) return;
    // console.log("Update called for index " + theBandits[numArms]);
    var b = theBandits[theBandits[numArms]];
    var index = theBandits[numArms];
    var alpha = b.alpha;
    var beta = b.beta;

    var g = d3.select("#theGraph_" + index);

    var theMax = -1;
    var _data = xArray.map(function (x) {
      var y = jStat.beta.pdf(x, alpha, beta);
      theMax = Math.max(y, theMax);
      return y;
    });
    var y = d3
        .scaleLinear()
        .domain([0, theMax])
        .range([h - margin, 0 + margin]),
      x = d3
        .scaleLinear()
        .domain([0, _N])
        .range([0 + margin, w - margin]);

    var d = [];
    var xt10 = x.ticks(_N);
    for (var i = 0; i < _N; i++) {
      d.push([x(xt10[i]), y(_data[i])]);
    }
    // console.log(alpha, beta, xArray, _data, d);
    var line = d3.line();

    d3.selectAll("#line_" + index).remove();
    g.append("path")
      .attr("d", line(d))
      .attr("stroke", "#0d6efd")
      .attr("id", "line_" + index)
      .attr("fill", "none")
      .attr("stroke-width", "2px");
  }

  function draw() {
    theBandits.forEach(function (b, index) {
      if (index == numArms) return;
      var theId = "graph_" + index;

      var g = d3.select("#theGraph_" + index);

      var alpha = b.alpha;
      var beta = b.beta;

      var theMax = -1;

      var _data = xArray.map(function (x) {
        var y = jStat.beta.pdf(x, alpha, beta);
        theMax = Math.max(y, theMax);
        return y;
      });

      var y = d3
          .scaleLinear()
          .domain([0, theMax])
          .range([h - margin, 0 + margin]),
        x = d3
          .scaleLinear()
          .domain([0, _N])
          .range([0 + margin, w - margin]);

      var d = [];
      var xt10 = x.ticks(_N);
      for (var i = 0; i < _N; i++) {
        d.push([x(xt10[i]), y(_data[i])]);
      }
      var line = d3.line();

      g.append("path")
        .attr("d", line(d))
        .attr("stroke", "#0d6efd")
        .attr("id", "line_" + index)
        .attr("fill", "none")
        .attr("stroke-width", "2px");

      g.append("svg:line")
        .attr("x1", x(0))
        .attr("y1", y(0))
        // .attr("x2", x(w))
        .attr("x2", x(_N))
        .attr("y2", y(0))
        .attr("stroke", "#000000")
        .attr("id", "xAxis_" + index);

      g.append("svg:line")
        .attr("x1", x(0))
        .attr("y1", y(0))
        .attr("x2", x(0))
        // .attr("y2", y(max_data))
        .attr("y2", y(theMax))
        .attr("stroke", "#000000")
        .attr("id", "yAxis_" + index);

      g.selectAll(".xLabel")
        // fix floating point precision issues
        .data(d3.range(0, 1.2, 0.1).map((e) => e.toFixed(1)))
        .enter()
        .append("svg:text")
        .attr("class", "xLabel")
        .text(String)
        .attr("x", function (d) {
          return x(100 * d);
        })
        .attr("y", h)
        .attr("text-anchor", "middle")
        .attr("dy", 0.0);

      g.selectAll(".xTicks")
        .data(x.ticks(10))
        .enter()
        .append("svg:line")
        .attr("class", "xTicks")
        .attr("x1", function (d) {
          return x(d);
        })
        .attr("y1", y(0))
        .attr("x2", function (d) {
          return x(d);
        })
        .attr("y2", y(-0.3));

      var vis = d3.select("#" + theId);

      vis
        .append("text")
        .attr("x", w - 5 * margin)
        .attr("y", 13)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Posterior Distributions");

      g.append("svg:line")
        .attr("id", "actualProb_" + index)
        .attr("x1", margin + (w - 2 * margin) * b.currentActualProbability)
        .attr("y1", y(0))
        .attr("x2", margin + (w - 2 * margin) * b.currentActualProbability)
        // .attr("y2", y(max_data))
        .attr("y2", y(theMax))
        .attr("stroke", "#000000")
        .attr("stroke-width", "2px")
        .attr("banditIndex", index)
        .attr("class", "actualProbabilityLine");
    });
  }

  return <div></div>;
}
