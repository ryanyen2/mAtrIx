// react template for d3
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import BarChart from "../components/home/barChart";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { useRecoilState, useRecoilValue } from "recoil";

import { barChartData } from "../state/atoms";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import { RegretPlot } from "../components/home/regretPlot";
import AlgGraph from "../components/home/AlgGraph";
// import {timeRegretSelector} from '../state/selector';

function Home(props) {
  const [barChartDataValue, setBarChartData] = useRecoilState(barChartData);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Container id="home" style={{ marginTop: "2rem" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={3}>
          <Item>
            Fake Social Media
            <p>t: {window.localStorage.getItem("t")}</p>
            {/* {Object.keys(window.localStorage.getItem("regret")).map((key) => {
              return (
                <p key={key}>
                  {key}: {regret[key]}
                </p>
              );
            })} */}
          </Item>
        </Grid>
        <Grid item xs={5}>
          <Grid item xs={12}>
            <Item>Distribution Grpah</Item>
          </Grid>
          <Grid item xs={12}>
            <Item>
              <RegretPlot width={500} height={150} />
              <AlgGraph></AlgGraph>
            </Item>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Item>Code</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>Math Equation</Item>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid item xs={12}>
            <Item>Radar Chart</Item>
          </Grid>
          <Grid item xs={12}>
            <Item>Settings</Item>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Item>Time Controller</Item>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
