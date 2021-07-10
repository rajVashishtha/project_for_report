import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Tooltip, Typography} from '@material-ui/core'
import { RemoveOutlined,CheckOutlined,DeleteOutline } from '@material-ui/icons'
import {withStyles} from '@material-ui/styles'
import ManageVideoCard from '../manage-video-card/managevideocard.component'

const myStyle = theme =>({
    flexDirection:{
        flexDirection:"row",
        [theme.breakpoints.down("sm")]:{
            flexDirection:"column"
        }
    },
    fullWidth:{
        [theme.breakpoints.down("sm")]:{ 
            minWidth:"100%"
        }
    }
}) 

class ConfirmCard extends React.Component{
    state={
        dialog:false,
    }
    openDialog = ()=>{
        this.setState({dialog:true})
    }
    closeDialog = ()=>{
        this.setState({dialog:false})
    }
    doneDialog = ()=>{
        const {onRemove,onDelete} = this.props;
        if(onRemove){
            onRemove();
        }
        if(onDelete){
            onDelete();
        }
        this.closeDialog();
    }
    render(){
        const {classes,manage,confirm,item,onConfirm} = this.props;
        console.log(item)
        return(
            <Grid container item className={classes.flexDirection} alignItems="center" spacing={3} > 
                <Grid item xs={12} sm={8} className={classes.fullWidth}>
                    {/* <ThumbnailCard item={item} /> */}
                    {/* <video  width="100%" height="100%">
                        <source src={item.video_url}  type="video/mp4" title="Video" />
                    </video> */}
                    <ManageVideoCard item={item} />
                    {/* <VideoPlayerCard item={item} /> */}
                </Grid>
                <Grid item container spacing={3} justify="center" direction="row" alignItems="center" xs={12} sm={4}>
                {
                    confirm && (
                        <React.Fragment>
                            <Grid item style={{borderRight:"1px solid #888888",borderRadius:"20px"}}>
                                <Typography color="textSecondary" >Confirm Video</Typography>
                                <Tooltip title="allow video for users">
                                    <IconButton color="primary" onClick={onConfirm}>
                                        <CheckOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Typography color="textSecondary" >Remove Video</Typography>
                                <Tooltip title="Remove video permanently">
                                    <IconButton color="primary" onClick={this.openDialog}>
                                        <RemoveOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </React.Fragment>
                    )
                }
                {
                    manage && (
                        <Grid item>
                            <Typography color="textSecondary" >Delete Video</Typography>
                            <Tooltip title="Delete video permanently">
                                <IconButton color="primary" onClick={this.openDialog}>
                                    <DeleteOutline />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )
                }
                </Grid>
                <Dialog
                    open={this.state.dialog}
                    onClose={this.closeDialog}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Delete Video
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Are you sure about this. This process is irreversible.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button autoFocus onClick={this.closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.doneDialog} color="primary">
                        Delete
                    </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        )   
    }
}

export default withStyles(myStyle,{withTheme:true})(ConfirmCard);