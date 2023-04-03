import React, { useState } from "react";
import ThompsonSampling from "./thompson-sampling";


const CodeFlow = (props) => {
  const algorithm = props.algorithm;

  const renderCodeFlow = () => {
    const canvas = document.getElementById("block-code-flow");
    const algoFlowChart = createFlowChart(canvas, algorithm);
    return algoFlowChart;
  };

  const createFlowChart = (canvas, algorithm) => {
    if (algorithm === "thompson-sampling") {
      return <ThompsonSampling />;
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div id="block-code-flow" style={{ width: "100%", height: "100%" }}>
        {renderCodeFlow()}
      </div>
    </div>
  );
};

export default CodeFlow;
