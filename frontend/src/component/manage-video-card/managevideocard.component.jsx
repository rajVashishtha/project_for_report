import React from 'react'
import {Grid} from '@material-ui/core'

import ProgressBar from '../progress-bar/progressbar.component';
import { withStyles } from '@material-ui/styles';
import fluidPlayer from 'fluid-player';
import  "fluid-player/src/css/fluidplayer.css"
import logo from '../../constant/video-logo.png'

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

class ManageVideoCard extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            video_url : props.item.video_url,
            likes:props.item.likes_count,
            dislikes:props.item.dislikes_count
        }
        this.self = React.createRef();
        this.player = null;
    }
    componentDidMount(){
        const {theme} = this.props;
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
    }
    render(){
        const {classes} = this.props;
        return(
            <Grid container item xs={12} spacing={3}>
                <Grid item xs={12} md={12} className={classes.videoCard}> 
                    <video ref={this.self} width="100%" height="100%">
                        <source src={this.state.video_url}  type="video/mp4" title="Video" />
                    </video>
                </Grid>
                
                <Grid item xs={12} md={12} className={classes.forProgressBar}>
                    <ProgressBar value={this.state.dislikes === 0?(0):(Math.ceil((this.state.likes/(this.state.likes+this.state.dislikes))*100))} />
                </Grid>
            </Grid>
                
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(ManageVideoCard);