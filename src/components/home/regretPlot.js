import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { Container } from "@material-ui/core";
import { EvaluationApplet } from "../../utils/bandits";
import Button from "@mui/material/Button";

import { MathComponent } from "mathjax-react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

import { useRecoilState } from "recoil";
import { regretPlotParam, regretPlotData, allRegretPlotData } from "../../state/atoms";

import ToggleButton from "@mui/material/ToggleButton";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

export function RegretPlot(props) {
  const [regretPlotParamValue, setRegretPlotParam] =
    useRecoilState(regretPlotParam);
  const [regretPlotDataValue, setRegretPlotData] =
    useRecoilState(regretPlotData);

  const [allRegretPlotDataValue, setAllRegretPlotData] =
    useRecoilState(allRegretPlotData);

  

  const [play, setPlay] = useState(true);
  // const [time, setTime] = useState(0);
  // const [regret, setRegret] = useState({});

  useEffect(() => {
    const evalApp = new EvaluationApplet(
      "#eval-graph",
      {
        epsilon: "var-epsilon",
        c: "var-c",
        m: "var-m",
        nu: "var-nu",
        alpha: "var-alpha",
        beta: "var-beta",
        repeats: "var-repeat",
        toggle: "eval-btn-toggle",
        reset: "eval-btn-reset",
      },
      setRegretPlotData
    );

    var dw = document.documentElement.clientWidth;
    var aw = Math.floor(
      dw > 1200 ? 800 : dw > 900 ? 0.8 * dw : dw < 600 ? 0.95 * dw : 0.9 * dw
    );
    var ah = Math.min(aw, 350);
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
  }, [regretPlotParamValue]);

  useEffect(() => {
    console.log("regretPlotDataValue", regretPlotDataValue);
    setAllRegretPlotData({
      times: [...allRegretPlotDataValue.times, regretPlotDataValue.current_time],
      regrets: [
        ...allRegretPlotDataValue.regrets,
        regretPlotDataValue.current_regret,
      ],
    })
  }, [regretPlotDataValue]);

  return (
    <Container id="regretplot">
      <p>t: {regretPlotDataValue.current_time}</p>
      {/* {Object.keys(regret).map((key) => {
        return (
          <p key={key}>
            {key}: {regret[key]}
          </p>
        );
      })} */}
      <div id="eval-control">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
          autoComplete="off"
        >
          <div>
            <TextField
              label="ε-Greedy"
              id="var-epsilon"
              size="small"
              style={{ fontSize: "1rem" }}
              sx={{ m: 1, width: "10ch" }}
              value={regretPlotParamValue.epsilon}
              onChange={(e) => {
                setRegretPlotParam({
                  ...regretPlotParamValue,
                  epsilon: e.target.value,
                });
              }}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MathComponent tex={String.raw`\varepsilon`} />=
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="UCB"
              id="var-c"
              size="small"
              variant="standard"
              sx={{ m: 1, width: "8ch" }}
              value={regretPlotParamValue.c}
              onChange={(e) => {
                setRegretPlotParam({
                  ...regretPlotParamValue,
                  c: e.target.value,
                });
              }}
              InputProps={{
                pattern: "(([0-9]+|[0-9]*.[0-9]*),? ?)*",
                startAdornment: (
                  <InputAdornment position="start">c=</InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <Typography id="non-linear-slider" gutterBottom>
              ThompsonSampling
            </Typography>
            <TextField
              id="var-m"
              label={<MathComponent tex={String.raw`m_a`} />}
              variant="standard"
              size="small"
              value={regretPlotParamValue.m}
              onChange={(e) => {
                setRegretPlotParam({
                  ...regretPlotParamValue,
                  m: e.target.value,
                });
              }}
              sx={{ m: 1, width: "4ch" }}
            />
            <TextField
              id="var-nu"
              label={<MathComponent tex={String.raw`\nu_a`} />}
              variant="standard"
              size="small"
              value={regretPlotParamValue.nu}
              onChange={(e) => {
                setRegretPlotParam({
                  ...regretPlotParamValue,
                  nu: e.target.value,
                });
              }}
              sx={{ m: 1, width: "4ch" }}
            />
            <TextField
              id="var-alpha"
              label={<MathComponent tex={String.raw`\alpha_a`} />}
              variant="standard"
              size="small"
              value={regretPlotParamValue.alpha}
              onChange={(e) => {
                setRegretPlotParam({
                  ...regretPlotParamValue,
                  alpha: e.target.value,
                });
              }}
              sx={{ m: 1, width: "5ch" }}
            />
            <TextField
              id="var-beta"
              label={<MathComponent tex={String.raw`\beta_a`} />}
              variant="standard"
              size="small"
              value={regretPlotParamValue.beta}
              onChange={(e) => {
                setRegretPlotParam({
                  ...regretPlotParamValue,
                  beta: e.target.value,
                });
              }}
              sx={{ m: 1, width: "4ch" }}
            />
          </div>
          <div>
            <TextField
              label="Repetitions"
              id="var-repeat"
              size="small"
              variant="standard"
              value={regretPlotParamValue.repeats}
              onChange={(e) => {
                setRegretPlotParam({
                  ...regretPlotParamValue,
                  repeats: e.target.value,
                });
              }}
              sx={{ m: 1, width: "8ch" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">r=</InputAdornment>
                ),
              }}
            />
            <ToggleButton
              id="eval-btn-toggle"
              aria-label="Play"
              value="check"
              onClick={() => setPlay(!play)}
            >
              {play ? <PlayArrowIcon /> : <PauseIcon />}
            </ToggleButton>
            <IconButton
              id="eval-btn-reset"
              className="btn-reset"
              aria-label="Reset"
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </Box>
      </div>
      <div id="eval-graph-wrap">
        <div id="eval-graph" className="graph" />
      </div>
    </Container>
  );
}
