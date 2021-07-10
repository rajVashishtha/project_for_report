import React from 'react'
import {Grid, IconButton} from '@material-ui/core'
import ReactPlayer from 'react-player'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ProgressBar from '../progress-bar/progressbar.component';
import { withStyles } from '@material-ui/styles';
import fluidPlayer from 'fluid-player';
import  "fluid-player/src/css/fluidplayer.css"
import logo from '../../constant/video-logo.png'
import { CloudDownloadOutlined } from '@material-ui/icons';

const myStyle = theme =>({
    videoCard:{
        height:"400px",
        width:"100%",
        [theme.breakpoints.down("sm")]:{
            height:"280px",
        }
    },
    forPre:{
        padding:"15px 5px",
        [theme.breakpoints.down("sm")]:{
            padding:"5px 0px",
            flexDirection:"column"
        }
    },
    forProgressBar:{
        [theme.breakpoints.down("sm")]:{
            width:"100%"
        }
    }
})

class VideoPlayerCard extends React.Component{
    constructor(props){
        super(props);
        this.self = React.createRef();
        this.player = null;
    }
    
    state={
        videoUrl:"https://redjungle.s3.ap-south-1.amazonaws.com/1611404562283.mp4",
        changed:false,
        pausedAtAd:false,
        video:""
    }
    componentDidUpdate(prevProps, prevState){
        const {video,theme,video_id} = this.props;
        console.log(video_id, video)
        if(video !== prevProps.video || video_id !== prevProps.video_id){
            // if (!!this.player) {
            //     this.player.destroy();
            // }
            this.setState({video:null});
            this.player = fluidPlayer(this.self.current,{
                layoutControls:{
                    primaryColor:theme.palette.primary.main,
                    logo:{
                        imageUrl:logo,
                        position:'bottom right',
                        hideWithControls:true
                    },
                    controlBar:{
                        autoHide:true,
                        autoHideTimeout:5,
                    },
                    playbackRateEnabled:true,
                    controlForwardBackward: {
                        show: true 
                    },
                    
                }
            });
            this.setState({video:video},()=>{
                console.log(video)
            });
        }
    }
    componentWillUnmount() {
        if (!!this.player) {
          this.player.destroy();
        }
    }
    render(){
        const {classes,pre,video,onLike, onDislike,liked,disliked,theme,likes,dislikes} = this.props;

        return(
            <Grid container item xs={12}>
                <Grid item xs={12} className={classes.videoCard}> 
                {
                    video &&(
                        <video ref={this.self} width="100%" height="100%">
                            <source src={this.state.video}  type="video/mp4" title="Video" />
                        </video>
                    )
                } 
                </Grid>
            {
                (!pre || pre) && (
                    <Grid item container justify="center" alignItems="center"  xs={12}
                     className={classes.forPre}>
                        {
                            !pre && (<Grid container item xs={12} md={5} justify="space-around">
                            <IconButton onClick={onLike}>
                                <ThumbUpAltOutlinedIcon style={liked?{color:theme.palette.primary.main}:{}}  />
                            </IconButton>
                            <IconButton onClick={onDislike}>
                                <ThumbDownAltOutlinedIcon style={disliked?{color:theme.palette.primary.main}:{}} />
                            </IconButton>
                            <IconButton onClick={()=>{
                                window.open(video,"_blank") 
                            }}>
                                <CloudDownloadOutlined />
                            </IconButton>
                        </Grid>)
                        }
                        <Grid item xs={12} md={7} className={classes.forProgressBar}>
                            <ProgressBar value={dislikes === 0?(0):(Math.ceil((likes/(likes+dislikes))*100))} />
                        </Grid>
                    </Grid>
                )
            }
            </Grid>
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(VideoPlayerCard);