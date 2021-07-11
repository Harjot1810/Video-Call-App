import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: theme.spacing(8),
        '& > *': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(2),
            marginLeft: "50%"
        },
    },
    logo: {
        marginLeft: "62%",
        marginBottom: theme.spacing(12),
    },
    paper: {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "#008080",
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#008080",

    },
    mainbutton: {
        position: 'relative',
        height: "17%",
        width: "41%",
        [theme.breakpoints.down('xs')]: {
            width: '100% !important',          // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focus': {
            zIndex: 1,
            '& $buttonBackdrop': {
                opacity: 0.15,
            },
            '& $buttonMarked': {
                opacity: 0,
            },
            '& $buttonTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focus: {},
    longButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    buttonbg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    buttonBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    buttonTitle: {
        position: 'relative',
        padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px ${theme.spacing(0.25) + 3}px`,
    },
    buttonMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    }
}));

export { useStyles };