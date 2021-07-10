import React, { useState, useEffect } from 'react';
import '../Initial/index.css';
import App from '../Initial/App';
import { useStyles } from './Styles.js'
import Signin from './Signin'
import Signup from './Signup'
import Logo from '../Logo.jpg'
import Login from './login.png'
import axios from 'axios';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Dialog from "@material-ui/core/Dialog";

function Authentication(props) {

    const classes = useStyles(props);
    const [screen, setScreen] = useState(false);                                            //to load the respective screen accodingle
    const [identity, setIdentity] = useState('');
    const [name, setName] = useState('');                                           //store the identity of user
    const [openSignin, setOpenSignin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const deleteCookie = async (e) => {                                                     //function to logout and delete cookies
        try {
            e.preventDefault();
            console.log("logout");
            await axios.get('http://localhost:4000/api/logout', { withCredentials: true });
            setScreen(false);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const readCookie = async () => {                                                         //function to read cookies
        try {
            const res = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
            console.log("cook");
            console.log(screen);
            //setScreen(res.data.isAuth);
            if (res.data.isAuth === true) {
                setScreen(res.data.isAuth);
                console.log(screen);
                setIdentity(res.data.email);
                setName(res.data.name);
                console.log(identity);
                console.log(res.data);

            }
        } catch (e) {
            setScreen(false);
            console.log(e);
        }
    };

    useEffect(() => {
        readCookie();
    }, []);

    return (

        <div className="App">
            {
                (screen === false)
                    ? <div className={classes.root}>

                        <div className={classes.logo}>
                            <img src={Logo} height="100%" width="55%" />
                        </div>

                        <ButtonBase
                            focusRipple
                            key='Signup'
                            className={classes.mainbutton}
                            focusVisibleClassName={classes.focus}
                            onClick={() => setOpenSignup(true)}
                        >

                            <span
                                className={classes.buttonbg}
                                style={{
                                    backgroundColor: '#008B8B'
                                }}
                            />

                            <span className={classes.buttonBackdrop} />

                            <span className={classes.longButton}>
                                <Typography
                                    component="span"
                                    variant="h5"
                                    color="inherit"
                                    className={classes.buttonTitle}
                                >
                                    Donot have an account? Sign up here
                                    <span className={classes.buttonMarked} />
                                </Typography>
                            </span>

                        </ButtonBase>

                        <ButtonBase
                            focusRipple
                            key='Login'
                            className={classes.mainbutton}
                            focusVisibleClassName={classes.focus}
                            onClick={() => setOpenSignin(true)}
                        >

                            <span
                                className={classes.buttonbg}
                                style={{
                                    backgroundColor: '#008B8B',
                                }}
                            />

                            <span className={classes.buttonBackdrop} />

                            <span className={classes.longButton}>
                                <Typography
                                    component="span"
                                    variant="h5"
                                    color="inherit"
                                    className={classes.buttonTitle}
                                >
                                    Already have an account? Log in here
                                    <span className={classes.buttonMarked} />
                                </Typography>
                            </span>

                        </ButtonBase>

                        <Dialog
                            open={openSignup}
                            onClose={() => setOpenSignup(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <Signup setScreen={setScreen} setOpenSignup={setOpenSignup} setIdentity={setIdentity} setName={setName} />
                        </Dialog>

                        <Dialog
                            open={openSignin}
                            onClose={() => setOpenSignin(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <Signin setScreen={setScreen} setOpenSignin={setOpenSignin} setIdentity={setIdentity} setName={setName} />
                        </Dialog>
                    </div>

                    : <App logout={deleteCookie} identity={identity} name={name} />

            }
        </div >
    );


}

export default Authentication;