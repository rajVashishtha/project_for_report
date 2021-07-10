import {Grid, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography, Tooltip } from '@material-ui/core';
import React from 'react'
import { withRouter } from 'react-router-dom'
import ProgressBar from '../progress-bar/progressbar.component';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import moment from 'moment';

class ThumbnailCard extends React.Component{
    render(){
        const {history,item} = this.props;
        return(
            <Card style={{width:"100%"}}>
                <CardActionArea onClick={()=>{
                    history.push("/temp-route/"+item.id);
                    return;
                }}>
                    <CardMedia
                    component="img"
                    alt={item.title}
                    height="200"
                    image={item.thumbnail_url}
                    title={item.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {item.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {item.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions style={{padding:"10px 5px !important"}}>
                    <Grid container xs={12} >
                        <Grid item container xs={12} direction="row" spacing={1}>
                            <Grid container item xs={6} spacing={1}>
                                <Grid item>
                                    <Tooltip title={"Total views"} arrow={true}>
                                        <VisibilityOutlinedIcon />
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Typography>{item.views}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container item xs={6} spacing={1} justify="flex-end">
                                <Grid item>
                                    <Tooltip title={"Uploaded"} arrow={true}>
                                        <AccessTimeOutlinedIcon />
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Typography>{moment(item.uploaded_on).fromNow()}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}>
                            <ProgressBar value={(item.dislikes_count+item.likes_count) === 0?(0):(Math.ceil((item.likes_count /(item.likes_count+item.dislikes_count))*100))  } />
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        )
    }
}

export default withRouter(ThumbnailCard);