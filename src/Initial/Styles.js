import paperImage from '../Pictures/Paper.png'

const drawerWidth = 360;

const styles = theme => ({
    div: {
        display: 'flex',
        flexDirection: 'row wrap',
        padding: 20,
        width: '100%'
    },
    paper: {
        height: "99%"
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
    },
    content: {
        flexGrow: 1,
        width: '100%',
        display: 'flex'
    },
    paperleft: {
        height: "99%",
        maxHeight: "99%",
        overflow: 'auto',
        borderRadius: 20,
        boxShadow: 40,
        backgroundImage: `url(${paperImage})`,
        backgroundSize: 'cover',
    },
    paperleftroom: {
        height: "99%",
        maxHeight: "99%",
        overflow: 'auto',
        borderRadius: 20,
        backgroundColor: "transparent",
        boxShadow: "none",
    },
    paperright: {
        height: "99%",
        backgroundColor: "transparent",
        boxShadow: "none"
    },
    paperrightroom: {
        height: "99%",
    }
});

export { styles };