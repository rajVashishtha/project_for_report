import { withStyles } from '@material-ui/styles';
import React from 'react'
import {Grid, IconButton, Snackbar, Tooltip, Typography,TextField,Button} from "@material-ui/core"
import "./contactus.style.css"
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
import {contactUsList} from '../../constant/contactus'
import { CloseOutlined } from '@material-ui/icons';
// import ThumbnailCard from '../../component/thumbnail-card/thumbnailcard.component';

const myStyle = theme =>({
    root: {
        marginTop:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"100px"
        }
    },
    form:{
        padding:"20px 10px",
        marginTop:"10px",
        border:"1px solid #888888",
        marginLeft:"20px",marginRight:"20px"
    }
})

class ContactUsPage extends React.Component{
    state = {
        list:contactUsList,snackbar:false
    }
    copyToClipboard = ()=>{
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(this.textContent);
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        this.setState({ copied: true,snackbar:true });
    }
    initRef = c => (this.textContent = c);
    handleCloseSnackbar=()=>{this.setState({snackbar:false})}

    render(){
        const {classes} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.root}>
                    <Grid container justify="center" align="center" className={classes.flex}>
                        <Grid item sm={6} xs={12} style={{padding:"5px 10px"}}>
                            <ol className="list" style={{paddingLeft:"5px"}}>
                            {
                            this.state.list.map((item,index)=>(
                                <li className="item" key={index}>
                                    <h2 className="headline">{item.title}</h2>
                                    <span>{item.description}</span>
                                </li>
                            ))
                            }
                            </ol>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Typography color="textSecondary" variant="h4">Contact Us</Typography>
                            <Tooltip title="Click to copy to clipboard" arrow={true}>
                                <Typography ref={this.initRef} onClick={this.copyToClipboard} color="primary" style={{cursor:'pointer',marginTop:"5px",display:"inline-block"}}>vashiraj2000@gmail.com</Typography>
                            </Tooltip>
                            <form className={classes.form}>
                                <Typography color="textSecondary" variant="body1">Feedback Form</Typography>
                                <Grid container item spacing={3} xs={10} justify='center' align='center' direction="column" style={{marginTop:"20px"}}>
                                    <Grid item> 
                                        <TextField label="Title" variant="outlined" />                                        
                                    </Grid>
                                    <Grid item>
                                        <TextField variant="outlined" label="Feedback" />
                                    </Grid>
                                    <Grid item>
                                        <Button type="submit" color="primary" variant="outlined">
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </div>
                <Snackbar open={this.state.snackbar} autoHideDuration={3000} onClose={this.handleCloseSnackbar} action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleCloseSnackbar}>
                            <CloseOutlined fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                    } message="Copied to clipboard">
                </Snackbar>
            </div>
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(ContactUsPage);