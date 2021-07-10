import React from 'react';
import { AppBar, Toolbar, Typography ,List,ListItem,Grid,Divider,IconButton,ListItemIcon,ListItemText} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import SearchField from '../searchfield/searchfield.component';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {CloseOutlined,MenuOutlined} from '@material-ui/icons'
import {navbarlist,navbarlistAdmin} from '../../constant/navbarlist'
import logo from '../../constant/book_logo.png'
import { withRouter } from 'react-router-dom';
import { setCurrentActiveNavbar } from '../../redux/active-navbar/activenavbar.action';
import { connect } from 'react-redux';
import { setCurrentAdmin } from '../../redux/admin/admin.action';

const myStyle = (theme) =>({

    root:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingRight:theme.spacing(5)
    },
    drawerList:{
        width:"100vw",
        [theme.breakpoints.up('sm')]:{
            width:240
        }
    },
    listContainer :{
        display: 'flex',
        flexDirection: 'row',
        padding: 2,
        marginLeft:theme.spacing(5),
        fontWeight:"bolder",
        cursor:"pointer"
    },
    grow: {
        flexGrow: 1,
        flexDiection:"row",
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]:{
            display:"none"
        }
    },
    title: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    sectionDesktop: {
        display: 'none',
        justifyContent:"center",
        alignItems:"center",
        [theme.breakpoints.up('md')]: {
        display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
        display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    padding:{
        padding:"0px 70px",
        flexDiection:"row",
        [theme.breakpoints.down("sm")]:{
            padding:"0px 10px",
            paddingRight:"20px",
            flexDirection:"column",
            justifyContent:"flex-start",
            alignItems:"flex-start"
        }
    },
    flexContainer:{
        [theme.breakpoints.down("sm")]:{
            width:"100%",
            justifyContent:"center",
            flexDirection:"row",
            display:"flex"
        }
    },
    flexContainerInner:{
        [theme.breakpoints.down("sm")]:{
            justifyContent:"space-between",
            flexDirection:"row",
            display:"flex",
            paddingRight:"10px"
        }
    }

})

class GeneralHeader extends React.Component{
    state={
        drawer:false,
    }
    toggleDrawer = ()=>{
        this.setState({drawer:!this.state.drawer})
    }
    render(){
        const {theme,classes,history,setCurrentAdmin,currentAdmin} = this.props;
        let list = currentAdmin?navbarlistAdmin:navbarlist;
        return(
            <React.Fragment>
                <AppBar style={{
                    background:theme.palette.dark.main,
                    color:theme.palette.dark.text
                }} >
                    <Toolbar style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                        <Grid container alignItems="center" justify="space-between" className={classes.padding}>
                            <Grid item>
                                <Grid container justify="center" style={{
                                    cursor:"pointer"
                                }} alignItems='center' onClick={()=>{
                                    history.push("/");
                                    setCurrentActiveNavbar(0);
                                }}>
                                    <img src={logo} alt="logo" width="50px" height="50px" />
                                    <Typography style={{color:theme.palette.primary.main,marginLeft:"10px"}} variant="h6" noWrap>
                                        STUDY 
                                    </Typography>
                                    <Typography variant="h6" noWrap>
                                        PACT
                                    </Typography>
                                </Grid>
                            </Grid>

                           <Grid item className={classes.flexContainer}>
                                <Grid container alignItems="center" spacing={3} className={classes.flexContainerInner}>
                                    <Grid item>
                                        <SearchField />
                                    </Grid>
                                    <Grid item>
                                        <IconButton onClick={this.toggleDrawer}>
                                            <MenuOutlined style={{color:theme.palette.dark.text}} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <SwipeableDrawer
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={this.state.drawer}
                    onClose={this.toggleDrawer}
                    onOpen={this.toggleDrawer}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <div className={classes.toolbar}>
                        <div style={{
                            display:"flex",flexDirection:"row-reverse",width:"100%",
                            alignItems:"center",height:"100%"
                        }}>
                            <IconButton onClick={this.toggleDrawer}>
                                <CloseOutlined />
                            </IconButton>
                        </div>
                    </div>
                    <Divider />
                    <List>
                    {
                        list.map((item, index)=>(
                            <ListItem button key={item.title} className={classes.drawerList} onClick={()=>{
                                if(item.check === "logout"){
                                    setCurrentAdmin(null);
                                    console.log("working")
                                    return;
                                }
                                history.push(item.link)
                            }}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>
                        ))
                    }
                    </List>
                </SwipeableDrawer>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state =>({
    currentAdmin:state.admin.currentAdmin
})

const mapDispatchToProps = dispatch =>({
    setCurrentActiveNavbar : navbar => dispatch(setCurrentActiveNavbar(navbar)),
    setCurrentAdmin: admin => dispatch(setCurrentAdmin(admin))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(myStyle,{withTheme:true})(withRouter(GeneralHeader)))