import React, { useEffect, useState, forwardRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Swipe, Position } from "react-swipe-component";

// import { allSettingsParam } from "../../state/atoms";
import { interval } from "d3";
import { __spectrum } from "../../utils/nouislider";

export const Post = forwardRef((props, ref) => {
  const [mode, setMode] = useState("manual");
  const [play, setPlay] = useState(false);
  const [likeButtonColor, setLikeButtonColor] = useState({
    color: "#C6C6C6",
  });
  const [numOfLikes, setNumOfLikes] = useState(props.postInfo.numOfLikes);
  const [liked, setLiked] = useState(false);
  const [swipingUp, setSwipingUp] = useState(false);
  const [timeoutIDAutoLike, setTimeoutIDAutoLike] = useState(null);
  const [timeoutIDAutoSwipe, setTimeoutIDAutoSwipe] = useState(null);

//   const props.allSettingsParamValue = useRecoilValue(allSettingsParam);

//   useEffect(() => {
//     console.log("props.props.allSettingsParamValue changed");
//   }, [props.allSettingsParamValue])

  useEffect(() => {
    if (
      props.allSettingsParamValue.currentMode == "automatic" &&
      props.allSettingsParamValue.play && !play
    ) {
      runingAutoMode();
    }
    // console.log(
    //   "in use effect, gonna set mode to " +
    //     props.allSettingsParamValue.currentMode +
    //     " and play is " +
    //     props.allSettingsParamValue.play
    // );
    setMode(props.allSettingsParamValue.currentMode);
    setPlay(props.allSettingsParamValue.play);
  }, [props.allSettingsParamValue, play]);

  useEffect(() => {
    resetPost();
  }, [props.allSettingsParamValue.reset])

  useEffect(() => {
    if (!play) {
      if (timeoutIDAutoLike !== undefined) {
        clearTimeout(timeoutIDAutoLike);
      }
      if (timeoutIDAutoSwipe !== undefined) {
        clearTimeout(timeoutIDAutoSwipe);
      }
    }
  }, [play, timeoutIDAutoLike, timeoutIDAutoSwipe]);

  // run auto mode and automatically run functions every 1 and 3 seconds
  const runingAutoMode = () => {
    console.log("-----In running auto mode----");
    setTimeoutIDAutoLike(setTimeout(autoClickLike, 1000));
    setTimeoutIDAutoSwipe(setTimeout(autoSwipeUp, 4000));
  };

  const autoClickLike = () => {
    // console.log("Auto click like is " + props.autoClickLike + " mode is " + mode);
    if (props.autoClickLike) {
      setLikeButtonColor({ color: "#E91E63" });
      setNumOfLikes(props.postInfo.numOfLikes + 1);
      setLiked(!liked);
    }
  };

  const autoSwipeUp = () => {
    if (props.postInfo.userName == "mAtrIx") {
      props.onUserAction(-100.0);
    } else {
      if (props.autoClickLike) {
        props.onUserAction(1.0);
      } else {
        props.onUserAction(0.0);
      }
    }
  };

  // reset the page
  const resetPost = () => {
    setLikeButtonColor({ color: "#C6C6C6" });
    setNumOfLikes(props.postInfo.numOfLikes);
    setLiked(false);
    // console.log("done resetting");
  };

  // using the module for detecting swiping
  // from https://www.npmjs.com/package/react-swipe-component
  const onSwipeEnd = () => {
    if (swipingUp && mode == "manual") {
      // console.log("Swiped Up");

      if (props.postInfo.userName == "mAtrIx") {
        props.onUserAction(-100.0);
      } else {
        if (liked) {
          props.onUserAction(1.0);
        } else {
          props.onUserAction(0.0);
        }
      }
      setSwipingUp(false);
    }
  };

  const onSwipeUpListener = () => {
    setSwipingUp(true);
  };

  // like button handler in mannual mode
  const handleLikeButton = (e) => {
    if (mode == "manual") {
      // dislike the post
      if (liked) {
        setLikeButtonColor({ color: "#C6C6C6" });
        setNumOfLikes(props.postInfo.numOfLikes);
        setLiked(!liked);
      }
      // like the post
      else {
        setLikeButtonColor({ color: "#E91E63" });
        setNumOfLikes(props.postInfo.numOfLikes + 1);
        setLiked(!liked);
      }
    }
  };

  // preventing dragging images
  // from https://stackoverflow.com/questions/49898749/how-can-i-prevent-drag-and-drop-images-in-a-react-app
  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  return (
    <Card style={{ width: "90%" }} id="social-media-app-card">
      <Swipe
        nodeName="div"
        onSwipeEnd={onSwipeEnd}
        onSwipedUp={onSwipeUpListener}
      >
        <CardHeader
          className="userProfile"
          sx={{ "user-select": "none", textAlign: "left" }}
          avatar={
            <Avatar sx={props.postInfo.avatarColor} aria-label="user avatar">
              {props.postInfo.avatar}
            </Avatar>
          }
          title={props.postInfo.userName}
          subheader={props.postInfo.date}
        />
        <CardMedia
          component="img"
          image={props.postInfo.imgSrc}
          sx={{ height: "300px", width: "300px" }}
          onDragStart={preventDragHandler}
          onDoubleClick={handleLikeButton}
        />
        <CardActions disableSpacing className="userAction">
          <IconButton
            size="large"
            aria-label="like this post"
            onClick={handleLikeButton}
          >
            <FavoriteIcon sx={likeButtonColor} />
          </IconButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ "user-select": "none" }}
          >
            {numOfLikes} likes
          </Typography>
        </CardActions>
      </Swipe>
    </Card>
  );
});
