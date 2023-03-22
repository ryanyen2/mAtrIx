import React, { useEffect, useState } from "react";
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
//
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
        imgSrc: "images/contentImg5.jpg", // source from https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580
        numOfLikes: 2,
      },
      liked: 0.0
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
    this.setState({liked: likedValue});

    // TODO: generate a new post

    //TODO: pass this data to Kris

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
              Fakebook {this.state.liked}
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid style={{ margin: 12 }} container spacing={1}>
          <Post style={{ margin: 12 }} 
            postInfo={this.state.postInfo} 
            onUserAction = {this.handleUserAction}
          />
        </Grid>
      </Card>
    );
  }
};

export default SocialMediaApp;
