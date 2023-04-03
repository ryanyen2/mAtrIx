// react template for d3
import React, { useEffect, useState } from "react";
// import * as d3 from "d3";
// import BarChart from "../components/home/barChart";
import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { useRecoilState, useRecoilValue } from "recoil";

import { armTags, banditInfo, modelTypeID } from "../state/atoms";
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

import { GenerateNewBandit } from "../utils/bandits";

function Home(props) {
  const [banditInfoValue, setBanditInfoValue] = useRecoilState(banditInfo);
  // const [step, setStep] = useState(0);
  const armTagsValue = useRecoilValue(armTags);
  const modelTypeIDValue = useRecoilValue(modelTypeID);

  const currentAlgorithm = "thompson-sampling"; // change this to recoil state

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // EG FN FORWARD
  useEffect(async () => {
    const newBandit = new GenerateNewBandit();
    // setBanditInfoValue((old) => {
    //   let o = {...old};
    //   let n = newBandit.startGenerate(modelTypeIDValue.thompson, Object.keys(armTagsValue).length)
    //   o.model = n.model;
    //   o.model_name = n.model_name;
    //   o.model_id = n.model_id;
    //   o.n_arms = n.n_arms;
    //   o.parameters = n.parameters;
    //   o.steps = n.steps;
    //   o.cur_step = n.cur_step;
    //   o.cur_arm = n.cur_arm;
    //   return o;
    // });
    await newBandit.startGenerate(
      modelTypeIDValue.thompson,
      Object.keys(armTagsValue).length,
      (d) => {
        console.log("callback", d);
        setBanditInfoValue(d);
      }
    );
    // setBanditInfoValue(d);
    newBandit.record(1, () => {
      newBandit.getArm((retval) => {
        console.log("got arm", retval);
      });
    });
  }, []);

  useEffect(() => {
    console.log(banditInfoValue.n_arms);
  }, [banditInfoValue]);

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
