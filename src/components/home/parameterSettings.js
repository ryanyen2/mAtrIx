import React from "react";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { MathComponent } from "mathjax-react";
import { useRecoilState } from "recoil";
import { allSettingsParam } from "../../state/atoms";

export default function ParameterSettings(props) {
  const [currentAlgorithm, setCurrentAlgorithm] = useState("thompson-sampling");
  const [allSettingsParamValue, setAllSettingsParam] = useRecoilState(allSettingsParam);

  return (
    <div style={{ color: "black" }}>
      <FormControl fullWidth>
        <div>
          <InputLabel id="algorithm-selection">Algorithm</InputLabel>
          <Select
            labelId="algorithm-selection-label"
            id="algorithm-selection-select"
            value={currentAlgorithm}
            label="Algorithm"
            onChange={(e) => setCurrentAlgorithm(e.target.value)}
          >
            <MenuItem value={"epsilon-greedy"}>Epsilon-greedy</MenuItem>
            <MenuItem value={"upper-confidence-bound"}>
              Upper Confidence Bound
            </MenuItem>
            <MenuItem value={"thompson-sampling"}>Thompson Sampling</MenuItem>
          </Select>
          <TextField
            label="Repetitions"
            id="var-repeat"
            size="small"
            variant="standard"
            value={allSettingsParamValue.regretPlotParam.repeats}
            onChange={(e) => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                regretPlotParam: {
                  ...allSettingsParamValue.regretPlotParam,
                  repeats: e.target.value,
                },
              });
            }}
            sx={{ m: 1, width: "8ch" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">r=</InputAdornment>
              ),
            }}
          />
        </div>
        <div>
          <TextField
            label="ε-Greedy"
            id="var-epsilon"
            size="small"
            style={{ fontSize: "1rem" }}
            sx={{ m: 1, width: "10ch" }}
            value={allSettingsParamValue.regretPlotParam.epsilon}
            onChange={(e) => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                regretPlotParam: {
                  ...allSettingsParamValue.regretPlotParam,
                  epsilon: e.target.value,
                },
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
            value={allSettingsParamValue.regretPlotParam.c}
            onChange={(e) => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                regretPlotParam: {
                  ...allSettingsParamValue.regretPlotParam,
                  c: e.target.value,
                },
              });
            }}
            InputProps={{
              pattern: "(([0-9]+|[0-9]*.[0-9]*),? ?)*",
              startAdornment: (
                <InputAdornment position="start">c=</InputAdornment>
              ),
            }}
          />
          <span style={{ display: "inline-block", width: "1.5rem", color: "grey", fontSize: ".9rem" }}
          >ThompsonSampling</span>
          <TextField
            id="var-m"
            label={<MathComponent tex={String.raw`m_a`} />}
            variant="standard"
            size="small"
            value={allSettingsParamValue.regretPlotParam.m}
            onChange={(e) => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                regretPlotParam: {
                  ...allSettingsParamValue.regretPlotParam,
                  m: e.target.value,
                },
              });
            }}
            sx={{ m: 1, width: "4ch" }}
          />
          <TextField
            id="var-nu"
            label={<MathComponent tex={String.raw`\nu_a`} />}
            variant="standard"
            size="small"
            value={allSettingsParamValue.regretPlotParam.nu}
            onChange={(e) => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                regretPlotParam: {
                  ...allSettingsParamValue.regretPlotParam,
                  nu: e.target.value,
                },
              });
            }}
            sx={{ m: 1, width: "4ch" }}
          />
          <TextField
            id="var-alpha"
            label={<MathComponent tex={String.raw`\alpha_a`} />}
            variant="standard"
            size="small"
            value={allSettingsParamValue.regretPlotParam.alpha}
            onChange={(e) => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                regretPlotParam: {
                  ...allSettingsParamValue.regretPlotParam,
                  alpha: e.target.value,
                },
              });
            }}
            sx={{ m: 1, width: "5ch" }}
          />
          <TextField
            id="var-beta"
            label={<MathComponent tex={String.raw`\beta_a`} />}
            variant="standard"
            size="small"
            value={allSettingsParamValue.regretPlotParam.beta}
            onChange={(e) => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                regretPlotParam: {
                  ...allSettingsParamValue.regretPlotParam,
                  beta: e.target.value,
                },
              });
            }}
            sx={{ m: 1, width: "4ch" }}
          />
        </div>
      </FormControl>
    </div>
  );
}
