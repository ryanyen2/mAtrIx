import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import Post from "./Post.jsx";

const SocialMediaApp = ({}) => {

  return (
    <Card sx={{
          maxWidth: "325px",
          alignItems: 'center',
          }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fakebook
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid style={{ margin: 12 }} container spacing={1}>
        <Post style={{ margin: 12 }} />
      </Grid>
    </Card>
  );

};

export default SocialMediaApp;
