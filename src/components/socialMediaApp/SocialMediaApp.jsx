import React, { createRef, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';


import Post from "./Post.jsx";

class SocialMediaApp extends React.Component {
// export default function SocialMediaApp() {

// const SocialMediaApp = ({}) => {
//
  constructor(props) {
    super(props);
    
    // Create the child instance using react createRef
    this.child = React.createRef();
    
    this.state = {
//       postInfo: {
//         userName: "lucy674",
//         avatar: "LW",
//         avatarColor: {
//           "bgcolor": "#64A2FA",
//         },
//         date: "February 20, 2023",
//         imgSrc: "images/contentImg2.jpg", // source from https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580
//         numOfLikes: 19,
//       },

//       postInfo: {
//         userName: "ken222",
//         avatar: "K",
//         avatarColor: {
//           "bgcolor": "#FAAB4D",
//         },
//         date: "February 22, 2023",
//         imgSrc: "images/contentImg4.jpg", // source from https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580
//         numOfLikes: 87,
//       },

      postInfo: {
        userName: "kris425",
        avatar: "KF",
        avatarColor: {
          "bgcolor": "#D6452D",
        },
        date: "February 04, 2023",
        imgSrc: "images/dog1.jpg", // source from https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580
        numOfLikes: 2,
      },
      liked: 0.0,
//       postInfo: {
//         userName: "ryan632",
//         avatar: "R",
//         avatarColor: {
//           "bgcolor": "#235656",
//         },
//         date: "February 19, 2023",
//         imgSrc: "images/contentImg3.jpg", // source from https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580
//         numOfLikes: 557,
//       },
    };
  }

  // handling users' action
  // https://stackoverflow.com/questions/38394015/how-to-pass-data-from-child-component-to-its-parent-in-reactjs
  handleUserAction = (likedValue) => {
    //save user's action 
    this.setState({liked: likedValue}, () => {
      console.log("received reward: " + likedValue);
      //TODO: pass this data to Kris

      //TODO: get the tag
      var newTag = this.randomTag();
      console.log("get the new tag: "+ newTag);


      //generate a new post
      this.generateRandomPost(newTag);
    });

  }

  // random tag (TODO: for testing only)
  randomTag = () => {
    const tags = ["dog","cat", "dessert", "beach"]
    return tags[Math.floor(Math.random() * tags.length)];
  }

  // user id generator https://www.codemzy.com/blog/random-unique-id-javascript
  // short random string for ids - not guaranteed to be unique
  randomId = (length=6) => {
    return Math.random().toString(36).substring(2, length+2);
  };

  // random color for the avatar
  //https://css-tricks.com/snippets/javascript/random-hex-color/
  randomColor = () => {
    return "#".concat(Math.floor(Math.random()*16777215).toString(16));
  };

  // random number of likes
  randomLiks = (max) => {
    return Math.floor(Math.random() * max);
  };

  //TODO: random image source without repeating
  randomImg = (tag) => {
    const src = "images/"+ tag + Math.floor(Math.random() * 8) + ".jpg"; // TODO: need to change this num later
    // console.log(src);
    return src;
  }

  // random date
  //https://www.fabiofranchino.com/log/create-a-random-date-with-javascript/
  randomDate = (from, to) => {
    from = from.getTime()
    to = to.getTime()
    const newDate = new Date(from + Math.random() * (to - from))
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const newDateStr = months[newDate.getMonth()]+" "+newDate.getDate()+", "+newDate.getFullYear()
    return newDateStr
  }

  generateRandomPost(tag) {
    const tempId = this.randomId(6);
    this.setState({
      postInfo: {
        userName: tempId,
        avatar: tempId.substring(0,2),
        avatarColor: {"bgcolor": this.randomColor()},
        date: this.randomDate(new Date("February 01, 2022"), new Date("April 05, 2022")),
        imgSrc: this.randomImg(tag), 
        numOfLikes: this.randomLiks(999),
      }}, () => {
        // Call the child method resetPost
        this.child.current.resetPost() // https://chafikgharbi.com/react-call-child-method/
      });
  }

  render() {
    return (
      <Card sx={{
            maxWidth: "325px",
            alignItems: 'center',
            }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{"user-select": "none", flexGrow: 1 }}>
              Fakebook
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid style={{ margin: 12 }} container spacing={1}>
          <Post style={{ margin: 12 }} 
            postInfo={this.state.postInfo} 
            ref={this.child}
            onUserAction = {this.handleUserAction}
          />
        </Grid>
      </Card>
    );
  }
};

export default SocialMediaApp;
