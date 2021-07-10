import './App.css';
import React, { Component } from 'react';
import Room from '../Room';
import Welcome from './Welcome'
import ChatScreen from '../Chat-Components/ChatScreen';
import axios from 'axios';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { styles } from './Styles.js'
const { connect, LocalDataTrack } = require('twilio-video'); //Importing twilio-javascript SDK and Data API


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            room: null,
            channelName: '',
            proceed: false
        }
        console.log(this.props.identity);
        this.nameField = React.createRef();              //creating Reference 
        this.connectCall = this.connectCall.bind(this);  //Invoked to connect to room
        this.backtoHome = this.backtoHome.bind(this);    //Invoked when call is diconnected
        this.changeState = this.changeState.bind(this);  //Change state of isLoading
        this.changeChannel = this.changeChannel.bind(this);//Change Room id when user enters room name
        this.changeScreen = this.changeScreen.bind(this);    //change Room name
    }

    async connectCall() {
        try {
            this.setState({
                isLoading: true,
            });

            //fetching access token
            const signal = await axios.get('http://localhost:4000/api/token', { withCredentials: true });
            const store = await signal.data;
            const token = store.accessToken;
            const room = await connect(store.accessToken, {
                name: this.state.channelName,
                audio: true,
                video: true,
                dominantSpeaker: true,

            });

            //publishing a data track for chats
            const dataTrack = new LocalDataTrack();
            await room.localParticipant.publishTrack(dataTrack);

            this.setState({ room: room });
        } catch (err) {
            console.log(err);
        }
    }

    backtoHome() {                          //invoked when user clicks Leave call button
        this.setState({ room: null });
        this.setState({
            isLoading: false,
        });
    }


    changeState() {                         //update isLoading state
        this.setState({
            isLoading: true,

        });
    }

    changeScreen() {                          //update isLoading state
        this.setState({
            proceed: true,
        });
    }

    changeChannel(event) {                   //update room when user has entered roomname
        this.setState({
            channelName: event.target.value
        });

    }

    render() {
        const { classes } = this.props;
        const disabled = (this.state.channelName === '') ? true : false; //state of join button (disabled/enabled)
        return (
            <div className="app">
                {
                    this.state.room === null
                        ? <div className={classes.root}>
                            <CssBaseline />

                            <Drawer
                                className={classes.drawer}
                                variant="permanent"
                                classes={{ paper: classes.drawerPaper }}
                                anchor="left"
                            >
                                <List>
                                    <Avatar className={classes.avatar}>
                                        {this.props.name.charAt(0)}
                                    </Avatar>
                                    <h2>{this.props.name}</h2>
                                </List>
                                <Divider />

                                <List>
                                    <h2 className="mt-2">Fill the channel name to join</h2>
                                    <TextField
                                        style={{ marginLeft: 80, marginBottom: 20 }}
                                        variant="outlined"
                                        required
                                        name="channel name"
                                        label="Channel Name"
                                        type="name"
                                        id="name"
                                        onChange={this.changeChannel}
                                    />
                                    <br />
                                    <button className="standard-button" disabled={disabled} onClick={this.changeScreen}>Join</button>
                                </List>
                                <Divider />

                                <List>
                                    <Typography >Your Channels</Typography>
                                </List>
                                <Divider />

                                <List>
                                    <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                                </List>
                            </Drawer>

                            <main className={classes.content}>
                                <div className={classes.toolbar} />
                                {this.state.proceed === true
                                    ?
                                    <ChatScreen
                                        room={this.state.channelName}
                                        identity={this.props.identity}
                                        connectCall={this.connectCall}
                                        isLoading={this.state.isLoading}
                                        video={this.state.room} />
                                    :
                                    <Paper elevation={3}>
                                        <Welcome name={this.props.name} />
                                    </Paper>}
                            </main>

                        </div>
                        : <Room
                            backtoHome={this.backtoHome}
                            room={this.state.room}
                            channelName={this.state.channelName} />
                }
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(App);