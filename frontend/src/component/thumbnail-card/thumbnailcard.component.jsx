import React from 'react'
import {Grid,Paper} from '@material-ui/core'
import ProgressBar from '../progress-bar/progressbar.component'
import {withRouter} from 'react-router-dom'

class ThumbnailCard extends React.Component{
    state={
        imageUrl:"https://picsum.photos/200/100"
    }
    
    componentDidMount(){
        // const {totalTime,videoUrl} = this.props;
        // this.setState({
        //     totalTime:totalTime,videoUrl:videoUrl
        // },()=>{this.generateThumbnails()})
        this.setState({imageUrl:"https://picsum.photos/200/100"})
        
    }
    onVideoSelect = (video)=>{
        const {history} = this.props;
        console.log("send to video page")
        history.push(`/video/${1}`);
    }
    
    render(){
        const {video} = this.props;
        return( 
            <Grid item xs={12}>
                <Paper style={{ display: "flex", alignItems: "center", cursor: "pointer",padding:"5px 10px" }} onClick={() => this.onVideoSelect(video)} >
                    <Grid container justify="center" alignItems="center">
                        <Grid item xs={8} style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden"
                        }}>
                            <img  alt="thumbnail" src={video?(video.thumbnail):(this.state.imageUrl)} style={{
                                flex: 1,
                                minWidth: "100%",
                                minHeight: "100%",
                            }}  />
                        </Grid>
                        <Grid item xs={12}>
                            <ProgressBar value={Math.random()*100} />
                        </Grid>
                    </Grid>
                    
                </Paper>
            </Grid>
        )
    }
}

export default withRouter(ThumbnailCard);