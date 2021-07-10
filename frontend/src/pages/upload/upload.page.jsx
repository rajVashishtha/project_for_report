import React from 'react'
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
// import ReactPlayer from 'react-player'
// import {Grid, Typography,Button, TextField, FormControl,FormHelperText, TextareaAutosize,InputLabel,Select, Snackbar, IconButton} from '@material-ui/core'
// import { CloseOutlined, CloudUploadOutlined } from '@material-ui/icons'
import { withStyles } from '@material-ui/styles'
import './upload.style.css';
import VideoUploading from '../../component/video-uploading/videouploading.component'

const myStyle = theme =>({
    textfield:{
        [theme.breakpoints.up("sm")]:{
            width:"40ch",
            marginLeft:"20px",
        },
        [theme.breakpoints.down("sm")]:{
            marginTop:"30px",
            width:"30ch"
        }
    },
    buttonContainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        marginTop:"30px",
        [theme.breakpoints.down("sm")]:{
            flexDirection:"column",
            marginTop:"15vh",
            alignItems:"center",
            width:"100%"
        }
    },
    form:{
        width:"100%",
        [theme.breakpoints.down("sm")]:{
            width:"90%"
        }
    },
    textarea:{
        width:"42ch",
        [theme.breakpoints.down("sm")]:{
            width:"95%"
        }
    },
    margin:{
        marginTop:"30px",
        marginBottom:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"100px"
        }
    }
})


class UploadPage extends React.Component{
    state={
        uploaded:null,
        filename:"",title:"",description:"",
        videoFile:null,
        thumbnailFile:null,
        overLimit:false
    }
    toggleSnackBar = ()=>{
        this.setState({
            overLimit:!this.state.overLimit
        })
    }
    handleChange = (event)=>{
        const {value, files} = event.target;
        if(files && files[0]){
            let filesize = ((files[0].size/1024)/1024).toFixed(4);
            console.log(filesize)
            if(filesize > 50){
                this.toggleSnackBar();
                return;
            }
            this.setState({
                uploaded:window.URL.createObjectURL(files[0]),
                videoFile:files[0],
                filename:value
            })
            const video = document.createElement('video');
            video.src = window.URL.createObjectURL(files[0]);
            let CANVAS = document.createElement("canvas");
            let CANVAS_CTX = CANVAS.getContext("2d")
            CANVAS_CTX.drawImage(video,5,5,100,100);
            let thumbnail_url = CANVAS.toDataURL();
            let thumbnail_file = this.dataURLtoFile(thumbnail_url,'thumbnail.jpeg');
            this.setState({
                thumbnailFile:thumbnail_file
            })
        }
    }
    dataURLtoFile = (dataurl, filename) =>{
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }
    handleClear = ()=>{
        this.setState({
            uploaded:null,
            filename:"",
            thumbnailFile:null,
            videoFile:null
        })
    }
    handleChangeText = (event)=>{
        const {name,value} = event.target;
        this.setState({
            [name]:value
        })
    }
    render(){
        const {classes} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.margin}>
                    <VideoUploading admin={false} />
                </div>
                
                
            </div>
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(UploadPage);