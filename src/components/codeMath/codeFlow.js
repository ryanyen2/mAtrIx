import React, { useEffect, useState } from "react";
import ThompsonSampling from "./thompson-sampling";
import EpsilonGreedy from "./epsilon-greedy";
import UCB from "./ucb";


const CodeFlow = (props) => {
  const algorithm = props.algorithm;
  const banditInfoValue = props.banditInfoValue;

  const renderCodeFlow = () => {
    const canvas = document.getElementById("block-code-flow");
    const algoFlowChart = createFlowChart(canvas, algorithm);
    return algoFlowChart;
  };

  const createFlowChart = (canvas, algorithm) => {
    console.log("algorithm (codeflow)>> ", algorithm);
    if (algorithm === "thompson") {
      return <ThompsonSampling banditInfoValue={banditInfoValue} />;
    } else if (algorithm === "ucb") {
      return <UCB banditInfoValue={banditInfoValue} />;
    } else if (algorithm === "egreedy") {
      return <EpsilonGreedy banditInfoValue={banditInfoValue} />;
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
