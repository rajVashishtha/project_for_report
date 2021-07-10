import { withStyles } from '@material-ui/styles';
import React from 'react'
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
import {Grid, Typography} from '@material-ui/core'
import CategoryCard from '../../component/category-card/categorycard.component'
import axios from 'axios';
import { BaseUrl } from '../../constant/base_url';
import { setCurrentAdmin } from '../../redux/admin/admin.action';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';

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
    }
})

class CategoryPage extends React.Component{
    state={
        data:[],
        noData:false,
        loading:true
    }
    componentDidMount(){
        axios.get(BaseUrl+"/categories").then(res=>{
            this.setState({
                data:res.data.data,
                loading:false
            })

        }).catch(err=>{
            if(err.response.status === 401){
                setCurrentAdmin(null);
            }
            this.setState({
                noData:true,
                loading:false
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
                    <Grid container item xs={12} spacing={4} justify="center">
                        {
                            this.state.data.map((item,index)=>(
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <CategoryCard item={item} />
                                </Grid>
                            ))
                        }
                        {
                            this.state.noData && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="h4" align="center" color="textSecondary">No Category</Typography>
                                </Grid>
                            )
                        }
                        <Grid item xs={12} sm={6} md={3}>
                            <Loader
                                type="Circles"
                                color="#888888"
                                height={100}
                                width={100}
                                visible={this.state.loading}  
                                style={{textAlign:"center"}}                      
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch =>({
    setCurrentAdmin: admin => dispatch(setCurrentAdmin(admin))
})

export default connect(null, mapDispatchToProps)(withStyles(myStyle,{withTheme:true})(CategoryPage));