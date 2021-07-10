/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';
import { CircularProgress, IconButton } from '@material-ui/core';
import axios from 'axios';
import { BaseUrl } from '../../constant/base_url';
import { withRouter } from 'react-router-dom';
import { SearchOutlined } from '@material-ui/icons';

const myStyles = theme =>({
    textfield:{
        width:"40ch",
        marginBottom:"5px",
        padding:"0px 0px",
        [theme.breakpoints.down("sm")]:{
            width:"26ch"
        }
    },
    inputField:{
        padding:"0px 0px",
        height:"20px"
    }
})

class AutoComplete extends React.Component{
    constructor(props){
        super(props);
        this.keyPress = this.keyPress.bind(this);
    }
    state={
        results:[],
        open:false,
        loading:false,
        search:"",
    }
    handleChange = (event)=>{
        let val = event.target.value;
        this.setState({
            search:val
        })
        if(val && val.length > 0){
            this.fetchResults(val);
        }
        else{
            this.setState({
                results:[]
            })
        }
    }
    keyPress(e){
        //eslint-disable-next-line
        if(e.keyCode == 13){
            this.getToSearchPage();
        }
     }   
    toggleLoading = ()=>{this.setState({loading:!this.state.loading})}
    fetchResults = (text)=>{
        this.toggleLoading();
        axios.get(BaseUrl+"/videos?search="+text).then(res=>{
            this.toggleLoading();
            this.setState({
                results:res.data.data
            })
        }).catch(err=>{
            this.toggleLoading();
            if(err.response.status === 404){
                this.setState({
                    results:[]
                })
            }
        })
    }
    handleSelectOption = (value)=>{
        const {history} = this.props;
        this.setState({
            open:false
        },()=>{
            history.push("/temp-route/"+value.id);
        })
    }
    getToSearchPage = ()=>{
        if(this.state.search.trim()){
            const {history} = this.props;
            history.push("/search/"+this.state.search);
        }
    }
    render(){
        const {classes} = this.props;
        return(
        <div className={classes.textfield}>
            <Autocomplete
              freeSolo
              id="search-field"
              disableClearable={true}
              options={this.state.results}
              open={this.state.open}
              onOpen={()=>{
                  this.setState({
                      open:true
                  })
              }}
              onClose={()=>{
                this.setState({
                    open:false
                })
            }}
                onChange={(event,value,reason)=>{
                    
                    if(reason === "select-option"){
                        this.handleSelectOption(value);
                    }
                }}
              getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  margin="normal"
                  variant="outlined"
                  size="small"
                  value={this.state.search}
                  onChange={this.handleChange}
                  onKeyDown={this.keyPress}
                  InputProps={{
                    ...params.InputProps, 
                    type: 'search',
                    style:{
                        color:"white"
                    },
                    endAdornment:<React.Fragment>
                        {this.state.loading ? <CircularProgress color="inherit" size={20} /> :(
                            <IconButton onClick={this.getToSearchPage} size="small">
                                <SearchOutlined style={{color:"white"}} />
                            </IconButton>
                        )}
                        {params.InputProps.endAdornment}
                    </React.Fragment>
                }}
                />
              )}
            />
          </div>
        )
    }
}

export default withStyles(myStyles,{withTheme:true})(withRouter(AutoComplete));
