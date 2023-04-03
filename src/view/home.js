// react template for d3
import React, { useEffect, useState } from "react";
// import * as d3 from "d3";
// import BarChart from "../components/home/barChart";
import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { useRecoilState } from "recoil";

import { barChartData } from "../state/atoms";
// import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// social media app component
// import SocialMediaApp from "../components/socialMediaApp/SocialMediaApp.jsx";
import { SocialMediaApp } from "../components/socialMediaApp/socialMediaApp";

import { RegretPlot } from "../components/home/regretPlot";
import AlgGraph from "../components/home/AlgGraph";
// import {timeRegretSelector} from '../state/selector';

// import { RadarChart } from "../components/home/radarChart";
// import ParameterSettings from "../components/home/parameterSettings";

import MathBlock from "../components/codeMath/mathBlock";
// import CodeBlock from "../components/codeMath/codeBlock";
import CodeFlow from "../components/codeMath/codeFlow";
import TimeController from "../components/timeController/timeController";

import {GenerateNewBandit} from '../utils/bandits';

function Home(props) {
  const [barChartDataValue, setBarChartData] = useRecoilState(barChartData);
  const [step, setStep] = useState(0);

  const currentAlgorithm = "thompson-sampling"; // change this to recoil state

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // EG FN FORWARD
  useEffect(() => {
    const newBandit = new GenerateNewBandit();
    newBandit.startGenerate(2, 3,);
    newBandit.record(1, () => {
      newBandit.getArm( (retval) => {
        console.log("got arm", retval);
      });
    });
  }, []);

  return (
    <Container id="home" style={{ marginTop: "2rem" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Item>
            <TimeController />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <SocialMediaApp />
        </Grid>
        <Grid item xs={5}>
          <Grid item xs={12}>
            <div id="alggraphparent">
              <AlgGraph width={500} height={500} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <RegretPlot width={500} height={150} />
            </Item>
          </Grid>
          <Grid container>
            <Grid item xs={0}>
              {/* <Item>
                <CodeBlock algorithm={currentAlgorithm} />
              </Item> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid item xs={12}>
            <CodeFlow algorithm={currentAlgorithm} />
          </Grid>
          <Grid item xs={12}>
            <Item>
              <MathBlock algorithm={currentAlgorithm} />
            </Item>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
