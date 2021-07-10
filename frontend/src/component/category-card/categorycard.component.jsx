import React from 'react'
import { Grid,Paper, Typography,Avatar } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom';


const myStyle = theme=>({
    paper:{
        padding:"15px 5px",
        border:`1px solid ${theme.palette.primary.main}`,
        [theme.breakpoints.down("sm")]:{
            marginLeft:"auto",
            marginRight:"auto"
        },
        cursor:"pointer"
    }
})


class CategoryCard extends React.Component{
    gotoCategoryPage = (id)=>{
        const {history} = this.props;
        history.push("/category/"+id);
    }
    render(){
        const {classes,item} = this.props;
        const {id, photo_url,name} = item;
        return(
            <Paper elevation={2} className={classes.paper} onClick={()=>{
                this.gotoCategoryPage(id);
            }}>
                <Grid container justify="space-between" spacing={2} align="center" direction="row">
                    <Grid item style={{marginLeft:"20px"}}>
                        <Avatar src={photo_url} alt={name} style={{width:"50px",height:"50px"}} />
                    </Grid>
                    <Grid item style={{paddingTop:"15px",marginRight:"30px"}}>
                        <Typography variant="h6" align="center" color="textSecondary">{name}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default withStyles(myStyle, {withTheme:true})(withRouter(CategoryCard))