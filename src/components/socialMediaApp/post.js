import React, { useEffect, useState, forwardRef } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Swipe, Position } from "react-swipe-component";

export const Post = forwardRef((props, ref) => {
    const [likeButtonColor, setLikeButtonColor] = useState({
        color: "#C6C6C6",
    });
    const [numOfLikes, setNumOfLikes] = useState(props.postInfo.numOfLikes);
    const [liked, setLiked] = useState(false);
    const [swipingUp, setSwipingUp] = useState(false);

    // reset the page
    const resetPost = () => {
        setLikeButtonColor({ color: "#C6C6C6" });
        setNumOfLikes(props.postInfo.numOfLikes);
        setLiked(false);
        console.log("done resetting");
    };

    // using the module for detecting swiping
    // from https://www.npmjs.com/package/react-swipe-component
    // useEffect(() => {
    //     if (swipingUp) {
    //         console.log("Swiped Up");

    //         // setState({
    //         //   numOfLikes: props.postInfo.numOfLikes+(state.liked?1:0),
    //         // });

    //         // TODO wait for x seconds

    //         if (props.postInfo.userName == "mAtrIx") {
    //             props.onUserAction(-100.0);
    //         } else {
    //             if (liked) {
    //                 props.onUserAction(1.0);
    //             } else {
    //                 props.onUserAction(0.0);
    //             }
    //         }
    //         setSwipingUp(false);
    //     }
    // }, [swipingUp]);
    const onSwipeEnd = () => {
        if (swipingUp) {
            console.log("Swiped Up");

            // setState({
            //   numOfLikes: props.postInfo.numOfLikes+(state.liked?1:0),
            // });

            // TODO wait for x seconds

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
    const onSwipeLeftListener = () => {
        console.log("Swiped left");
    };
    const onSwipeRightListener = () => {
        console.log("Swiped right");
    };
    const onSwipeUpListener = () => {
        setSwipingUp(true);
    };
    const onSwipeDownListener = () => {
        console.log("Swiped down");
    };
    const onSwipeListener = (p) => {
        if (p.x !== 0) {
            console.log(`Swipe x: ${p.x}`);
        }
        if (p.y !== 0) {
            console.log(`Swipe y: ${p.y}`);
        }
    };

    // like button handler
    const handleLikeButton = (e) => {
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
            // TODO wait for x seconds

            // props.onUserAction(1.0);

            // TODO: reset the page
            // setState({
            //   likeButtonColor: {color: "#C6C6C6"},
            //   liked: false,
            // });
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
                //           onSwipedLeft={onSwipeLeftListener}
                //           onSwipedRight={onSwipeRightListener}
                //           onSwipedDown={onSwipeDownListener}
                onSwipedUp={onSwipeUpListener}
                //           onSwipe={onSwipeListener}
            >
                <CardHeader
                    className="userProfile"
                    sx={{ "user-select": "none", textAlign: "left" }}
                    avatar={
                        <Avatar
                            sx={props.postInfo.avatarColor}
                            aria-label="user avatar"
                        >
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
