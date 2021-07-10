import React from 'react';
import {Switch,Route} from 'react-router-dom'

import HomePage from './pages/homepage/home.page'
import NotFound from './pages/notfound/notfound.page'
import UploadPage from './pages/upload/upload.page'
import AdminPage from './pages/adminpage/admin.page' 
import AdminActionPage from './pages/adminaction/adminaction.page'
import ContactUsPage from './pages/contact-us/contactus.page'
import VideoStreamPage from './pages/video-stream-page/videostream-2.page'
import CategoryPage from './pages/categorypage/category.page'
import AdminLoginPage from './pages/adminlogin/adminlogin.page';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import CategoryPersonalPage from './pages/categorypage/categorypersonal.page';
import { PrivateRoute } from './component/privateroute/privateroute.component';
import temprouteComponent from './component/temp-route/temproute.component';
import SearchPage from './pages/searchpage/searchpage.page';
const defaultTheme = createMuiTheme();
const lightTheme = createMuiTheme({
  palette: {
	type:"light",
	primary:{
		main:"#f50057",
		dark:"#3E3E3E"
	},
	secondary:{
		main:defaultTheme.palette.grey[100]
	},
	dark:{
		main:defaultTheme.palette.grey[800],
		text:defaultTheme.palette.getContrastText(defaultTheme.palette.grey[800]),
	}
  },
});

const darkTheme = createMuiTheme({
	palette: {
		type:"dark",
		primary:{
			main:"#ba000d",
		},
		secondary:{
			main:"#262626"
		}
	  },
})



class App extends React.Component{
  state = {
    theme:lightTheme
  }
  componentDidMount(){
    const {currentTheme} = this.props;
    this.setState({
		theme:currentTheme === "dark" ? (darkTheme):(lightTheme)
	})
  }
  render(){
	  const {currentAdmin} = this.props;
    return (
      <div> 
        <ThemeProvider theme={this.state.theme}>
          <Switch>
            <Route exact path="/" component={HomePage} />
			<Route exact path="/temp-route/:id" component={temprouteComponent} />
			<Route exact path="/video/:id" component={VideoStreamPage} />
			<Route exact path="/upload" component={UploadPage} />
			<Route exact path="/category" component={CategoryPage} />
			<Route exact path="/category/:id" component={CategoryPersonalPage} />
			<Route exact path="/search/:id" component={SearchPage} />
			<Route exact path="/redjungles/admin/login" component={AdminLoginPage} />
			<PrivateRoute exact path="/redjungles/admin" auth={currentAdmin} component={AdminPage} />
			<PrivateRoute exact path="/redjungles/admin/:action" auth={currentAdmin} component={AdminActionPage} />
			<Route exact path="/contact" component={ContactUsPage} />
            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = state =>({
  currentTheme : state.theme.currentTheme,
  currentAdmin: state.admin.currentAdmin
})

export default connect(mapStateToProps,null)(App);



