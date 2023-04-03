import React, { useEffect } from "react";
import Slider from "@mui/material/Slider";
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

import SettingsIcon from "@mui/icons-material/Settings";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

import { useRecoilState } from "recoil";
import { currentStep } from "../../state/atoms";

const modeOptions = ["manual", "automatic", "slow demo"];

export default function TimeController() {
  const [currentStepValue, setCurrentStep] = useRecoilState(currentStep);
  const [play, setPlay] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [openSettingsDrawer, setOpenSettingsDrawer] = React.useState(false);

  const toggleDrawerWithSettings = (open) => (event) => {
    setOpenSettingsDrawer(open);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);

    console.log("selectNewMode", index, modeOptions[index]);
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

  useEffect(() => {
    setCurrentStep({
      ...currentStepValue,
      startCodeFlow: play,
    });
  }, [play]);

  return (
    <div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={1}>
          <IconButton aria-label="play" onClick={() => setPlay(!play)}>
            {play ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Grid>
        <Grid item xs={8}>
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
        <Grid item xs={1.5} style={{ zIndex: 2 }}>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="split button"
            size="small"
          >
            <Button>{modeOptions[selectedIndex]}</Button>
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
            anchorEl={anchorRef.current}
            role={undefined}
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
            anchor="right"
            open={openSettingsDrawer}
            onClose={toggleDrawerWithSettings(false)}
          >
            <Box sx={{ width: 550, padding: "2rem" }} role="presentation">
              <h4>Settings</h4>
              {/* general settings */}
              {/* radar chart */}
            </Box>
          </Drawer>
        </Grid>
      </Grid>
    </div>
  );
}
