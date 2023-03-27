// react template for d3
import React from "react";
import * as d3 from "d3";
import BarChart from "../components/home/barChart";
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { useRecoilState } from "recoil";

import { barChartData } from "../state/atoms";
import Button from '@mui/material/Button';


function Sample(props) {
  // const barChartDataValue = useRecoilValue(barChartDataSelector);
  // const setBarChartData = useSetRecoilState(barChartData);
  const [barChartDataValue, setBarChartData] = useRecoilState(barChartData);

  return (
    <Container id="sample" style={{ marginTop: "2rem" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              onClick={() =>
                setBarChartData((data) => [...data, Math.floor(Math.random() * 10)])
              }
            >
              Add
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
              <BarChart data={barChartDataValue} width={500} height={150} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Sample;
