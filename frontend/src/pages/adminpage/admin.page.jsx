import React from 'react'
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
import AdminCard from '../../component/admincard/admincard.component'
import {adminActions,superAdminActions} from '../../constant/adminaction';
import {withStyles} from '@material-ui/styles'
import {Grid} from '@material-ui/core'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const myStyle = theme =>({
    root: {
        marginTop:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"100px"
        }
    },
    adminaction:{
        padding:"10px 30px",
    }
})


class AdminPage extends React.Component{
    componentDidMount(){
        
    }
    render(){
        const {classes,currentAdmin} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.root}>
                {
                    (currentAdmin && (currentAdmin.is_super === 1)) ? (
                        <Grid container xs={12} className={classes.adminaction} spacing={3}>
                        {
                            superAdminActions.map((item,index)=>(
                                <Grid item md={6} xs={12}>
                                    <AdminCard link={item.link} avatar={item.icon} title={item.title} description={item.description} />
                                </Grid>
                            ))
                        }
                        </Grid>
                    ):(
                        <Grid container xs={12} className={classes.adminaction} spacing={3}  >
                        {
                            adminActions.map((item,index)=>(
                                <Grid item md={6} sm={6} xs={12}>
                                    <AdminCard link={item.link} avatar={item.icon} title={item.title} description={item.description} />
                                </Grid>
                            ))
                        }
                        </Grid>
                    )
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>({
    currentAdmin:state.admin.currentAdmin
})

export default connect(mapStateToProps)(withStyles(myStyle,{withTheme:true})(withRouter(AdminPage)))