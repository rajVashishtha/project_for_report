import React from 'react'
import { withRouter } from 'react-router-dom'
import {Button, Grid, Typography} from '@material-ui/core'
class AdminConfirmCard extends React.Component{
    render(){
        const {item, onRemove, onAccept} = this.props;
        return(
            <Grid item container spacing={3} xs={12}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" color="textSecondary">{item.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" align="center" color="textSecondary">{`Email : ${item.email}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" align="center" color="textSecondary">{`Requested by : ${item.added_by}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" align="center" color="textSecondary">{`Requested on : ${item.join_on}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={()=>{
                        onAccept(item.id)
                    }} variant="contained" color="primary">
                        Accept
                    </Button>
                    <Button onClick={()=>{
                        onRemove(item.id)
                    }} variant="outlined" style={{marginLeft:"10px"}} color="primary">
                        Reject
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default withRouter(AdminConfirmCard);