import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar'
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';


import {Swipe, Position} from "react-swipe-component"

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      likeButtonColor: {color: "#C6C6C6"},
      numOfLikes: props.postInfo.numOfLikes,
      liked: false,
      swipingUp: false,
    };
  }

  // using the module for detecting swiping
  // from https://www.npmjs.com/package/react-swipe-component
  onSwipeEnd = () => {
    if(this.state.swipingUp) {
        console.log("Swiped Up")
        // passing data back to parent
    }
    this.setState({swipingUp: false})
    this.props.onUserAction(0.0)
//     console.log("Swipe Ended")
  }
  onSwipeLeftListener = () => {
    console.log("Swiped left")
  }
  onSwipeRightListener = () => {
    console.log("Swiped right")
  }
  onSwipeUpListener = () => {
    this.setState({swipingUp: true});
  }
  onSwipeDownListener = () => {
    console.log("Swiped down")
  }
  onSwipeListener = (p) => {
    if (p.x !== 0) {
      console.log(`Swipe x: ${p.x}`)
    }
    if (p.y !== 0) {
      console.log(`Swipe y: ${p.y}`)
    }
  }


  // like button handler
  handleLikeButton = (e) => {
    // dislike the post
    if(this.state.liked) {
      this.setState({
        likeButtonColor: {color: "#C6C6C6"},
        numOfLikes: this.state.numOfLikes - 1,
        liked: !this.state.liked
      });
    }
    // like the post
    else {
      this.setState({
        likeButtonColor: {color: "#E91E63"},
        numOfLikes: this.state.numOfLikes + 1,
        liked: !this.state.liked
      });
      // TODO wait for x seconds

      this.props.onUserAction(1.0);
    }
  }


  // preventing dragging images
  // from https://stackoverflow.com/questions/49898749/how-can-i-prevent-drag-and-drop-images-in-a-react-app
  preventDragHandler = (e) => {
    e.preventDefault();
  }


  render() {
    return (
      <Card sx={{"maxWidth": "300px"}}>
        <Swipe
          nodeName="div"
          onSwipeEnd={this.onSwipeEnd}
//           onSwipedLeft={this.onSwipeLeftListener}
//           onSwipedRight={this.onSwipeRightListener}
//           onSwipedDown={this.onSwipeDownListener}
          onSwipedUp={this.onSwipeUpListener}
//           onSwipe={this.onSwipeListener}
          >
          <CardHeader className="userProfile" sx={{"user-select": "none", "textAlign": "left"}}
            avatar={
              <Avatar sx={this.props.postInfo.avatarColor} aria-label="user avatar">
                {this.props.postInfo.avatar}
              </Avatar>
            }
            title={this.props.postInfo.userName}
            subheader={this.props.postInfo.date}
          />
          <CardMedia component="img" image={this.props.postInfo.imgSrc} sx={{"height": "300px"}} onDragStart={this.preventDragHandler}/>
          <CardActions disableSpacing >
            <IconButton size="large" aria-label="like this post" onClick={this.handleLikeButton}>
              <FavoriteIcon sx={this.state.likeButtonColor} />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{"user-select": "none"}}>
              {this.state.numOfLikes} likes
            </Typography>
          </CardActions>
        </Swipe>
      </Card>
    );
  }
};

export default Post;