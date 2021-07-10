import { withStyles } from '@material-ui/styles';
import React from 'react';
import GeneralHeader from '../../component/general-header/generalheader.component';
import CustomNavbar from '../../component/navbar/navbar.component'
import {Button, ButtonGroup, Grid, Typography} from '@material-ui/core'
import ThumbnailCard from '../../component/thumbnail-card-2/thumbnailcard.component'
import axios from 'axios';
import {BaseUrl} from '../../constant/base_url'
import Loader from 'react-loader-spinner'
// import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// import { ArrowDropUpOutlined } from '@material-ui/icons';

const myStyle = theme =>({
    margin:{
        marginTop:"30px",
        marginBottom:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"120px"
        },
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        direction:"column"
    },
    button:{
        width:"20ch",
        borderRight:"1px solid #888888",
        [theme.breakpoints.down("sm")]:{
            width:"12ch"
        }
    }
})

class HomePage extends React.Component{
    state={
        loading:true,
        data:[],
        noData:false,
        openFilter:true,
        filter:"latest",
        nextPage:false,
        nextPageURL:null
    }
    componentDidMount(){
        axios.get(BaseUrl+"/videos").then(res=>{
            console.log(res.data)
            this.setState({
                data:res.data.data,
                loading:false,
                nextPage:res.data.links.next_url !== ""?true:false,
                nextPageURL:res.data.links.next_url
            });
        }).catch(err=>{
            this.setState({
                loading:false,
                noData:true,
                nextPage:false,
                nextPageURL:null
            })
        })
    }
    changeFilter = (filter)=>{
        this.setState({filter:filter},this.getNewData);
    }
    getNewData = ()=>{
        const filter = this.state.filter;
        
        let url = BaseUrl;
        if(filter === "latest")
            url = url + "/videos";
        else if(filter === "most_viewed")
            url = url + "/videos?most_viewed=1"
        else if(filter === "most_liked")
            url = url + "/videos?most_liked=1"
        else
            url = url + "/videos?random=1"
        
        this.setState({
            loading:true,
            data:[],
            noData:false,
            openFilter:true,
            nextPage:false,
            nextPageURL:null
        })
        axios.get(url).then(res=>{
            this.setState({
                data:res.data.data,
                loading:false,
                nextPage:res.data.links.next_url?true:false,
                nextPageURL:res.data.links.next_url
            });
        }).catch(err=>{
            this.setState({
                loading:false,
                noData:true,
                nextPage:false,
                nextPageURL:null
            })
            console.log(err);
        })
    }
    nextPageData = ()=>{
        if(!this.state.nextPage){
            return;
        }
        this.setState({
            loading:true
        })
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
    render(){
        const {classes} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.margin}>
                    <Grid container item xs={12} direction="column" alignItems="center" spacing={3}>
                        <Grid container item xs={12} spacing={7} direction="row">
                            <Grid item>
                                <Typography variant="body1"  style={{
                                    fontWeight:"bolder",
                                    fontSize:"2rem",
                                    letterSpacing:"2px",
                                    paddingBottom:"10px"
                                }}>Filter - &nbsp;
                                <Typography component="span" variant="body2" style={{fontSize:"1.5rem"}} color="textSecondary">{this.state.filter}</Typography>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12}  >
                        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                            <Button onClick={()=>{
                                this.changeFilter("Latest")
                            }}>Latest</Button>
                            <Button onClick={()=>{
                                this.changeFilter("most_viewed")
                            }}>Most Viewed</Button>
                            <Button onClick={()=>{
                                this.changeFilter("most_liked")
                            }}>Most Liked</Button>
                        </ButtonGroup>
                        </Grid>
                        <Grid container item xs={12} spacing={5}  style={{marginTop:"5px"}}>
                        
                        
                        {
                            this.state.data.map((item,index)=>(
                                <Grid container item xs={12} sm={6} md={4} key={index} >
                                    <ThumbnailCard item={item} />
                                </Grid>
                            ))
                        }
                        {
                            this.state.loading && (
                                <Grid item xs={12} sm={12} md={12} style={{marginTop:"80px"}}>
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
                        
                        </Grid>
                        {
                            this.state.data.length > 0 && (this.state.nextPage)&& (
                                <Grid item xs={12} sm={6} md={4}  >
                                    <Button variant="outlined" onClick={this.nextPageData} color="primary">Load More Related Videos</Button>
                                </Grid>
                            )
                        }
                    </Grid>
                </div>
            </div>
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(HomePage);