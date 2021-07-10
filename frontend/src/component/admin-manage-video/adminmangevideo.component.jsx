import { withStyles } from '@material-ui/styles'
import React from 'react'
import {Fab, Grid, Tooltip,Modal,Typography, MenuItem, Select, FormControl, InputLabel} from '@material-ui/core'
import ConfirmCard from '../confirm-card/confirmcard.component'
import { AddOutlined, CloseOutlined } from '@material-ui/icons'
import VideoUploading from '../video-uploading/videouploading.component'
import axios from 'axios'
import { BaseUrl } from '../../constant/base_url'
import { connect } from 'react-redux'

const myStyle = theme =>({
    margin:{
        marginTop:"40px",
        overflow:"hidden",
        padding:"5px 10px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"150px"
        }
    },
    container:{
        padding:"10px 20px",
        [theme.breakpoints.down("sm")]:{
            padding:"20px 5px",
            paddingRight:"0px"
        }
    },
    speedDial: {
        position: 'fixed',
        bottom:"30px",
        right:"30px",
        transition:"transform .8s ease-in-out",
        "&:hover":{
          transform: "rotate(360deg)"
        }
    },
    modal:{
        width:"60%",
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:"50px",
        overflow:"scroll",
        [theme.breakpoints.down("sm")]:{
            width:"95%"
        }
    }
})

class AdminManageVideo extends React.Component{
    state={
        modal:false,
        data:[],
        admins:[],
        noData:false
    }
    toggleModal = ()=>{this.setState({modal:!this.state.modal})}
    componentDidMount(){
        const {currentAdmin} = this.props;
        axios.get(BaseUrl+"/videos?admin_id="+currentAdmin.id).then(res=>{
            console.log("videos",res.data);
            this.setState({
                data:res.data.data,
                noData:false
            })
        }).catch(err=>{
            if(err.response.status === 401){
                this.setState({
                    data:[],
                    noData:true
                })
            }
        })
        if(currentAdmin.is_super === 1){
            axios.get(BaseUrl+"/admins").then(res=>{
                this.setState({
                    admins:res.data.data
                })
            }).catch(err=>{

            })
        }
    }
    handleChange = (event)=>{
        const {value} = event.target;
        if(value.length === 0){
            this.setState({
                data:[],
                noData:true
            })
        }
        axios.get(BaseUrl+"/videos?admin_id="+value).then(res=>{
            this.setState({
                data:[],
            },()=>{
                this.setState({
                    data:res.data.data,
                    noData:false
                })
            })
            
        }).catch(err=>{
            if(err.response.status === 404){
                this.setState({
                    data:[],
                    noData:true
                })
            }
        })
    }
    handleDelete = (item)=>{
        const {currentAdmin} = this.props;
        axios.delete(BaseUrl+"/videos/"+item.id,{
            headers:{
                'authorization':`${currentAdmin.token_type} ${currentAdmin.access_token}`
            }
        }).then(res=>{
            let temp = this.state.data;
            let result = temp.filter(v=>v.id !== item.id);
            this.setState({
                data:result
            })
        }).catch(err=>{

        })
    }
    render(){
        const {classes,currentAdmin} = this.props;
        return(
            <div className={classes.margin}>
                {
                    currentAdmin.is_super && (
                        <Grid container xs={12} item>
                            <Grid item xs={12} md={4} sm={6}>
                                <FormControl variant="outlined" fullWidth >
                                    <InputLabel id="select-admin">Select Admin</InputLabel>
                                    <Select
                                    labelId="select-admin"
                                    id="select-admin-select"
                                    label="Slect Admin"
                                    onChange={this.handleChange}
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        this.state.admins.map((item,index)=>(
                                            <MenuItem value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )
                }
                <Grid container  justify="center"spacing={4} align="center" style={{marginTop:"50px"}}>
                {
                    this.state.data.map((item,index)=>(
                        <Grid container item xs={12} md={8} sm={10} >
                            <ConfirmCard item={item} manage={true} onDelete={()=>{
                                this.handleDelete(item);
                            }}/> 
                        </Grid>
                    ))
                }
                {
                    this.state.noData && (
                        <Grid container item xs={12} md={8} sm={10} >
                            <Typography variant="h5" color="textSecondary" align="center">No video uploaded</Typography>
                        </Grid>
                    )
                }
                    
                </Grid>
                <Tooltip title="Add video" arrow={true}>
                <Fab size="large" color="primary" aria-label="add" className={classes.speedDial} onClick={this.toggleModal}>
                    <AddOutlined />
                </Fab>
                </Tooltip>
                <Modal
                    open={this.state.modal}
                    onClose={this.toggleModal}
                    aria-labelledby="upload-modal-title"
                    aria-describedby="upload-modal-body"
                    className={classes.modal}
                    // disableScrollLock={true}
                >
                    <div style={{background:"white",padding:"10px 5px",paddingBottom:"30px"}}>
                        <CloseOutlined color="primary" style={{cursor:"pointer"}} onClick={this.toggleModal} />
                        <Typography variant="h5" align="center" color="textSecondary" style={{
                            margin:"5px 5px",
                        }}>Upload Video</Typography>

                        <VideoUploading admin={true}/>

                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state =>({
    currentAdmin:state.admin.currentAdmin
})

export default connect(mapStateToProps)(withStyles(myStyle, {withTheme:true})(AdminManageVideo));