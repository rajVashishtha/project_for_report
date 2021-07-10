import { FormControl, Grid, Input, InputLabel, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import React from 'react'
import { BaseUrl } from '../../constant/base_url';

const myStyle = theme =>({
    mainContainer:{
        position:"realtive"
    },
    textfield:{
        width:"40ch",
        marginBottom:"5px",
        [theme.breakpoints.down("md")]:{
            width:"28ch"
        }
    },
    inputLabel: {
        color:"white",
        "&.focused": {
          color: theme.palette.primary.main
        },
    },
    suggestionBox:{
        top:"60px",
        width:"40ch",
        position:"absolute",
        background:"white",
        maxHeight:"60ch",
        overflowY:"scroll",
        border:"1px solid #888888",
        [theme.breakpoints.down("md")]:{
            top:"100px",
            width:"28ch"
        },
        "&::-webkit-scrollbar":{
            display:"none"
        }
    },
    root: {
        backgroundColor: theme.palette.background.paper,
    },
})


class SearchField extends React.Component{
    state={
        search:"",
        suggestions:[],
        suggestion_box:false
    }
    handleChange = (event)=>{
        if(!event.target.search){
            this.setState({
                suggestions:[]
            })
        }
        this.setState({
            search:event.target.value
        },this.fetchResult)
    }
    fetchResult = ()=>{
        let value = this.state.search.trim().toLowerCase();
        if(value.length !== 0){
            axios.get(BaseUrl+"/videos?search="+value).then(res=>{
                this.setState({
                    suggestions:res.data.data,
                    suggestion_box:true
                })
            }).catch(err=>{
                this.setState({
                    suggestions:[],
                    suggestion_box:false
                })
            })
        }
        else{
            this.setState({
                suggestions:[],
                suggestion_box:false
            })
        }
    }
    render(){
        const {classes} = this.props;
        return(
            <Grid item container className={classes.mainContainer} >
                <Grid item>
                    <TextField  label="Search" value={this.state.search} onChange={this.handleChange} variant="filled" InputLabelProps={{
                        classes: {
                        root: classes.inputLabel,
                        focused: "focused",
                        shrink: "shrink"
                        }
                    }} className={classes.textfield} inputProps={{style:{color:"white"}}}
                    InputProps={{
                        endAdornment:<SearchOutlined />
                    }}
                    />
                </Grid>
                {
                    this.state.suggestion_box && (
                        <Grid item className={classes.suggestionBox}>
                            <List className={classes.root} >
                            {
                                this.state.suggestions.map((item,index)=>(
                                    <ListItem key={index} button>
                                        <ListItemText primary={item.title} primaryTypographyProps={{
                                            style:{
                                                color:"black"
                                            }
                                        }} inset={false} />
                                    </ListItem>
                                ))
                            }
                            </List>
                        </Grid>
                    )
                }
            </Grid>
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(SearchField);