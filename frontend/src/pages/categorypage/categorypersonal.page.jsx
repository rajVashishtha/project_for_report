import { withStyles } from '@material-ui/styles';
import React from 'react';
import GeneralHeader from '../../component/general-header/generalheader.component';
import CustomNavbar from '../../component/navbar/navbar.component'
import {FormControl,InputLabel,Select,MenuItem,Grid, Typography} from '@material-ui/core'
import ThumbnailCard from '../../component/thumbnail-card-2/thumbnailcard.component'
import axios from 'axios';
import { BaseUrl } from '../../constant/base_url';

const myStyle = theme =>({
    margin:{
        marginTop:"30px",
        marginBottom:"30px",
        [theme.breakpoints.down("sm")]:{
            marginTop:"120px",
            padding:"5px 10px"
        },
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width:"40ch",
        [theme.breakpoints.down("sm")]:{
            width:"80vw"
        }
    },
})


class CategoryPersonalPage extends React.Component{
    state={
        category:"",
        categories:[],
        videos:[],
        noData:false
    }
    handleChange = (event)=>{
        const {value} = event.target;
        console.log(value);
        if(value)
        this.setState({
            category:value
        },()=>{
            axios.get(BaseUrl+"/videos?category="+value).then(res=>{
                this.setState({
                    videos:[]
                },()=>{
                    this.setState({
                        videos:res.data.data,
                        noData:false
                    })
                })
            }).catch(err=>{
                this.setState({
                    videos:[],
                    noData:true
                })
            })
        })
    }
    componentDidMount(){
        const {match} = this.props;
        console.log(match);
        axios.get(BaseUrl+"/videos?category="+match.params.id).then(res=>{
            this.setState({
                videos:res.data.data
            })
        }).catch(err=>{
            this.setState({
                noData:true
            })
        })

        axios.get(BaseUrl+"/categories").then(res=>{
            console.log(res.data.data)
            this.setState({
                categories:res.data.data
            })
        }).catch(err=>{

        })
    }
    render(){
        const {classes} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div className={classes.margin}>
                    <Grid container spacing={4} item xs={12}>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                labelId="category-label"
                                id="category"
                                label="Category"
                                onChange={this.handleChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        this.state.categories.map((item,index)=>(
                                            <MenuItem value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Below Select  section */}
                        <Grid item xs={12}>
                            <Grid container item xs={12} spacing={4} justify="center" alignItems="center">
                                {
                                    this.state.videos.map((item,index)=>(
                                        <Grid container item xs={12} sm={6} md={4} key={index} >
                                            <ThumbnailCard item={item}  />
                                        </Grid>
                                    ))
                                }
                                {
                                    this.state.noData && (
                                        <Grid container item xs={12} sm={6} md={4} >
                                            <Typography variant="h4" align="center" color="textSecondary">No video </Typography>
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </Grid>

                    </Grid>
                </div>
            </div>
        )
    }
}

export default withStyles(myStyle,{withTheme:true})(CategoryPersonalPage);