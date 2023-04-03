import React, { useEffect, useState, useRef } from "react";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import imageUrls from "./urls";
import { Post } from "./post.js";

export function SocialMediaApp(props) {
    const [postInfo, setPostInfo] = useState({
        userName: "mAtrIx",
        avatar: "AI",
        avatarColor: {
            bgcolor: "#D6452D",
        },
        date: "February 04, 2023",
        imgSrc: "images/tutorial.png", // source from https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580
        numOfLikes: 0,
    });
    const [liked, setLiked] = useState(0.0);
    // initialize a array and fill in with numbers from 0 to n-1
    const initArray = (n) => {
        return Array.from(Array(n).keys());
    };
    const tagDict = {
            cat: 0,
            dog: 1,
            panda: 2,
            alpaca: 3,
        }, // hard-coded
        imageTrackingDict = {
            cat: initArray(120), // hard-coded
            dog: initArray(120), // hard-coded
            panda: initArray(120), // hard-coded
            alpaca: initArray(120), // hard-coded
        },
        maxNumPhoto = 120; // hard-coded
    const child = useRef(null);

    // useEffect(() => {
    //   const newBandit = new GenerateNewBandit();
    //   newBandit.startGenerate('new', 'thompson-sampling', {'alpha': 1, 'beta': 1}, (newSteps) => {
    //     console.log(newSteps);
    //     setStep(newSteps);
    //   });
    // }, []);

    useEffect(() => {
        // skip the first tutorial post
        if (liked != -100.0) {
            //TODO: pass this data to Kris
        }

        //TODO: get the tag
        var newTag = randomTag();
        console.log("get the new tag: " + newTag);

        //generate a new post
        generateRandomPost(newTag);
    }, [liked]);

    // handling users' action
    // https://stackoverflow.com/questions/38394015/how-to-pass-data-from-child-component-to-its-parent-in-reactjs
    const handleUserAction = (likedValue) => {
        //save user's action
        setLiked(likedValue);
        console.log("received reward: " + likedValue);
    };

    // random tag (TODO: for testing only)
    const randomTag = () => {
        const tags = ["cat", "dog", "panda", "alpaca"];
        const tag = tags[Math.floor(Math.random() * tags.length)];
        return tag;
    };

    // user id generator https://www.codemzy.com/blog/random-unique-id-javascript
    // short random string for ids - not guaranteed to be unique
    const randomId = (length = 6) => {
        return Math.random()
            .toString(36)
            .substring(2, length + 2);
    };

    // random color for the avatar
    //https://css-tricks.com/snippets/javascript/random-hex-color/
    const randomColor = () => {
        return "#".concat(Math.floor(Math.random() * 16777215).toString(16));
    };

    // random number of likes
    const randomLikes = (max) => {
        return Math.floor(Math.random() * max);
    };

    // return a non-repetitive random image url gien by a tag
    const randomImg = (tag) => {
        // // print it out urls in array in string format, so we can download the console result to use these urls directly
        // console.log(getStrFormatArray());

        // if all images have been selected, we will reset the tracking list and restart selecting images from original 120 images for this tag
        if (imageTrackingDict[tag].length <= 0) {
            imageTrackingDict[tag] = initArray(maxNumPhoto);
        }

        const randomNum =
            Math.floor(Math.random() * imageTrackingDict[tag].length) +
            tagDict[tag] * maxNumPhoto;

        // console.log(`${tag} : ${randomNum-state.tagDict[tag] * state.maxNumPhoto} | ${randomNum}`);

        const src = imageUrls[randomNum];

        // remove this selected image from the array to aovid repetitive selection
        const index = imageTrackingDict[tag].indexOf(
            randomNum - tagDict[tag] * maxNumPhoto
        );
        imageTrackingDict[tag].splice(index, 1);

        return src;
    };

    // random date
    //https://www.fabiofranchino.com/log/create-a-random-date-with-javascript/
    const randomDate = (from, to) => {
        from = from.getTime();
        to = to.getTime();
        const newDate = new Date(from + Math.random() * (to - from));
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const newDateStr =
            months[newDate.getMonth()] +
            " " +
            newDate.getDate() +
            ", " +
            newDate.getFullYear();
        return newDateStr;
    };

    const generateRandomPost = (tag) => {
        const tempId = randomId(6);
        const sma = document.getElementById("social-media-app-card");
        // first div under sma
        const smaDiv = sma.getElementsByTagName("div")[0];
        smaDiv.classList.add("ease-out");

        setTimeout(() => {
            setPostInfo({
                userName: tempId,
                avatar: tempId.substring(0, 2),
                avatarColor: { bgcolor: randomColor() },
                date: randomDate(
                    new Date("February 01, 2022"),
                    new Date("April 05, 2022")
                ),
                imgSrc: randomImg(tag),
                numOfLikes: randomLikes(999),
            });
        }, 400);
    };

    useEffect(() => {
        console.log("new post generated");
        // Call the child method resetPost
        child.current?.resetPost(); // https://chafikgharbi.com/react-call-child-method/
    }, [postInfo]);

    return (
        <Card
            id="social-media-app"
            sx={{
                maxWidth: "350px",
                alignItems: "center",
            }}
        >
            <AppBar position="static" id="social-media-app-header">
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ "user-select": "none", flexGrow: 1 }}
                >
                    mAtrIx
                </Typography>
            </AppBar>
            <Grid style={{ margin: 12 }} container spacing={1}>
                <Post
                    style={{ margin: 12 }}
                    key={postInfo.userName}
                    postInfo={postInfo}
                    ref={child}
                    onUserAction={handleUserAction}
                />
            </Grid>
        </Card>
    );
}
