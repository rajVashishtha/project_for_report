import React from 'react'
import { withRouter } from 'react-router-dom'
import GeneralHeader from '../../component/general-header/generalheader.component'
import CustomNavbar from '../../component/navbar/navbar.component'
import AdminCategoryAction from "../../component/admin-category-action/admincategoryaction.component"
import AdminAddAdminAction from '../../component/admin-addadmin/adminaddadmin.component'
import AdminConfirmVideo from '../../component/admin-confirm-video/adminconfirmvideo.component'
import AdminManageVideo from '../../component/admin-manage-video/adminmangevideo.component'
import AdminConfirmAdmin from '../../component/admin-confirmadmin/adminconfirmadmin.component'

class AdminActionPage extends React.Component{
    componentDidMount(){

    }
    render(){
        const {match} = this.props;
        return(
            <div>
                <GeneralHeader />
                <CustomNavbar />
                {
                match.params.action === "categories" && (
                    <AdminCategoryAction />
                )
                }
                {
                    match.params.action === "add-admin" && (
                        <AdminAddAdminAction />
                    )
                }
                {
                    match.params.action === "confirm-video" && (
                        <AdminConfirmVideo />
                    )
                }
                {
                    match.params.action === "manage-video" && (
                        <AdminManageVideo />
                    )
                }
                {
                    match.params.action === "confirm-admin" && (
                        <AdminConfirmAdmin />
                    )
                }
            </div>
        )
    }
}

export default withRouter(AdminActionPage);