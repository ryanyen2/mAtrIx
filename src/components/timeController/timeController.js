import React, { useState, useRef, useEffect } from "react";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import RefreshIcon from "@mui/icons-material/Refresh";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";

// settgins
import SettingsIcon from "@mui/icons-material/Settings";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
// import { RadarChart } from "../home/radarChart";
import ParameterSettings from "../home/parameterSettings";
import { styled } from "@mui/material/styles";

import { useRecoilState, useRecoilValue } from "recoil";
import { allSettingsParam, banditInfo } from "../../state/atoms";
import ToggleButton from "@mui/material/ToggleButton";

const modeOptions = ["manual", "automatic", "demo"];
const Input = styled(MuiInput)`
  width: 42px;
`;

export default function TimeController() {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const anchorRef = useRef(null);

  const [allSettingsParamValue, setAllSettingsParam] =
    useRecoilState(allSettingsParam);

  const [localSettingsParamValue, setLocalSettingsParamValue] = useState({
    ...allSettingsParamValue,
  });

  const banditInfoValue = useRecoilValue(banditInfo);

  const toggleDrawerWithSettings = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (!open) {
      setAllSettingsParam({
        ...allSettingsParamValue,
        currentAlgorithm: localSettingsParamValue.currentAlgorithm,
        regretPlotParam: {
          ...localSettingsParamValue.regretPlotParam,
        },
        targetProbability: {
          ...localSettingsParamValue.targetProbability,
        },
      });
      // console.log("handleClose", allSettingsParamValue.targetProbability);
    }
    setOpenSettingsDrawer(open);
  };

  const handleLocalSettingsParamValue = (newSettings) => {
    setLocalSettingsParamValue({
      ...newSettings,
    });
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);

    setAllSettingsParam({
      ...allSettingsParamValue,
      currentMode: modeOptions[index],
    });

    // console.log("selectNewMode", index, allSettingsParamValue.currentMode);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  let targetOutputSlidersValue = [
    {
      name: "cat",
      value: localSettingsParamValue.targetProbability.cat,
      icon: "🐈",
    },
    {
      name: "dog",
      value: localSettingsParamValue.targetProbability.dog,
      icon: "🐕",
    },
    {
      name: "bird",
      value: 0,
      icon: "🐦",
    },
    {
      name: "panda",
      value: localSettingsParamValue.targetProbability.panda,
      icon: "🐼",
    },
    {
      name: "alpaca",
      value: localSettingsParamValue.targetProbability.alpaca,
      icon: "🦙",
    },
    {
      name: "Dr.Jian",
      value: 0,
      icon: "👨‍🎓",
    },
  ];

  const handleSliderChange = (index) => (event, newValue) => {
    if (newValue === null) {
      return;
    }
    setLocalSettingsParamValue({
      ...localSettingsParamValue,
      targetProbability: {
        ...localSettingsParamValue.targetProbability,
        [targetOutputSlidersValue[index].name]: newValue,
      },
    });
  };
  

  return (
    <div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={1} id="eval-control">
          <ToggleButton
            id="eval-btn-toggle"
            aria-label="play"
            value="check"
            onClick={() => {
              setAllSettingsParam({
                ...allSettingsParamValue,
                play: !allSettingsParamValue.play,
              });
              // document.getElementById("eval-btn-toggle").click();
            }}
          >
            {allSettingsParamValue.play ? <PauseIcon /> : <PlayArrowIcon />}
          </ToggleButton>

          <IconButton
            id="eval-btn-reset"
            className="btn-reset"
            aria-label="Reset"
          >
            <RefreshIcon />
          </IconButton>
        </Grid>
        <Grid item xs={8}>
          <Slider
            aria-label="Step"
            defaultValue={banditInfoValue.cur_step}
            valueLabelDisplay="on"
            step={1}
            marks
            min={0}
            max={100}
          />
        </Grid>
        <Grid item xs={1.5} style={{ zIndex: 2 }}>
          <ButtonGroup
            variant="contained"
            aria-label="split button"
            size="small"
            ref={anchorRef}
          >
            <Button disabled>
              {allSettingsParamValue.currentMode}
              </Button>
            <Button
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            role={undefined}
            anchorEl={anchorRef.current}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {modeOptions.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            onClick={toggleDrawerWithSettings(true)}
            startIcon={<SettingsIcon />}
            size="small"
            style={{ color: "#eceff1", backgroundColor: "#607d8b" }}
          >
            Settings
          </Button>
          <Drawer
            id="settings-drawer"
            anchor="right"
            open={openSettingsDrawer}
            onClose={toggleDrawerWithSettings(false)}
            closeAfterTransition={false}
          >
            <Box sx={{ width: 550, padding: "2rem" }} role="presentation">
              <h4>General Settings</h4>
              <div id="parameterSettings" style={{ margin: "2rem 0 3rem 0" }}>
                <ParameterSettings
                  localSettingsParamValue={localSettingsParamValue}
                  setLocalSettingsParamValue={handleLocalSettingsParamValue}
                />
              </div>
              <h4>Target Ouput</h4>
              <div id="targetOutputSliders" style={{ margin: "2rem 0 3rem 0" }}>
                <Grid container spacing={2} alignItems="center">
                  {targetOutputSlidersValue.map((item, index) => (
                    <Grid
                      item
                      xs={6}
                      key={item.name}
                      id={`target-slider${item.name}`}
                    >
                      <Typography id={`input-slider-${item.name}`} gutterBottom>
                        {item.name}
                      </Typography>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>{item.icon}</Grid>
                        <Grid item xs>
                          <Slider
                            defaultValue={parseFloat(item.value)}
                            value={parseFloat(item.value)}
                            onChange={handleSliderChange(index)}
                            aria-labelledby="input-slider"
                            min={0}
                            max={1}
                            step={0.01}
                            valueLabelDisplay="auto"
                          />
                        </Grid>
                        {/* <Grid item>
                          <Input
                            value={parseFloat(item.value)}
                            size="small"
                            inputProps={{
                              step: 100,
                              min: 0,
                              max: 1,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </Grid> */}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Box>
          </Drawer>
        </Grid>
      </Grid>
    </div>
  );
}
