
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
    },
    content: {
        flexGrow: 1,
        width: '100%',
        display: 'flex'
    },
    paperleft: {
        height: "99%"
    },
    paperright: {
        height: "99%",
        backgroundColor: "transparent",
        boxShadow: "none"
    },
});

export { styles };