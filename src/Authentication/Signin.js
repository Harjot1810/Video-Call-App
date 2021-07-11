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

function Signin(props) {

    const classes = useStyles(props);
    const { setScreen, setOpenSignin, setIdentity, setName } = props;
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [signinError, setsigninError] = useState('');
    const [isLoading, setLoading] = useState(false);


    const signin = async (e) => {                                                           //function for login into the app
        try {
            e.preventDefault();
            setLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email: email, password: password }, { withCredentials: true });
            if (res.data.isAuth === true || res.data.error === true) {
                console.log(res.data);
                const res1 = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, { withCredentials: true });
                setIdentity(res1.data.email);
                setName(res1.data.name);
                setScreen(res.data.isAuth);
                setsigninError('');
                setOpenSignin(false);
            }
            else if (res.data.isAuth === false) {
                setsigninError(res.data.message);
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
                            Already have an account?
                        </Typography>

                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>

                        <form className={classes.form} noValidate>

                            <TextField
                                error={signinError !== ''}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoFocus
                                onChange={event => setEmail(event.target.value)}
                            />

                            <TextField
                                error={signinError !== ''}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={event => setPassword(event.target.value)}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={event => signin(event)}
                            >
                                Sign In
                            </Button>
                            {(isLoading === true) ? <div className="progress">Connecting</div> : <div></div>}
                            <Typography variant="subtitle2" style={{ color: "red" }}>
                                {signinError}
                            </Typography>
                        </form>
                    </div>
                    <Box mt={8}>
                    </Box>
                </Container>
            </Paper>
        </Grid>
    );


}

export default Signin;