import React from 'react'
import {IconButton,Avatar, Paper, Typography, Grid} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import {CloudUploadOutlined} from '@material-ui/icons'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { withRouter } from 'react-router-dom';

const myStyle = theme =>({
    realPaper:{
        border:`.2px solid ${theme.palette.primary.main}`,
        cursor:"pointer",
        minHeight:"200px",
        marginLeft:"auto",
        marginRight:"auto"
    },
    paper:{
        padding:"10px 20px",
        display:"flex",
        flexDirection:"column",
    },
    forIcon:{
        color:theme.palette.primary.main
    }
})

class AdminCard extends React.Component{
    state={
        count:0
    }
    componentDidMount(){
        const {link} = this.props;
        if(link === "confirm-video"){

        }
        else if(link === "categories"){

        }
        else if(link === "manage-video"){
            
        }
    }
    render(){
        const {classes,title,description,avatar,link,history,match} = this.props;
        return(
            <Grid item xs={12}>
                <Paper elevation={4} className={classes.realPaper} onClick={()=>{
                    history.push(`${match.path}/${link}`)
                }}>
                    <div className={classes.paper}>
                        <div style={{
                            display:"flex",
                            flexDirection:"row",
                            justifyContent:"space-between"
                        }}>
                            <div>
                                <Avatar >
                                    {avatar || <CloudUploadOutlined  />}
                                </Avatar>
                            </div>
                            <div>
                                <IconButton className={classes.forIcon} onClick={()=>{
                                    history.push(`${match.path}/${link}`)
                                }}>
                                    <ArrowRightAltIcon/>
                                </IconButton>
                            </div>
                        </div>
                        <div style={{marginTop:"20px"}}>
                            <Typography variant="h5" color="textSecondary">{title || "Confirm Upload"}</Typography>
                            <Typography style={{marginTop:"5px"}}>{description || "Confirm videos uploaded by users."}</Typography>
                        </div>
                        <div style={{marginTop:"10px"}}>
                        {
                            (link === "confirm-video" || link  === "categories" || link === "manage-video" ) && (
                                <Typography color="textSecondary">
                                    Count : {this.state.count}
                                </Typography>
                            )
                        }
                        </div>
                    </div>
                </Paper>

            </Grid>
        )
    }
}

export default withStyles(myStyle, {withTheme:true})(withRouter(AdminCard));