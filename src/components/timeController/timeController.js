import React, { useEffect } from "react";
import { Button } from "@mui/material";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";


import { useRecoilState } from "recoil";
import { currentStep } from "../../state/atoms";


export default function TimeController() {
  const [currentStepValue, setCurrentStep] = useRecoilState(currentStep);
  const [play, setPlay] = React.useState(false);

  useEffect(() => {
    setCurrentStep({
      ...currentStepValue,
      startCodeFlow: play,
    })
  }, [play]);

  return (
    <div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={1}>
          {/* play or pause */}
          <IconButton aria-label="play" onClick={() => setPlay(!play)}>
            {play ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          {/* <IconButton aria-label="pause" onClick={handlePause}>
            <PauseIcon />
          </IconButton> */}
        </Grid>
        <Grid item xs={11}>
          <Slider
            aria-label="Step"
            defaultValue={30}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={100}
          />
        </Grid>
      </Grid>
    </div>
  );
}
