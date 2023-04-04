// react template for d3
import React, { useEffect, useState } from "react";
// import * as d3 from "d3";
// import BarChart from "../components/home/barChart";
import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { useRecoilState, useRecoilValue } from "recoil";

import {
  armTags,
  banditInfo,
  modelTypeID,
  triggerBanditRecord,
} from "../state/atoms";
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

const newBandit = new GenerateNewBandit();

function Home(props) {
  const [banditInfoValue, setBanditInfoValue] = useRecoilState(banditInfo);
  const [triggerBanditRecordVal, setTriggerBanditRecordVal] = useRecoilState(triggerBanditRecord);
  // const [barChartDataValue, setBarChartData] = useRecoilState(barChartData);
  const [allSettingsParamValue, setAllSettingsParam] =
    useRecoilState(allSettingsParam);
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
    newBandit.startGenerate(
      modelTypeIDValue.thompson,
      Object.keys(armTagsValue).length
    );
    await newBandit.recordInit((d) => {
      console.log("callback1", d);
      setBanditInfoValue(d);
    });
  }, []);

  useEffect(() => {
    // console.log(banditInfoValue.keys);
  }, [banditInfoValue]);

  useEffect(async () => {
    // await newBandit.record(1);
    // await newBandit.record(triggerBanditRecordVal.rewardToPass);
    if (triggerBanditRecordVal.trigger && newBandit?.valueOf() !== undefined) {
      // await newBandit.record(triggerBanditRecordVal.rewardToPass);
      await newBandit.record(triggerBanditRecordVal.rewardToPass, (d) => {
        console.log("callback2", d);
        setBanditInfoValue(d);
      });
      // await newBandit.record(triggerBanditRecordVal.rewardToPass, setBanditInfoValue);
      setTriggerBanditRecordVal({
        trigger: false,
        rewardToPass: -1,
      });
    } else if(newBandit?.valueOf() === undefined) {
      console.log("ERROR: New bandit is null");
    }
  }, [triggerBanditRecordVal]);

  useEffect(() => {
    console.log("allSettingsParamValue", allSettingsParamValue);
  }, [allSettingsParamValue]);

  return (
    <Container id="home" style={{ marginTop: "2rem" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Item>
            <TimeController />
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Grid item xs={12}>
            <Item style={{ textAlign: 'left' }}>
              {/* allSettingsParamValue */}
              {Object.keys(allSettingsParamValue).map((key) => {
                return (
                  <div>
                    <b>{key}:</b> {typeof allSettingsParamValue[key] === "object" ? (
                      <div>
                        {Object.keys(allSettingsParamValue[key]).map((key2) => {
                          return (
                            <span style={{ marginRight: '10px' }}>
                              {key2}: {allSettingsParamValue[key][key2]}
                              </span>
                          );
                        })}
                        </div>
                    ) : (
                      typeof allSettingsParamValue[key] === 'boolean' ? allSettingsParamValue[key] ? 'True' : 'False' : allSettingsParamValue[key]
                    )}
                  </div>
                );
              })}
            </Item>
          </Grid>
          <Grid item xs={12}>
            <SocialMediaApp />
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid item xs={12}>
            <div id="alggraphparent">
              <AlgGraph width={500} height={500} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <RegretPlot width={500} height={150} />
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
