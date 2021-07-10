import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import React from 'react'
import Loader from 'react-loader-spinner';
import { withRouter } from 'react-router-dom'
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
import { BaseUrl } from '../../constant/base_url';
import ThumbnailCard from '../../component/thumbnail-card-2/thumbnailcard.component'

const myStyles = theme =>({
    root: {
        marginTop:"30px",
        padding:"10px 30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"130px"
        }
    }
})

class SearchPage extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }
    state = {
        search:"",
        noData:false,
        loading:false,
        data:[],
        nextPage:false,
        nextPageURL:null
    }
    componentDidMount(){
        const {match} = this.props;
        const text = match.params.id;
        this.setState({
            search:text
        },this.fetchResults)
    }
    toggleLoading = ()=>{this.setState({loading:!this.state.loading})}
    getMoreResults = ()=>{
        axios.get(BaseUrl+this.state.nextPageURL).then(res=>{
            this.setState({
                loading:false,
                nextPage:res.data.links.next_url?true:false,
                nextPageURL:res.data.links.next_url,
            });
            this.setState({
                data:[...this.state.data, ...res.data.data]
            })
            
        }).catch(err=>{
            this.setState({
                loading:false,
                noData:true,
                nextPage:false,
                nextPageURL:null
            })
        })
    }
    fetchResults = ()=>{
        if(this.state.search.trim())
        {
            this.toggleLoading();
            axios.get(BaseUrl+"/videos?search="+this.state.search).then(res=>{
                this.setState({
                    data:res.data.data,
                    nextPage:res.data.links.next_url?true:false,
                    nextPageURL:res.data.links.next_url,
                },this.toggleLoading)
            }).catch(err=>{
                this.setState({
                    noData:true,
                    nextPage:false,
                    nextPageURL:null,
                },this.toggleLoading)
            })
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.match.params.id !== this.props.match.params.id){
            const {match} = this.props;
            const text = match.params.id;
            this.setState({
                search:text,
                noData:false,
                loading:false,
                data:[]
            },this.fetchResults)
            
        }
    }
    handleChange = (event)=>{
        this.setState({
            search:event.target.value
        })
    }    
    keyPress(e){
        // eslint-disable-next-line 
        if(e.keyCode == 13){
            this.setState({
                noData:false,
                loading:false,
                data:[]
            },this.fetchResults)
        }
     }   
    render(){
        const {classes,history} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.root}>
                    <Grid item xs={12} container>
                        <Grid item xs={12} md={4} sm={6}>
                            <TextField fullWidth label="Search here" variant="outlined" value={this.state.search}
                            onKeyDown={this.keyPress}
                            onChange={this.handleChange}
                                InputProps={{
                                    endAdornment:(
                                        <InputAdornment position="end">
                                            <IconButton onClick={()=>{
                                                if(this.state.search.trim())
                                                history.push("/search/"+this.state.search)
                                            }}>
                                                <SearchOutlined />
                                            </IconButton>
                                        </InputAdornment>
                                    )   
                                }}
                            />
                        </Grid>
                        <Grid xs={12} item container spacing={2} style={{marginTop:"20px"}}>
                        {
                            this.state.data.map((item,index)=>(
                                <Grid container item xs={12} sm={6} md={4} key={index} >
                                    <ThumbnailCard item={item} />
                                </Grid>
                            ))
                        }
                        </Grid>
                    {
                        this.state.loading && (
                            <Grid item xs={12} style={{marginTop:"30px"}}>
                                <Loader
                                    type="Circles"
                                    color="#888888"
                                    height={100}
                                    width={100}
                                    visible={this.state.loading}  
                                    style={{textAlign:"center"}}                      
                                />
                            </Grid>
                        )
                    }
                    {
                        this.state.noData && (
                            <Grid item xs={12} style={{marginTop:"30px"}}>
                                <Typography variant="h5" color="textSecondary" align="center">No result found</Typography>
                            </Grid>
                        )
                    }
                    </Grid>
                    {
                        this.state.data.length > 0 && (this.state.nextPage)&& (
                            <Grid item xs={12} sm={6} md={4}  >
                                <Button variant="outlined" onClick={this.getMoreResults} color="primary">Load More Related Videos</Button>
                            </Grid>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(myStyles,{withTheme:true})(withRouter(SearchPage));