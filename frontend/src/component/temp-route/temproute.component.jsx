import { Typography } from '@material-ui/core';
import React from 'react'
import { withRouter } from 'react-router-dom';

class TempPage extends React.Component{
	componentDidMount(){
        const {match,history} = this.props;
        if(isNaN(match.params.id)){
            history.push("/skhkn");
            return;
        }
        history.push("/video/"+match.params.id);
	}
	render(){
		return(
			<div>
                <Typography variant="h4" align="center" style={{marginTop:"50px"}} color="textSecondary">Redirecting to Video</Typography>
			</div>
		)
	}
}

export default withRouter(TempPage); 