import { withStyles } from '@material-ui/styles'
import React from 'react'
import {Grid, Paper} from '@material-ui/core'
import {navbarlist, navbarlistAdmin} from '../../constant/navbarlist'
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {setCurrentActiveNavbar} from '../../redux/active-navbar/activenavbar.action'
import { setCurrentAdmin } from '../../redux/admin/admin.action';

const myStyle = theme =>({
    listContainer:{
        marginLeft:"auto",marginRight:"auto",marginTop:"5px"
    },
    toolbar: theme.mixins.toolbar,
    hoverOnNavbar:{
        cursor:"pointer",
        "&:hover":{
            backgroundColor:theme.palette.grey[200]
        }
    },
    active:{
        borderBottom:`3px solid ${theme.palette.primary.main}`,
        backgroundColor:theme.palette.grey[200]
    },
    mainPaper:{
        [theme.breakpoints.down("sm")]:{
            display:"none"
        }
    }
})

class CustomNavbar extends React.Component{
    changeActive = (index, link)=>{
        const {setCurrentAdmin} = this.props;
        if(link === "/logout"){
            setCurrentAdmin(null);
            return;
        }
        const {setCurrentActiveNavabar, history} = this.props;
        setCurrentActiveNavabar(index)
        history.push(link)
    }
    render(){
        const {classes, currentActive,currentAdmin} = this.props;
        let list = currentAdmin?navbarlistAdmin:navbarlist;
        return(
            <Paper elevation={5} className={classes.mainPaper}>
                <div className={classes.toolbar}></div>
                <Grid container item className={classes.listContainer} justify="center" xs={10} spacing={2}>
                {
                list.map((item,index)=>(
                    <Grid item xs style={{
                        borderRight:list.length-1 !== index && ("1px solid #888888")
                    }} key={index} className={index === currentActive ? clsx(classes.hoverOnNavbar, classes.active) :(classes.hoverOnNavbar)} 
                        onClick={()=>{this.changeActive(index,item.link)}}
                    >
                        <Grid container justify="center" spacing={2}>
                            <Grid item>
                                {item.icon}
                            </Grid>
                            <Grid item>
                                {item.title}
                            </Grid>
                        </Grid>
                    </Grid>
                ))
                }
                </Grid>
            </Paper>
        )
    }
}

const mapStateToProps = state =>({
    currentActive:state.active_navbar.currentActive,
    currentAdmin:state.admin.currentAdmin
})


const mapDispatchToProps = dispatch =>({
    setCurrentActiveNavabar : user => dispatch(setCurrentActiveNavbar(user)),
    setCurrentAdmin: admin => dispatch(setCurrentAdmin(admin))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(myStyle,{withTheme:true})(withRouter(CustomNavbar)))