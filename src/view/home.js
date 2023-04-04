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
  allSettingsParam,
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
  const [triggerBanditRecordVal, setTriggerBanditRecordVal] =
    useRecoilState(triggerBanditRecord);
  // const [barChartDataValue, setBarChartData] = useRecoilState(barChartData);
  const [allSettingsParamValue, setAllSettingsParam] =
    useRecoilState(allSettingsParam);
  // const [step, setStep] = useState(0);
  const armTagsValue = useRecoilValue(armTags);
  const modelTypeIDValue = useRecoilValue(modelTypeID);
  const currentAlgorithm = "thompson"; // change this to recoil state

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // EG FN FORWARD
  useEffect(async () => {
    console.log('start====================')
    var extra_params = JSON.parse(JSON.stringify(allSettingsParamValue.regretPlotParam));
    var target_mapped = {}
    for(const [key, value] of Object.entries(allSettingsParamValue.targetProbability)){
      target_mapped[armTagsValue[key]] = value;
    }
    extra_params["true_mus"] = target_mapped;

    // newBandit.startGenerate(
    //   modelTypeIDValue.thompson,
    //   Object.keys(armTagsValue).length,
    //   extra_params
    // );
    // await newBandit.recordInit((d) => {
    //   console.log("callback1", d);
    //   setBanditInfoValue(d);
    // });
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
    } else if (newBandit?.valueOf() === undefined) {
      console.log("ERROR: New bandit is null");
    }
  }, [triggerBanditRecordVal]);

  useEffect(async () => {
    // console.log(newParam);
    // dont update if it's the first time
    // if (newParam === undefined) return;
    console.log("allSettingsParamValue-->", allSettingsParamValue);
    var extra_params = JSON.parse(JSON.stringify(allSettingsParamValue.regretPlotParam));
    var target_mapped = {}
    for(const [key, value] of Object.entries(allSettingsParamValue.targetProbability)){
      target_mapped[armTagsValue[key]] = value;
    }
    extra_params["true_mus"] = target_mapped;

    newBandit.startGenerate(
      modelTypeIDValue[allSettingsParamValue.currentAlgorithm],
      Object.keys(armTagsValue).length,
      extra_params
    )
    await newBandit.recordInit((d) => {
      console.log("callback1", d);
      setBanditInfoValue(d);
    });
  }, [allSettingsParamValue.currentMode, 
    allSettingsParamValue.resetCount, 
    allSettingsParamValue.currentAlgorithm, 
    allSettingsParamValue.regretPlotParam,
    allSettingsParamValue.targetProbability, 
  ]);

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
            <Item style={{ textAlign: "left" }}>
              {/* allSettingsParamValue */}
              {Object.keys(allSettingsParamValue).map((k) => {
                return (
                  <div key={k}>
                    <b>{k}:</b>{" "}
                    {typeof allSettingsParamValue[k] === "object" ? (
                      <div>
                        {Object.keys(allSettingsParamValue[k]).map((key2) => {
                          return (
                            <span style={{ marginRight: "10px" }} key={key2}>
                              {key2}: {allSettingsParamValue[k][key2]}
                            </span>
                          );
                        })}
                      </div>
                    ) : typeof allSettingsParamValue[k] === "boolean" ? (
                      allSettingsParamValue[k] ? (
                        "True"
                      ) : (
                        "False"
                      )
                    ) : (
                      allSettingsParamValue[k]
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
          {allSettingsParamValue.currentAlgorithm === "thompson" ? (
            <Grid item xs={12}>
              <div id="alggraphparent">
                <AlgGraph width={500} height={500} />
              </div>
            </Grid>
          ) : null}
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
