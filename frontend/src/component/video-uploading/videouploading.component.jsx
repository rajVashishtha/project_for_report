import React from 'react'
import ReactPlayer from 'react-player'
import {Grid, Typography,Button, TextField, FormControl,FormHelperText, TextareaAutosize,InputLabel,Select, Snackbar, IconButton} from '@material-ui/core'
import { CloseOutlined, CloudUploadOutlined } from '@material-ui/icons'
import { withStyles } from '@material-ui/styles'
import ProgressBar from '../progress-bar/progressbar.component'
import axios from 'axios'
import {BaseUrl} from '../../constant/base_url'
import { connect } from 'react-redux'


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
            width:"100%"
        }
    },
    textarea:{
        width:"42ch",
        [theme.breakpoints.down("sm")]:{
            width:"95%"
        }
    }
})


class VideoUploading extends React.Component{
    state={
        uploaded:null,
        filename:"",title:"",description:"",
        videoFile:null,
        thumbnailFile:null,
        overLimit:false,category:"",percentage:0,uploading:false,
        categories:[]
    }
    toggleSnackBar = ()=>{
        this.setState({
            overLimit:!this.state.overLimit
        })
    }
    handleChange = (event)=>{
        console.log(event, "worked")
        const {value, files} = event.target;
        console.log(value, files)
        if(files && files[0]){
            let filesize = ((files[0].size/1024)/1024).toFixed(4);

            if(filesize > 50){
                this.toggleSnackBar();
                return;
            }
            this.setState({
                uploaded:window.URL.createObjectURL(files[0]),
                videoFile:files[0],
                filename:value
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
            videoFile:null,
            percentage:0,
            uploading:false,
            categories:[]
        })
    }
    handleChangeText = (event)=>{
        const {name,value} = event.target;
        this.setState({
            [name]:value
        })
    }
    handleSubmit = (event)=>{
        event.preventDefault();
        const {currentAdmin} = this.props;
        const data = new FormData();
        let admin = currentAdmin;
        data.append("file",this.state.videoFile);
        data.append("title",this.state.title);
        data.append("category_id",this.state.category);
        data.append("description",this.state.description);
        data.append("admin",admin ? admin.id:"");

        this.setState({
            uploading:true
        })
        
        let temp = "https://node-video-streaming-demo.herokuapp.com/submit-video";
        axios.post(temp,data,{
            headers:{
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress:(ProgressEvent)=>{
                const {loaded, total} = ProgressEvent;
                this.setState({
                    percentage:Math.floor( (loaded*100)/total )
                })
            }
        }).then(res=>{
            this.setState({
                uploading:false,
                uploaded:null,
                filename:"",
                thumbnailFile:null,
                videoFile:null,
                percentage:0,
            })
            console.log(res.data)
        }).catch(err=>{
            this.setState({uploading:false})
        })
    }
    componentDidMount(){
        axios.get(BaseUrl+"/categories").then(res=>{
            console.log(res.data);
            this.setState({
                categories:res.data.data
            })
        }).catch(err=>{
            console.log(err);
        })
    }
    render(){
        const {classes,theme} = this.props;
        return(
            <React.Fragment>
                
                <Grid container direction="column" justify="center" alignItems="center" item xs={12} className={classes.margin}>
                    {
                    this.state.uploaded && (
                        <Grid item xs={12}>
                            {/* <ReactPlayer pip={true} url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls={true} /> */}
                            <Grid container justify="center" item xs={12} alignItems="center" direction="column" spacing={3}>
                                <Grid item xs={12}>
                                    <Typography color="textSecondary" component="div">Preview for upload!</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8} className="player-wrapper">
                                    <ReactPlayer pip={true} url={this.state.uploaded} controls={true} width="100%" height="100%" />
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                    }
                        <Grid item xs={12}>
                            
                            <div className={classes.buttonContainer} >
                                <div>
                                    <input
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        type="file"
                                        value={this.state.filename}
                                        onChange={this.handleChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="outlined" component="span" color="primary">
                                            <CloudUploadOutlined style={{marginRight:"5px"}} />
                                            Upload
                                        </Button>
                                    </label>
                                </div>
                                <div>
                                    <TextField disabled value={this.state.filename} type="text" placeholder="No File Selected" className={classes.textfield} />
                                </div>
                            </div>
                        </Grid>   

                        <Grid item xs={12} sm={8}>
                        {
                            this.state.uploaded && (
                                <div style={{
                                    marginTop:"50px",
                                    width:"100%"
                                }}>
                                    <form style={{
                                        display:"flex",
                                        flexDirection:"column",
                                        marginLeft:"auto",
                                        marginRight:"auto",
                                        justifyContent:"center",
                                        alignItems:"center",
                                        padding:"40px 30px",
                                        border:`1px solid ${theme.palette.primary.main}`
                                    }} className={classes.form} onSubmit={this.handleSubmit} >
                                        <Typography variant="h6" color="textSecondary" style={{
                                            marginBottom:'20px'
                                        }}>Enter Details</Typography>

                                        <FormControl style={{
                                            marginBottom:'20px',
                                        }} className={classes.textarea}>
                                            {/* <InputLabel htmlFor="my-input">Add Video Title</InputLabel>
                                            <Input  id="my-input" aria-describedby="video-title" /> */}
                                            <TextField name="title" value={this.state.title} required onChange={this.handleChangeText} variant="outlined" type="text" label="Add Video Title" />
                                            <FormHelperText id="video-title">Madatory *</FormHelperText>
                                        </FormControl>

                                        <FormControl style={{
                                            marginBottom:'20px',
                                        }} className={classes.textarea} variant="filled">
                                            <InputLabel htmlFor="category">Suggest Category</InputLabel>
                                            <Select
                                            native
                                            value={this.state.category}
                                            onChange={this.handleChangeText}
                                            name="category"
                                            required
                                            inputProps={{
                                                name: 'category',
                                                id: 'category',
                                            }}
                                            >
                                            <option aria-label="None" value="" />
                                            {
                                                this.state.categories.map((item,index)=>(
                                                    <option value={item.id}>{item.name}</option>
                                                ))
                                            }
                                            </Select>
                                        </FormControl>

                                        <TextareaAutosize aria-label="minimum height" style={{
                                            fontSize:theme.typography.fontSize+3,
                                            padding:"5px 10px"
                                        }} className={classes.textarea} name="description" value={this.state.description} onChange={this.handleChangeText} rowsMin={3} rowsMax={5} placeholder="Add video description" />
                                        <div style={{
                                            marginTop:"30px",width:"80%",justifyContent:"space-between",display:"flex",flexDirection:"row"
                                        }}>
                                            <Button onClick={this.handleClear} color="secondary" variant="contained">
                                                Clear
                                            </Button>
                                            <Button type="submit" variant="contained" disabled={this.state.uploading} color="primary">
                                            {
                                                this.state.uploading?("Loading"):("Submit")
                                            }
                                            </Button>
                                        </div>
                                    {
                                        this.state.uploading?(<div style={{width:"95%",paddingTop:"30px"}}>
                                        <ProgressBar value={this.state.percentage} />
                                    </div>):(null)
                                    }
                                    </form>
                                </div>
                            )
                        }
                        </Grid>                 
                </Grid>
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    open={this.state.overLimit}
                    autoHideDuration={6000}
                    onClose={this.toggleSnackBar}
                    message="Max Size 50 MB !"
                    action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={this.toggleSnackBar}>
                            <CloseOutlined fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                    }
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state =>({
    currentAdmin:state.admin.currentAdmin
})

export default connect(mapStateToProps)(withStyles(myStyle,{withTheme:true})(VideoUploading));