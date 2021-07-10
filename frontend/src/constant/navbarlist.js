import {HomeOutlined, MenuBook, CloudUpload,ContactMailOutlined, PersonOutlined, ExitToAppOutlined} from '@material-ui/icons'
// import { setCurrentAdmin } from '../redux/admin/admin.action'

export const navbarlist = [
    {
        title:"Home",
        check:"home",
        icon:<HomeOutlined />,
        link:"/"
    },
    {
        title:"Category",
        check:"category",
        icon:<MenuBook />,
        link:"/category"
    },
    {
        title:"Upload Videos",
        check:"upload",
        icon:<CloudUpload />,
        link:"/upload"
    },
    {
        title:"Contact Us",
        check:"contact",
        icon:<ContactMailOutlined />,
        link:"/contact"
    }
]

export const navbarlistAdmin = [
    {
        title:"Home",
        check:"home",
        icon:<HomeOutlined />,
        link:"/"
    },
    {
        title:"Category",
        check:"category",
        icon:<MenuBook />,
        link:"/category"
    },
    {
        title:"Upload Videos",
        check:"upload",
        icon:<CloudUpload />,
        link:"/upload"
    },
    {
        title:"Contact Us",
        check:"contact",
        icon:<ContactMailOutlined />,
        link:"/contact"
    },
    {
        title:"Admin",
        check:"admin",
        icon:<PersonOutlined />,
        link:"/redjungles/admin"
    },
    {link:"/logout",check:"logout",title:"Logout",icon:<ExitToAppOutlined />}
]

