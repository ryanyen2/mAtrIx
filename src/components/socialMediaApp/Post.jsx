import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar'
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Post = ({post}) => {

  // data
  var postInfo = {
    userName: "Lucy Wang",
    avatar: "LW",
    avatarColor: {
      "bgcolor": "#235656",
    },
    date: "February 20, 2023",
    imgSrc: "images/contentImg.jpg", // source from https://slp-statics.astockcdn.net/static_assets/staging/22spring/free/browse-vector-categories-collections/Card4_399895799.jpg?width=580
    numOfLikes: 19,
  };

  // like button
  const [likeButtonColor, setLikeButtonColor] = React.useState({color:"#C6C6C6"}); // #C6C6C6 and #E91E63
  const [numOfLikes, setNumOfLikes] = React.useState(postInfo.numOfLikes);
  const [liked, setLiked] = React.useState(false);
  const handleLikeButton = () => {
    if(liked) {
      setLikeButtonColor({color:"#C6C6C6"});
      setNumOfLikes(numOfLikes - 1);
      setLiked(!liked);
    }
    else {
      setLikeButtonColor({color:"#E91E63"});
      setNumOfLikes(numOfLikes + 1);
      setLiked(!liked);
    }
  };

  // styles
  const styles = {
    card: {
      "maxWidth": "300px",
    },
    cardHeader: {
      "textAlign": "left",
    },
    cardMedia: {
      "height": "300px",
    },
  };

  const test = {"bgcolor": "#235656"};

  return (
    <Card sx={styles.card}>
      <CardHeader className="userProfile" sx={styles.cardHeader}
        avatar={
          <Avatar sx={styles.avatarColor} aria-label="user avatar">
            {postInfo.avatar}
          </Avatar>
        }
        title={postInfo.userName}
        subheader={postInfo.date}
      />
      <CardMedia component="img" image={postInfo.imgSrc} sx={styles.cardMedia} />
      <CardActions disableSpacing >
        <IconButton size="large" aria-label="like this post" onClick={handleLikeButton}>
          <FavoriteIcon sx={likeButtonColor} />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {numOfLikes} likes
        </Typography>
      </CardActions>
    </Card>
  );
};

export default Post;