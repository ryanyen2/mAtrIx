import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3";
import { Container } from "@material-ui/core";
import { EvaluationApplet } from "../../utils/bandits";
// import Box from "@mui/material/Box";

import { useRecoilState } from "recoil";
import {
  allSettingsParam,
  regretPlotData,
  allRegretPlotData,
} from "../../state/atoms";

// import ToggleButton from "@mui/material/ToggleButton";
// import IconButton from "@mui/material/IconButton";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";

export function RegretPlot(props) {
  const [allSettingsParamValue, setAllSettingsParam] =
    useRecoilState(allSettingsParam);

  const [regretPlotDataValue, setRegretPlotData] =
    useRecoilState(regretPlotData);
  const [allRegretPlotDataValue, setAllRegretPlotData] =
    useRecoilState(allRegretPlotData);

  // const [play, setPlay] = useState(true);

  useEffect(() => {
    const evalApp = new EvaluationApplet(
      "#eval-graph",
      {
        epsilons: [allSettingsParamValue.regretPlotParam.epsilon],
        cs: [allSettingsParamValue.regretPlotParam.c],
        ms: [allSettingsParamValue.regretPlotParam.m],
        nus: [allSettingsParamValue.regretPlotParam.nu],
        alphas: allSettingsParamValue.regretPlotParam.alpha,
        betas: [allSettingsParamValue.regretPlotParam.beta],
        repeats: allSettingsParamValue.regretPlotParam.repeats,
      },
      // {
      //   epsilon: "var-epsilon",
      //   c: "var-c",
      //   m: "var-m",
      //   nu: "var-nu",
      //   alpha: "var-alpha",
      //   beta: "var-beta",
      //   repeats: "var-repeat",
      //   toggle: "eval-btn-toggle",
      //   reset: "eval-btn-reset",
      // },
      setRegretPlotData
    );

    var dw = document.documentElement.clientWidth;
    var aw = Math.floor(
      dw > 1200 ? 800 : dw > 900 ? 0.8 * dw : dw < 600 ? 0.95 * dw : 0.9 * dw
    );
    aw = 450;
    var ah = Math.min(aw, 250);
    evalApp.init(0.95 * aw, ah);

    // window.onstorage = () => {
    // setTime(window.localStorage.getItem("t"));
    // setRegret(JSON.parse(window.localStorage.getItem("regret")));
    // };

    // press the reset button
    document.getElementById("eval-btn-reset").click();
    return () => {
      // window.onstorage = null;
      // window.localStorage.clear();
    };
  }, []);

  useEffect(() => {
    // console.log("regretPlotDataValue", regretPlotDataValue);
    setAllRegretPlotData({
      times: [
        ...allRegretPlotDataValue.times,
        regretPlotDataValue.current_time,
      ],
      regrets: [
        ...allRegretPlotDataValue.regrets,
        regretPlotDataValue.current_regret,
      ],
    });
  }, [regretPlotDataValue]);

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
        {/* to the right most within the wrap */}
        <span style={{ display: "flex", justifyContent: "flex-end" }}>
          {regretPlotDataValue.current_time}
        </span>
      </div>
    </Container>
  );
}
