import React from 'react'
import CategoryCard from '../category-card/categorycard.component'
import {Grid, IconButton, TextField, Tooltip, Typography,Button,Avatar, Snackbar} from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import { PhotoOutlined } from '@material-ui/icons';
import imageCompression from 'browser-image-compression'
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import { BaseUrl } from '../../constant/base_url';
import { connect } from 'react-redux';

const myStyle = theme =>({
    margin:{
        marginTop:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"100px"
        }
    },
    padding:{
        padding:"5px 10px",
        marginTop:"20px",
    }
})

class AdminCategoryAction extends React.Component{
    state={
        newCategory:"",
        imageFile:null,
        imageFileAvatar:null,
        categories:[],
        noData:false,
        loading:true,
        uploading:false,
        snackbar:false,
        snackbarMessage:"Done"
    }
    toggleUploading = () =>{
        this.setState({uploading:!this.state.uploading});
    }
    componentDidMount(){
        axios.get(BaseUrl+"/categories").then(res=>{
            this.setState({categories:res.data.data});
        }).catch(err=>{
            this.setState({
                snackbarMessage:"Failed to fetch data"
            },this.toggleSnackbar)
        })
    }
    handleChange = (event)=>{
        const {name, value} = event.target;
        this.setState({
            [name]:value
        })
    }
    getbase64 = (blob)=>{
        return new Promise((resolve, reject)=>{
            let reader = new FileReader(); 
                reader.readAsDataURL(blob); 
                reader.onloadend = function () { 
                    let base64String = reader.result; 
                    resolve(base64String)
                } 
        })
    }
    resetState = ()=>{
        this.setState({
            newCategory:"",
            imageFile:null,
            imageFileAvatar:null,
            noData:false,
            loading:true,
            uploading:false
        })
    }
    handleFileChange =  async (event)=>{
        const {files} = event.target;
        imageCompression(files[0],{
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
          }).then(async modfile=>{
            let uploadableFile = null;
            let filename = `temp.jpg`;
            let filetype = "jpg";
            let filelastMod = files[0].lastModified;
            uploadableFile = new File([modfile], filename, {type: filetype, lastModified: filelastMod});
            let temp = await this.getbase64(modfile);
            this.setState({
                imageFile:uploadableFile,
                imageFileAvatar: temp
            });
          })
    }
    addCategory = ()=>{
        const {currentAdmin} = this.props;
        let formdata = new FormData();
        formdata.append("name",this.state.newCategory);
        formdata.append("photo",this.state.imageFile);
        this.toggleUploading();
        axios.post(BaseUrl+"/categories",formdata,{
            headers:{
                'authorization':`${currentAdmin.token_type} ${currentAdmin.access_token}`
            }
        }).then(res=>{
            this.toggleUploading();
            this.resetState();
            let temp = this.state.categories;
            temp.push(res.data.data);
            this.setState({snackbarMessage:"Added Successfully!",categories:temp},this.toggleSnackbar)
        }).catch(err=>{
            console.log(err);
            this.setState({snackbarMessage:"Failed !"},this.toggleSnackbar)
            this.toggleUploading();
        })
    }
    toggleSnackbar = ()=>{this.setState({snackbar:!this.state.snackbar})}
    render(){
        const {classes,theme} = this.props;
        return(
            <div className={classes.margin}>
                <Typography color="textSecondary" align="center" variant="h4">CATEGORIES</Typography>
                <Grid container spacing={3} item xs={12} className={classes.padding} justify="center">
                {
                    this.state.categories.map((item,index)=>(
                        <Grid item xs={12} sm={4} md={3} key={index}>
                            <CategoryCard item={item} />
                        </Grid>
                    ))
                }
                <div style={{display:"flex",flexDirection:"row",alignItems:"center",border:`1px solid ${theme.palette.primary.main}`,
                    width:"38ch", borderRadius:"40px",cursor:"pointer",paddingRight:"10px",paddingLeft:"5px",marginTop:theme.spacing(3)
                }}>
                    {/* <IconButton style={{
                        background:theme.palette.grey[300]
                    }}>
                        <PhotoOutlined />
                    </IconButton> */}
                    <input type="file" id="upload" accept="image/*" onChange={this.handleFileChange} style={{display:"none",position:'absolute',zIndex:"-998"}} />
                    <Tooltip title="Add Category Image" arrow={true}>
                        <Button style={{
                            background:theme.palette.grey[300],borderRadius:"100px",padding:"20px 0px"
                        }} component="label" htmlFor="upload" >
                        {
                            !this.state.imageFileAvatar?(
                                <PhotoOutlined style={{
                                    color:theme.palette.grey[500],borderRadius:"90px"
                                }}/>
                            ):(<Avatar src={this.state.imageFileAvatar} />)
                        }
                        </Button>
                    </Tooltip>
                    {/* <Typography color="textSecondary" style={{marginLeft:"10px"}}>
                        Add Category
                    </Typography> */}
                    <TextField value={this.state.newCategory} onChange={this.handleChange} name="newCategory"  placeholder="Add Category" style={{marginLeft:"10px"}} />
                    {
                    this.state.newCategory.trim() && (
                        <Tooltip title="Add new category" arrow={true}>
                            <IconButton onClick={this.addCategory} disabled={this.state.uploading}>
                                <CheckIcon />
                            </IconButton>
                        </Tooltip>
                    )
                    }
                </div>
                </Grid>
            <Snackbar
                message={this.state.snackbarMessage}
                open={this.state.snackbar}
                autoHideDuration={4000}
                onClose={this.toggleSnackbar}
            />
            </div>
        )
    }
}

const mapStateToProps = state =>({
    currentAdmin:state.admin.currentAdmin
})

export default connect(mapStateToProps)(withStyles(myStyle,{withTheme:true})(AdminCategoryAction));