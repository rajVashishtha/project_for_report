import React from 'react'
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
import {withStyles} from '@material-ui/styles'
import {Grid, IconButton, Typography} from '@material-ui/core'
import ThumbnailCard from '../../component/thumbnail-card-2/thumbnailcard.component'
import axios from 'axios'
import { BaseUrl } from '../../constant/base_url'
import { withRouter } from 'react-router-dom'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import { CloudDownloadOutlined, ThumbDownAltOutlined } from '@material-ui/icons'
import ProgressBar from '../../component/progress-bar/progressbar.component'
// import React from 'react'
import ReactPlayer from 'react-player'
// import { Player,ControlBar } from 'video-react';
// import 'video-react/dist/video-react.css';
// import fluidPlayer from 'fluid-player'
// import  "fluid-player/src/css/fluidplayer.css"

const myStyle = theme =>({
    root: {
        marginTop:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"100px"
        }
    },
    adminaction:{
        padding:"10px 30px",
    },
    videoCard:{
        width:"100%",
        height:"350px !important",
        // position: "relative",
        // paddingTop: "56.25%",
        [theme.breakpoints.down("sm")]:{
            height:"280px",
            marginTop:'20px'
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


class VideoStreamPage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.ref = null;
    }
    state={
        video_url:"",
        video_id:0,
        likes:0,
        dislikes:0,
        liked:false,
        disliked:false,
        relatedVideos:[],
        loaded:false
    }
    componentDidMount(){
        const {history} = this.props;
        window.addEventListener('popstate', ()=>{history.push("/")});
        this.fetchData(this.props.match.params.id,()=>{
            console.log("data loaded first time")
            this.setState({loaded:true})
            // if(this.player){
            //     this.player.destroy();
            // }
            // this.player = fluidPlayer(this.ref);
        });
    }
    componentDidUpdate(prevProps, prevState) {
        
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({loaded:false});
            this.fetchData(this.props.match.params.id,()=>{
                console.log("working")
                this.setState({loaded:true})
                // if(this.player){
                //     this.player.destroy();
                // }
                // console.log(this.ref);
                // this.player = fluidPlayer(this.ref);
            });
            
        }
      }
    fetchData = (id,callback)=>{
        // console.log(id);
        axios.get(BaseUrl+"/videos/"+id).then(res=>{
            const data = res.data.data;
            console.log(data);
            this.setState({
                video_url:data.video_url,
                video_id:data.id,
                category_id:data.category_id,
                likes:data.likes_count,
                dislikes:data.dislikes_count,
                video_title:data.title,
                uploaded_on:data.uploaded_on,
                video_description:data.description
            },()=>{
                console.log("state set")
            })
            callback();
            axios.get(BaseUrl+"/videos?category="+res.data.data.category_id).then(res=>{
                this.setState({relatedVideos:res.data.data});
            }).catch(err=>{
                console.log(err);
            })


        }).catch(err=>{
            console.log(err);
        })
    }
    onToggleLike = (type)=>{
        let formdata = new FormData();
        if(type === "like" && this.state.liked){
            this.setState({liked:false,likes:this.state.likes-1});
            return
        }
        if(type === "dislike" && this.state.disliked){
            this.setState({disliked:false,dislikes:this.state.dislikes-1});
            return
        }
        this.setState({
            liked:false,disliked:false
        })
        formdata.append("video_id",this.state.video_id);
        if(type==="like"){
            formdata.append("like",1);
            if(this.state.disliked){
                this.setState({dislikes:this.state.dislikes-1});
            }
        }
        else{
            formdata.append("dislike",2)
            if(this.state.liked){
                this.setState({likes:this.state.likes-1});
            }
        }
        
        axios.post(BaseUrl+"/likes",formdata).then(res=>{
            if(type==="like"){
                this.setState({liked:true,likes:this.state.likes+1});
            }else{
                this.setState({disliked:true,dislikes:this.state.dislikes+1})
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    render(){
        const {classes,theme} = this.props
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.root}>
                    <Grid container item xs={12} style={{marginTop:"30px",padding:"10px"}} justify="flex-start">
                        <Grid container item xs={12} spacing={2}>
                            <Grid item container sm={8} xs={12}>

                                <Grid item xs={12} className={classes.videoCard}> 
                                    {
                                        this.state.loaded ? (
                                            // <video ref={(ref)=>this.ref = ref} width="100%" height="100%">
                                            //     <source src={this.state.video_url}
                                            //         data-fluid-hd
                                            //         title='1080p'
                                            //         type='video/mp4'
                                            //     />
                                            // </video>
                                            <div style={{
                                                width:"100%",
                                                display:"flex",
                                                justifyContent:"center",
                                                alignItems:"center"
                                            }}>
                                                <ReactPlayer url={this.state.video_url} controls={true} stopOnUnmount={false} />
                                            </div>
                                        ):(null)
                                    }

                                </Grid>
                                    

                                <Grid item container justify="center" alignItems="center"  xs={12} className={classes.forPre}>
                                    <Grid container item xs={12} md={5} justify="space-around">
                                        <IconButton onClick={()=>{
                                            this.onToggleLike("like");
                                        }}>
                                            <ThumbUpAltOutlinedIcon style={this.state.liked?{color:theme.palette.primary.main}:{}}  />
                                        </IconButton>
                                        <IconButton onClick={()=>{
                                            this.onToggleLike("dislike");
                                        }}>
                                            <ThumbDownAltOutlined style={this.state.disliked?{color:theme.palette.primary.main}:{}} />
                                        </IconButton>
                                        <IconButton onClick={()=>{
                                            window.open(this.state.video,"_blank") 
                                        }}>
                                            <CloudDownloadOutlined />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12} md={7} className={classes.forProgressBar}>
                                        <ProgressBar value={this.state.dislikes === 0?(0):(Math.ceil((this.state.likes/(this.state.likes+this.state.dislikes))*100))} />
                                    </Grid>
                                </Grid>

                                


                                <Grid item style={{
                                    paddingLeft:"20px"
                                }}>
                                    <Typography variant="h5">{this.state.video_title}</Typography>
                                    <br/>
                                    <Typography variant="button">{this.state.video_description}</Typography>
                                </Grid>
                            </Grid>
                            {/* <Grid item sm={4} xs={12}>
                                <Typography >Put add here</Typography>
                            </Grid> */}
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop:"30px",padding:"10px",paddingLeft:"20px",}} spacing={4} item xs={12}>   
                    {
                        this.state.relatedVideos.map((item,index)=>(
                            <Grid container item xs={12} sm={6} md={4} key={index}>
                                <ThumbnailCard item={item} />
                            </Grid>
                        ))
                    }
                    </Grid>
                </div>
            </div>
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(withRouter(VideoStreamPage));