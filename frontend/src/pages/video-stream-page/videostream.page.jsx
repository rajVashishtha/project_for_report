import React from 'react'
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
import {withStyles} from '@material-ui/styles'
import {Grid, Typography} from '@material-ui/core'
import VideoPlayerCard from '../../component/video-player-card/videoplayercard.component'
import ThumbnailCard from '../../component/thumbnail-card-2/thumbnailcard.component'
import axios from 'axios'
import { BaseUrl } from '../../constant/base_url'
import { withRouter } from 'react-router-dom'

const myStyle = theme =>({
    root: {
        marginTop:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"100px"
        }
    },
    adminaction:{
        padding:"10px 30px",
    }
})


class VideoStreamPage extends React.Component{
    state={
        video_id:null,
        video_data:"jscbj",
        category_id:null,
        relatedVideos:[],
        likes:0,
        dislikes:0,
        video_title:"RedJungles",
        uploaded_on:0,
        video_description:"RedJungles",liked:false,disliked:false
    }
    componentDidMount(){
        const {history,match} = this.props;
        
        window.addEventListener('popstate', ()=>{history.push("/")});
        if(isNaN(match.params.id)){
            history.push("/xecddc");
            return;
        }
        axios.get(BaseUrl+"/videos/"+match.params.id).then(res=>{
            console.log(res.data.data.video_url)
            this.setState({
                video_data:res.data.data.video_url,
                video_id:res.data.data.id,
                category_id:res.data.data.category_id,
                likes:res.data.data.likes_count,
                dislikes:res.data.data.dislikes_count,
                video_title:res.data.data.title,
                uploaded_on:res.data.data.uploaded_on,
                video_description:res.data.data.description
            })
            axios.get(BaseUrl+"/videos?category="+res.data.data.category_id).then(res=>{
                this.setState({relatedVideos:res.data.data});
            }).catch(err=>{

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
        const {classes,match} = this.props
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.root}>
                    <Grid container item xs={12} style={{marginTop:"30px",padding:"10px"}} justify="flex-start">
                        <Grid container item xs={12} spacing={2}>
                            <Grid item sm={8} xs={12}>
                                <VideoPlayerCard video={this.state.video_data} video_id={match.params.id} liked={this.state.liked} disliked={this.state.disliked}
                                likes={this.state.likes} dislikes={this.state.dislikes}
                                onLike={()=>{this.onToggleLike("like")}} onDislike={()=>{this.onToggleLike("dislike")}}
                                />
                                <div style={{
                                    paddingLeft:"20px"
                                }}>
                                    <Typography variant="h4">{this.state.video_title}</Typography>
                                    <br/>
                                    <Typography variant="button">{this.state.video_description}</Typography>
                                </div>
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