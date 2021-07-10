import { withStyles } from '@material-ui/styles'
import React from 'react'
import {Grid, Typography} from '@material-ui/core'
import ConfirmCard from '../confirm-card/confirmcard.component'
import axios from 'axios'
import { connect } from 'react-redux'
import {setCurrentAdmin} from '../../redux/admin/admin.action'
import { BaseUrl } from '../../constant/base_url'

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

class AdminConfirmVideo extends React.Component{
    state = {
        data:[],
        noData:false
    }
    componentDidMount(){
        const {setCurrentAdmin,currentAdmin} = this.props;
        axios.get(BaseUrl+"/videos/submit",{
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
    handleRemove = (item)=>{
        const {currentAdmin} = this.props;
        console.log("removing "+item.id);
        axios.get(BaseUrl+"/videos-confirm?remove="+item.id,{
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
    handleConfirm = (item)=>{
        const {currentAdmin} = this.props;
        axios.get(BaseUrl+"/videos-confirm?confirm="+item.id,{
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
        const {classes} = this.props;
        return(
            <div className={classes.margin}>
                <Grid container  justify="center"spacing={4} align="center">
                {
                    this.state.data.map((item,index)=>(
                        <Grid container item xs={12} md={12} sm={12} >
                            <ConfirmCard item={item} manage={false} confirm={true} onRemove={()=>{
                                this.handleRemove(item);
                            }} onConfirm={()=>{
                                this.handleConfirm(item);
                            }} />
                        </Grid>
                    ))
                }
                {
                    this.state.noData && (
                        <Grid container item xs={12} md={8} sm={10} >
                            <Typography variant="h4" color="textSecondary" align="center" >No video uploaded</Typography>
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(myStyle, {withTheme:true})(AdminConfirmVideo));