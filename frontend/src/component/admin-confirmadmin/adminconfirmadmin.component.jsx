import { withStyles } from '@material-ui/styles'
import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import axios from 'axios'
import { connect } from 'react-redux'
import {setCurrentAdmin} from '../../redux/admin/admin.action'
import { BaseUrl } from '../../constant/base_url'
import AdminConfirmCard from '../admin-confirm-card/adminconfirmcard.component'

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
    }
})

class AdminConfirmAdmin extends React.Component{
    state = {
        data:[],
        noData:false
    }
    componentDidMount(){
        const {setCurrentAdmin,currentAdmin} = this.props;
        axios.get(BaseUrl+"/pending-admin",{
            headers:{
                'authorization':`${currentAdmin.token_type} ${currentAdmin.access_token}`
            }
        }).then(res=>{
            this.setState({
                data:res.data.data,
                noData:false
            })
        }).catch(err=>{
            if(err.response.status === 404){
                this.setState({
                    noData:true
                })
            }
            else if(err.response.status === 401){
                setCurrentAdmin(null)
            }
        })
    }
    handleRemove = (id)=>{
        const {currentAdmin} = this.props;
        axios.delete(BaseUrl+"/pending-admin/"+id,{
            headers:{
                'authorization':`${currentAdmin.token_type} ${currentAdmin.access_token}`
            }
        }).then(res=>{
            let temp = this.state.data;
            let result= temp.filter(v=>v.id !== id);
            this.setState({
                data:result,
                noData:result.length === 0
            })
        }).catch(err=>{

        })
    }
    handleAccept = (id)=>{
        const {currentAdmin} = this.props;
        axios.get(BaseUrl+"/pending-admin/"+id,{
            headers:{
                'authorization':`${currentAdmin.token_type} ${currentAdmin.access_token}`
            }
        }).then(res=>{
            let temp = this.state.data;
            let result= temp.filter(v=>v.id !== id);
            this.setState({
                data:result,
                noData:result.length === 0
            })
        }).catch(err=>{

        })
    }
    render(){
        const {classes} = this.props;
        return(
            <div className={classes.margin}>
                <Grid container  justify="center" xs={12} spacing={4} align="center">
                {
                    this.state.data.map((item,index)=>(
                        <Grid container item xs={12} md={12} sm={12} key={index} spacing={4} justify="center" alignItems="center" direction="row" >
                            <Grid item xs={12} sm={6} md={4}>
                                <AdminConfirmCard item={item} onRemove={this.handleRemove} onAccept={this.handleAccept} />
                            </Grid>
                        </Grid>
                    ))
                }
                {
                    this.state.noData && (
                        <Grid container item xs={12} md={8} sm={10} >
                            <Typography variant="h4" color="textSecondary" align="center" style={{marginLeft:"auto",marginRight:"auto"}} >No pending admins</Typography>
                        </Grid>
                    )
                }
                </Grid>
            </div>
        )
    }
}
const mapStateToProps = state =>({
    currentAdmin:state.admin.currentAdmin
})
const mapDispatchToProps = dispatch =>({
    setCurrentAdmin:admin => dispatch(setCurrentAdmin(admin))
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(myStyle, {withTheme:true})(AdminConfirmAdmin));