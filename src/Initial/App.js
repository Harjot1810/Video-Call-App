import './App.css';
import React, { Component } from 'react';
import Room from '../Room';
import Welcome from './Welcome'
import ChatScreen from '../Chat-Components/ChatScreen';
import axios from 'axios';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import {
    Backdrop,
    CircularProgress,
    Button,
    Grid
} from "@material-ui/core";
import VideoCallIcon from '@material-ui/icons/VideoCall';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { styles } from './Styles.js'
const { connect, LocalDataTrack } = require('twilio-video'); //Importing twilio-javascript SDK and Data API
const Chat = require("twilio-chat");


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            room: null,
            channelName: '',
            proceed: false,
            loading: false,
            client: null,
            token: null,
            channels: [],
            showChat: false
        }
        this.nameField = React.createRef();              //creating Reference 
        this.connectCall = this.connectCall.bind(this);  //Invoked to connect to room
        this.backtoHome = this.backtoHome.bind(this);    //Invoked when call is diconnected
        this.changeState = this.changeState.bind(this);  //Change state of isLoading
        this.changeChannel = this.changeChannel.bind(this);//Change Room id when user enters room name
        this.changeScreen = this.changeScreen.bind(this);    //change Room name
        this.toggleChat = this.toggleChat.bind(this);
    }

    getToken = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/token`, { withCredentials: true });
        const { data } = response;
        return data.accessToken;
    }

    componentDidMount = async () => {
        console.log("here")
        const room = this.state.channelName
        const identity = this.props.identity
        let token = "";

        if (!identity) {
            return
        }

        this.setState({ loading: true });

        try {
            token = await this.getToken(identity);
            this.setState({ token: token });

        } catch {
            throw new Error("Unable to get token, please reload this page");
        }

        const client = await Chat.Client.create(token);

        const clientChannels = await client.getSubscribedChannels()
        console.log(clientChannels.items[0].channelState.uniqueName);
        clientChannels.items.map(item =>
            this.setState({
                channels: [...this.state.channels, item.channelState.uniqueName]
            })
        );

        client.on("tokenAboutToExpire", async () => {
            const token = await this.getToken(identity);
            client.updateToken(token);
        });

        client.on("tokenExpired", async () => {
            const token = await this.getToken(identity);
            client.updateToken(token);
        });

        if (!client)
            return;

        this.setState({ client: client, loading: false });

    }

    toggleChat() {
        this.setState({
            showChat: !this.state.showChat
        });
    }

    async connectCall() {
        try {
            this.setState({
                isLoading: true,
            });

            const room = await connect(this.state.token, {
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

    connectChat() {
        if (this.state.channelName !== '') { return }
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
                <div className={classes.root}>
                    <CssBaseline />
                    <Grid container spacing={1}>
                        <Grid item xs={this.state.room === null ? 3 : 9} justify="center"
                            alignItems="center">
                            <Paper className={classes.paperleft}>
                                {
                                    this.state.showChat === false
                                        ? <div style={{ paddingTop: 70 }}><List>
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
                                                    value={this.state.channelName}
                                                    onChange={this.changeChannel}
                                                />
                                                <br />
                                                <button className="standard-button" disabled={disabled} onClick={this.toggleChat}>Join</button>
                                                <Backdrop open={this.state.loading} style={{ zIndex: 99999 }}>
                                                    <CircularProgress style={{ color: "white" }} />
                                                </Backdrop>
                                            </List>
                                            <Divider />
                                            <List>
                                                <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                                            </List></div>

                                        : this.state.room === null
                                            ? <div style={{ paddingTop: 70 }}><List>
                                                <Avatar className={classes.avatar}>
                                                    {this.props.name.charAt(0)}
                                                </Avatar>
                                                <h2>{this.props.name}</h2>
                                                <br />
                                            </List>
                                                <Divider />
                                                <List>
                                                    <h2 className="mt-2">Current channel: {this.state.channelName}</h2>
                                                    <Button
                                                        onClick={this.connectCall}
                                                        startIcon={<VideoCallIcon />}
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ backgroundColor: "#262d31", borderWidth: 3, }}>
                                                        Join Video
                                                    </Button>
                                                    <Button
                                                        onClick={this.toggleChat}
                                                        startIcon={<ExitToAppIcon />}
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ backgroundColor: "#262d31", borderWidth: 3, }}>
                                                        Leave Channel
                                                    </Button>
                                                </List>
                                                <Divider />
                                                <List>
                                                    <h2 className="mt-2">Recents</h2>
                                                    {
                                                        this.state.channels.map(channel =>
                                                            <List>
                                                                <Typography variant="h6">{channel}</Typography>
                                                                <Divider />
                                                            </List>
                                                        )
                                                    }
                                                </List>
                                                <Divider />
                                                <List>
                                                    <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                                                </List></div>

                                            : <Room
                                                backtoHome={this.backtoHome}
                                                room={this.state.room}
                                                client={this.state.client}
                                                channelName={this.state.channelName} />}

                            </Paper>
                        </Grid>
                        <Grid item xs={this.state.room === null ? 9 : 3}>
                            <Paper className={classes.paperright}>
                                {this.state.showChat === false
                                    ? <div>
                                        <Welcome name={this.props.name} />
                                    </div>
                                    : <ChatScreen
                                        room={this.state.channelName}
                                        identity={this.props.identity}
                                        connectCall={this.connectCall}
                                        isLoading={this.state.isLoading}
                                        client={this.state.client}
                                        video={this.state.room} />
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div >
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(App);

/* <Drawer
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
                            <button className="standard-button" disabled={disabled} onClick={this.connectChat}>Join</button>
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

                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{ paper: classes.drawerPaper }}
                        anchor="right"
                    >
                        {this.state.client !== null
                            ?
                            <ChatScreen
                                room={this.state.channelName}
                                identity={this.props.identity}
                                connectCall={this.connectCall}
                                isLoading={this.state.isLoading}
                                client={this.state.client}
                                video={this.state.room} />
                            : "Chat will appear here"}

                    </Drawer>

                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {this.state.client === null ?
                            <Paper elevation={3}>
                                <Welcome name={this.props.name} />
                            </Paper> :
                            this.state.room === null
                                ? <Button
                                    onClick={this.connectCall}
                                    startIcon={<VideoCallIcon />}
                                    variant="contained"
                                    color="primary"
                                    style={{ backgroundColor: "#262d31", borderWidth: 3, marginTop: 70 }}>
                                    Join Video
                                </Button> : <Room
                                    backtoHome={this.backtoHome}
                                    room={this.state.room}
                                    client={this.state.client}
                                    channelName={this.state.channelName} />}
                        {(this.props.isLoading === true)
                            ? <div className="loader">Connecting</div>
                            : <div></div>}
                        <Backdrop open={this.state.loading} style={{ zIndex: 99999 }}>
                            <CircularProgress style={{ color: "white" }} />
                        </Backdrop>
                    </main>

                </div>*/

