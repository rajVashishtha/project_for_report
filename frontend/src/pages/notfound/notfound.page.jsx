import { Typography } from '@material-ui/core';
import React from 'react';
import GeneralHeader from '../../component/general-header/generalheader.component';
import CustomNavbar from '../../component/navbar/navbar.component';


class NotFound extends React.Component{
    render(){
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                <div style={{width:"100%", display:"flex",justifyContent:"center",alignItems:"center",marginTop:"35vh"}}>
                    <Typography color="textSecondary" variant="h4">
                       404 Page Not Found!
                    </Typography>
                </div>
            </div>
        )
    }
}


export default NotFound;