import { withStyles } from '@material-ui/styles';
import React from 'react'
import {Grid,TextField, Typography,Button,Snackbar} from '@material-ui/core'
import { NavigateNextOutlined, PersonOutlined } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import { BaseUrl } from '../../constant/base_url';
import { connect } from 'react-redux';
import { setCurrentAdmin } from '../../redux/admin/admin.action';

function Alert(props) {
    return <MuiAlert elevation={6} variant="outlined" {...props} />;
}

const myStyle = theme =>({
    margin:{
        marginTop:"40px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"150px"
        }
    },
    snackbar:{
        border:`3px solid ${theme.palette.primary.main}`,
        color:theme.palette.primary.main,
        borderRadius:theme.shape.borderRadius+2
    }
})

class AdminAddAdminAction extends React.Component{
    state={
        name:"",email:"",error:false,snackbar:false,snackbarMessage:"Error Occured!",loading:false
    }
    toggleLoading = ()=>{this.setState({loading:!this.state.loading})}
    handleChange = event =>{
        const {name, value} = event.target;
        this.setState({[name]:value})
    }
    handleSubmit = event=>{
        if(!this.state.name || !this.state.email){
            this.setState({error:true})
            return
        }
        const {currentAdmin,setCurrentAdmin} = this.props;
        let formdata = new FormData();
        formdata.append("name",this.state.name);
        formdata.append("email",this.state.email);
        this.toggleLoading();
        axios.post(BaseUrl+"/admins/register",formdata,{
            headers:{
                'authorization':`${currentAdmin.token_type} ${currentAdmin.access_token}`
            }
        }).then(res=>{
            const message = res.data.message;
            this.setState({snackbar:true,snackbarMessage:message},this.resetStates);
            this.toggleLoading();
        }).catch(err=>{
            if(err.response){
                const message = err.response.data.message;
                this.setState({snackbar:true,snackbarMessage:message});
                this.toggleLoading();
                if(err.response.status === 401){
                    setCurrentAdmin(null);
                }
            }
        })

    }
    resetStates = ()=>{
        this.setState({
            name:"",
            email:"",
            error:false,
        })
    }
    handleCloseSnackbar = ()=>{
        this.setState({snackbar:false})
    }
    render(){
        const {classes,theme} = this.props;
        return(
            <div className={classes.margin}>
                <Grid container justify="center">
                    <Grid container item sm={8} xs={12} spacing={3} justify="center" direction="row" alignItems="center" style={{marginBottom:"30px"}} >
                        <Typography variant="h5" color="textSecondary">Add Admin</Typography>
                    </Grid>
                    <Grid container item sm={8} xs={12} spacing={3} justify="center" direction="row" alignItems="center" >
                        <Grid item style={{paddingTop:theme.spacing(4)}}>
                            <PersonOutlined fontSize="large" style={{color:theme.palette.primary.main}} />
                        </Grid>
                        <Grid item xs={8}>
                            <TextField fullWidth error={this.state.error} label="Name" name="name" value={this.state.name} onChange={this.handleChange} variant="outlined" style={{marginTop:"20px"}} />
                        </Grid>
                    </Grid>
                    <Grid container item sm={8} xs={12} spacing={3} justify="center" direction="row" alignItems="center" >
                        <Grid item style={{paddingTop:theme.spacing(4)}}>
                            <PersonOutlined fontSize="large" style={{color:theme.palette.primary.main}} />
                        </Grid>
                        <Grid item xs={8}>
                            <TextField fullWidth label="Email" error={this.state.error} value={this.state.email} onChange={this.handleChange} name="email" type="email"  variant="outlined" style={{marginTop:"20px"}} />
                        </Grid>
                    </Grid>
                    <Grid container item sm={8} xs={12} spacing={3} justify="center" direction="column" alignItems="center" >
                        <Grid item />
                        <Grid item style={{paddingTop:theme.spacing(4)}}>
                            <Button color="primary" variant="outlined" disabled={this.state.loading} endIcon={<NavigateNextOutlined />} onClick={this.handleSubmit} >
                                {
                                    this.state.loading ? ("Loading..."):("Send Request")
                                }
                            </Button>
                        </Grid>
                        {
                        this.state.error && (
                            <Grid item>
                                <Typography color="error">Both fields are mandatory*</Typography>
                            </Grid>
                        )
                        }
                    </Grid>
                </Grid>
                <Snackbar open={this.state.snackbar} autoHideDuration={4000} className={classes.snackbar} onClose={this.handleCloseSnackbar}>
                    <Alert onClose={this.handleCloseSnackbar}  >
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

const mapStateToProps = state =>({
    currentAdmin:state.admin.currentAdmin
});

const mapDispatchToProps = dispatch => ({
    setCurrentAdmin : admin => dispatch(setCurrentAdmin(admin))
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(myStyle,{withTheme:true})(AdminAddAdminAction));