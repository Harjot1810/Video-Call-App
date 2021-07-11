import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import ChatScreen from '../Chat-Components/ChatScreen';
import axios from 'axios';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import {
    Backdrop,
    CircularProgress,
    Button
} from "@material-ui/core";
import VideoCallIcon from '@material-ui/icons/VideoCall';
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

const drawerWidth = 360;

const styles = theme => ({
    div: {
        display: 'flex',
        flexDirection: 'row wrap',
        padding: 20,
        width: '100%'
    },
    paper: {
        //marginTop: 70,
        height: "99%",
        //opacity: .5
        //backgroundColor: 'transparent',
    },
    root: {
        display: 'flex',
        flexGrow: 1
    },
    toolbarButtons: { marginLeft: 'auto', },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        paddingTop: 60,
        //backgroundImage: `url(${drawerImage})`
        // backgroundColor: "#B3B6B7"
    },
    avatar: {
        marginLeft: "40%",
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
        //marginLeft: drawerWidth,
        //marginRight: drawerWidth,
        width: '100%',
        display: 'flex'
        //backgroundColor: theme.palette.background.default,
        //paddingTop: 60,
    },
    paperLeft: {
        flex: 4,
        height: '100%',
        margin: 10,
        textAlign: 'center',
        padding: 10
    },
    paperRight: {
        height: 600,
        flex: 1,
        margin: 10,
        textAlign: 'center',
    },
});

export { styles };