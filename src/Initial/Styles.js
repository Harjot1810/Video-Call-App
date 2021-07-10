import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { createStyles, Theme } from '@material-ui/core/styles';

const drawerWidth = 400;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        paddingTop: 60,
        //backgroundImage: `url(${drawerImage})`
        // backgroundColor: "#B3B6B7"
    },
    avatar: {
        marginLeft: 170,
        backgroundColor: "#008080",
        width: 70,
        height: 70,

    },
    drawerPaper: {
        width: drawerWidth,
        paddingTop: 60,
        //backgroundImage: `url(${drawerImage})`
        // backgroundColor: "#B3B6B7"
    },
    //toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        //backgroundColor: theme.palette.background.default,
        //paddingTop: 60,
    },
});

export { styles };