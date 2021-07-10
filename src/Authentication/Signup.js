import React, { useState } from 'react';
import '../Initial/index.css';
import { useStyles } from './Styles.js'
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';


function Signup(props) {

    const classes = useStyles(props);
    const { setScreen, setOpenSignup, setIdentity, setName } = props;
    const [newemail, setnewEmail] = useState();
    const [newpassword, setnewPassword] = useState();
    const [newpassword2, setnewPassword2] = useState();
    const [newfname, setnewFname] = useState();
    const [newlname, setnewLname] = useState();
    const [signupError, setsignupError] = useState('');
    const [isLoading, setLoading] = useState(false);


    const signup = async (e) => {                                                   //function for new sign up
        try {
            e.preventDefault();
            setLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, { firstname: newfname, lastname: newlname, email: newemail, password: newpassword, password2: newpassword2 }, { withCredentials: true });
            if (res.data.success === true) {
                const res1 = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email: newemail, password: newpassword }, { withCredentials: true });
                const res2 = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, { withCredentials: true });
                setIdentity(res2.data.email);
                setName(res2.data.name);
                console.log(res1.data);
                setScreen(res1.data.isAuth);
                setsignupError('');
                setOpenSignup(false);
            }
            else if (res.data.success === false) {
                setsignupError("Failed! Try again!");
                setLoading(false);
            }
            else if (res.data.auth === false) {
                setsignupError(res.data.message);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Grid container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
        >
            <Paper elevation={3} >
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Typography variant="h6">
                            Do not have an account? create here
                        </Typography>

                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>

                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        error={signupError !== ''}
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        onChange={event => setnewFname(event.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        error={signupError !== ''}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        onChange={event => setnewLname(event.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        error={signupError !== ''}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        onChange={event => setnewEmail(event.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        error={signupError !== ''}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password (minimum 8 characters)"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        onChange={event => setnewPassword(event.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        error={signupError !== ''}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="confirm password"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirm password"
                                        autoComplete="current-password"
                                        onChange={event => setnewPassword2(event.target.value)}
                                    />
                                </Grid>

                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={event => signup(event)}
                            >
                                Sign Up
                            </Button>
                            {(isLoading === true) ? <div className="progress">Connecting</div> : <div></div>}
                            <Typography variant="subtitle2" style={{ color: "red" }}>
                                {signupError}
                            </Typography>
                        </form>
                        <Box mt={8}>
                        </Box>
                    </div>
                </Container>
            </Paper>
        </Grid>
    );

}

export default Signup;