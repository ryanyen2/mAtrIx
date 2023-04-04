import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import * as d3 from "d3";
import jStat from "jstat";

import {
  armTags,
  banditInfo,
  allSettingsParam,
  triggerBanditRecord,
} from "../../state/atoms";

export default function AlgGraph(props) {
  const banditInfoValue = useRecoilValue(banditInfo);
  const allSettingsParamValue = useRecoilValue(allSettingsParam);
  const armTagsVal = useRecoilValue(armTags);
  const triggerBanditRecordVal = useRecoilValue(triggerBanditRecord);
  const [localBanditInfo, setLocalBanditInfo] = useState({
    ...banditInfoValue
  });
  const [localAllParam, setLocalAllParam] = useState({
    ...allSettingsParamValue
  });
  const [arms, setArms] = useState({
    old: -1,
    cur: -1,
  });
  //   const [trueRewards, setTrueRewards] = useState([0.4, 0.5, 0.6, 0.7]);
  const armTagsValue = useRecoilValue(armTags);
  const numArms = Object.keys(armTagsValue).length;
  const w = 400,
    h = 100;
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

    for (let index = 0; index < numArms; index++) {
      var theId = "graph_" + index;

      d3.selectAll("#graph_" + index).remove();
      var vis = d3
        .select("#alggraphparent")
        .append("svg")
        .attr("id", theId)
        .attr("width", w)
        .attr("height", h);

      var g = vis.append("svg:g").attr("id", "theGraph_" + index);
    }

    // setArms({
    //   ...arms,
    //   cur: banditInfoValue.cur_arm
    // })
    // console.log(banditInfoValue.cur_arm);

    draw();
  }, []);

  useEffect(() => {
    // console.log(localBanditInfo);
    // console.log(triggerBanditRecordVal);
    
    if (Object.keys(localBanditInfo.parameters).length !== 0 && triggerBanditRecordVal.trigger) {
    //   var index = localBanditInfo.cur_arm;
      var index = arms.old;
      // console.log("Updating post dist of arm: " + index);
      // console.log(localBanditInfo.parameters);
      var mu = localBanditInfo.parameters[index].mu;
      var sig = Math.sqrt(localBanditInfo.parameters[index].sig2);

      var g = d3.select("#theGraph_" + index);

      var theMax = -1;
      var _data = xArray.map(function (x) {
        var y = jStat.normal.pdf(x, mu, sig);
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

      d3.selectAll("#actualProb_" + index).remove();
      let tagKey = Object.keys(armTagsVal).find(
        (k) => armTagsVal[k] === index
      );
      // console.log(localAllParam.targetProbability);
      var curActualProb = localAllParam.targetProbability[tagKey];

      g.append("svg:line")
        .attr("id", "actualProb_" + index)
        .attr("x1", margin + (w - 2 * margin) * curActualProb)
        .attr("y1", y(0))
        .attr("x2", margin + (w - 2 * margin) * curActualProb)
        // .attr("y2", y(max_data))
        .attr("y2", y(theMax))
        .attr("stroke", "#000000")
        .attr("stroke-width", "2px")
        .attr("banditIndex", index)
        .attr("class", "actualProbabilityLine");
    }
  }, [triggerBanditRecordVal, arms, localBanditInfo, localAllParam]);
  
  useEffect(() => {
    // setLocalBanditInfo({
    //     ...banditInfoValue
    // });
    setLocalBanditInfo(banditInfoValue);
    // setLocalAllParam({
    //     ...allSettingsParamValue
    // });
    setLocalAllParam(allSettingsParamValue);
    setArms({
        old: arms.cur,
        cur: banditInfoValue.cur_arm
    })
    // console.log(banditInfoValue.cur_arm);
  }, [banditInfoValue, allSettingsParamValue]);

  function draw() {
    for (let index = 0; index < numArms; index++) {
      var theId = "graph_" + index;

      var g = d3.select("#theGraph_" + index);

      var theMax = -1;

      var _data = xArray.map(function (x) {
        var y = jStat.normal.pdf(x, 0, 1);
        theMax = Math.max(y, theMax);
        return y;
      });
      //   console.log(_data);

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

      let tagKey = Object.keys(armTagsVal).find((k) => armTagsVal[k] === index);

      vis
        .append("text")
        .attr("x", w - 7 * margin)
        .attr("y", 13)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Posterior Distributions: " + tagKey);

      var curActualProb = allSettingsParamValue.targetProbability[tagKey];

      g.append("svg:line")
        .attr("id", "actualProb_" + index)
        .attr("x1", margin + (w - 2 * margin) * curActualProb)
        .attr("y1", y(0))
        .attr("x2", margin + (w - 2 * margin) * curActualProb)
        // .attr("y2", y(max_data))
        .attr("y2", y(theMax))
        .attr("stroke", "#000000")
        .attr("stroke-width", "2px")
        .attr("banditIndex", index)
        .attr("class", "actualProbabilityLine");
    }
  }

  return <div></div>;
}
