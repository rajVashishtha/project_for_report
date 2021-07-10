import { Fab, Typography } from '@material-ui/core';
import { NavigateNextOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/admin/admin.action';

const myStyles = theme =>({
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    hoverEffect:{
        position:"fixed",
        right:"-115px",
        bottom:"100px",
        "&:hover, &:focus":{
            right:"-20px"
        }
    }
})

class Logout extends React.Component{
    render(){
        const {classes,setCurrentAdmin} = this.props;
        return(
            <Fab variant="extended" className={classes.hoverEffect} color="primary" onClick={()=>{
                setCurrentAdmin(null);
            }}>
                <NavigateNextOutlined className={classes.extendedIcon} />
                <Typography style={{marginRight:"30px"}}>Logout</Typography>
            </Fab>
        )
    }
}

const mapDispatchToProps = dispatch=>({
    setCurrentAdmin : admin => dispatch(setCurrentAdmin(admin))
});

export default connect(null, mapDispatchToProps)(withStyles(myStyles,{withTheme:true})(withRouter(Logout)));