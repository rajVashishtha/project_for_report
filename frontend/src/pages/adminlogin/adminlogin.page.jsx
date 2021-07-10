import { withStyles } from '@material-ui/styles';
import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GeneralHeader from '../../component/general-header/generalheader.component';
import CustomNavbar from '../../component/navbar/navbar.component';
import {Button, Grid,IconButton,Snackbar,TextField, Typography} from '@material-ui/core'
import axios from 'axios';
import {BaseUrl } from '../../constant/base_url';
import { CloseOutlined } from '@material-ui/icons';
import {setCurrentAdmin} from '../../redux/admin/admin.action'


const myStyle = theme=>({
    root: {
        marginTop:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"100px"
        }
    },
    form:{
        marginTop:"20px",
        width:"100%"
    },
    formField:{
        width:"50ch"
    }
})

class AdminLoginPage extends React.Component{
    state={
        email:"",
        otp:"",
        we_get_otp:false,
        snackbar:false,
        snackbarMessage:"Email Required!",
        loading:false,
    }
    componentDidMount(){
        const {currentAdmin,history} = this.props;
        console.log(currentAdmin)
        if(currentAdmin !== null){
            history.push("/redjungles/admin");
            return;
        }
    }
    toggleLoading = ()=>{
        this.setState({
            loading:!this.state.loading
        })
    }
    toggleSnackbar=(message)=>{
        if(typeof message === "string")
        this.setState({snackbar:!this.state.snackbar,snackbarMessage:message})
        else
        this.setState({snackbar:!this.state.snackbar})
    }
    handleChange = (event)=>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }
    submitEmail = ()=>{
        if(!this.state.email.trim()){
            this.toggleSnackbar("Email Required!")
            return;
        }
        let formdata = new FormData();
        formdata.append("email",this.state.email);
        this.toggleLoading();
        axios.post(BaseUrl+"/admins/login",formdata).then(res=>{
            this.setState({we_get_otp:true});
            this.toggleLoading();
        }).catch(err=>{
            this.toggleSnackbar(err.response.data.message);
            this.toggleLoading();
        })
    }
    submitOTP = ()=>{
        if(!this.state.otp.trim()){
            this.toggleSnackbar("Enter OTP!");
            return;
        }
        const {setCurrentAdmin,history} = this.props;
        let formdata = new FormData();
        formdata.append("email",this.state.email);
        formdata.append("otp",this.state.otp);
        this.toggleLoading();
        axios.post(BaseUrl+"/verify-otp",formdata).then(res=>{
            this.toggleLoading();
            console.log(res.data.data[0]);
            setCurrentAdmin(res.data.data[0]);
            history.push("/redjungles/admin");
        }).catch(err=>{
            console.log(err.response, err.request)
            if(err.response)
            this.toggleSnackbar(err.response.data.message);
            this.toggleLoading();
        })
    }
    render(){
        const {classes} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.root}>
                    <Typography align="center" variant="h5" color="textSecondary">Admin Login</Typography>
                        <Grid container item xs={12} spacing={3} direction="column" justify="center" alignItems="center" className={classes.form}>
                            <Grid item md={6} xs={12} className={classes.formField}>
                                <TextField fullWidth={true} label="Email"  value={this.state.email} onChange={this.handleChange} name="email" variant="outlined" />
                            </Grid>
                            {
                            this.state.we_get_otp && (
                                <Grid item md={6} xs={12} className={classes.formField}>
                                    <TextField fullWidth={true} label="OTP" value={this.state.otp} onChange={this.handleChange} name="otp" variant="outlined" />
                                </Grid>
                            )
                            }
                            <Grid item md={6} xs={12} className={classes.formField}>
                                <Button variant="outlined" disabled={this.state.loading} color={this.state.we_get_otp?"secondary":"primary"} onClick={this.submitEmail}>{this.state.loading?"Loading":this.state.we_get_otp?"Resend OTP":"Get OTP"}</Button>
                                {
                                this.state.we_get_otp && (<Button style={{marginLeft:"10px"}} variant="outlined" color="primary" onClick={this.submitOTP} disabled={this.state.loading}>{this.state.loading?"Loading":"Verify"}</Button>)
                                }
                            </Grid>
                        </Grid>
                </div>
                <Snackbar
                    open={this.state.snackbar}
                    autoHideDuration={6000}
                    onClose={this.toggleSnackbar}
                    message={this.state.snackbarMessage}
                    action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={this.toggleSnackbar}>
                        <CloseOutlined fontSize="small" />
                    </IconButton>
                    }
                />
                
            </div>
        )
    }
}
const mapStateToProps = state =>({
    currentAdmin:state.admin.currentAdmin
})
const mapDispatchToProps = dispatch =>({
    setCurrentAdmin : currentAdmin => dispatch(setCurrentAdmin(currentAdmin))
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(myStyle,{withTheme:true})(withRouter(AdminLoginPage)));