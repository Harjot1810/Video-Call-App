import './App.css';
import React, { Component } from 'react';
import Room from '../Video-Components/Room';
import Welcome from './Welcome'
import ChatScreen from '../Chat-Components/ChatScreen';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
    Backdrop,
    CircularProgress,
    Button,
    Grid,
    ListItem,
    Typography,
    Avatar,
    TextField,
    Paper,
    List,
    Divider,
    CssBaseline,
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
            room: null,
            channelName: '',
            loading: false,
            client: null,
            token: null,
            channels: [],
            showChat: false
        }
        this.nameField = React.createRef();                 //creating Reference 
        this.connectCall = this.connectCall.bind(this);     //Invoked to connect to room
        this.backtoHome = this.backtoHome.bind(this);       //Invoked when call is diconnected
        this.changeChannel = this.changeChannel.bind(this); //Change Room id when user enters room name
        this.toggleChat = this.toggleChat.bind(this);       //to toggle open or close chat
        this.joinRecent = this.joinRecent.bind(this);       //to join channel from recents
    }

    getToken = async () => {                                //get twilio access token
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/token`, { withCredentials: true });
        const { data } = response;
        return data.accessToken;
    }

    componentDidMount = async () => {
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
        clientChannels.items.map(item =>
            this.setState({
                channels: [...this.state.channels, item.channelState.uniqueName]
            })
        );

        client.on("channelAdded", (item) => {
            this.setState({
                channels: [...this.state.channels, item.channelState.uniqueName]
            })
        });

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

    async connectCall() {
        try {
            this.setState({
                loading: true,
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

            this.setState({ room: room, loading: false });
        } catch (err) {
            console.log(err);
        }
    }

    toggleChat() {
        this.setState({
            showChat: !this.state.showChat
        });
    }

    joinRecent(channel) {
        this.setState({
            channelName: channel,
            showChat: true
        });
    }

    backtoHome() {                          //invoked when user clicks Leave call button
        this.setState({ room: null });
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

                    <Backdrop open={this.state.loading} style={{ zIndex: 99999 }}>
                        <CircularProgress style={{ color: "white" }} />
                    </Backdrop>

                    <Grid container spacing={1} justify="center" alignItems="center" >
                        <Grid item xs={this.state.room === null ? 3 : 9} >
                            <Paper className={this.state.room === null ? classes.paperleft : classes.paperleftroom} >
                                {
                                    this.state.showChat === false
                                        ? <div style={{ paddingTop: 70 }}>
                                            <List>
                                                <li>
                                                    <Avatar className={classes.avatar}>
                                                        {this.props.name.charAt(0)}
                                                    </Avatar>
                                                    <h2>{this.props.name}</h2>
                                                </li>
                                            </List>
                                            <Divider />

                                            <List>
                                                <li>
                                                    <h2 className="mt-2">Create new channel here</h2>
                                                    <TextField
                                                        style={{ marginLeft: "20%", marginBottom: 20 }}
                                                        variant="outlined"
                                                        required
                                                        name="channel name"
                                                        label="Enter Channel Name"
                                                        type="name"
                                                        id="name"
                                                        value={this.state.channelName}
                                                        onChange={this.changeChannel}
                                                    />
                                                    <br />
                                                    <button className="standard-button" disabled={disabled} onClick={this.toggleChat}>Join</button>
                                                </li>
                                            </List>
                                            <Divider />

                                            <List style={{ maxHeight: 275, overflow: 'auto' }}>
                                                <li>
                                                    <h2 className="mt-2">Recents</h2>
                                                    {
                                                        this.state.channels.length > 0 ?
                                                            this.state.channels.map((channel, id) =>
                                                                <ListItem key={id} button onClick={() => this.joinRecent(channel)}>
                                                                    <Typography variant="h6">{channel}</Typography>
                                                                    <Divider />
                                                                </ListItem>
                                                            )

                                                            : <h4 className="mt-2">No recent conversations</h4>
                                                    }
                                                </li>
                                            </List>
                                            <Divider />

                                            <List>
                                                <li>
                                                    <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                                                </li>
                                            </List>
                                        </div>

                                        : this.state.room === null
                                            ? <div style={{ paddingTop: 70 }}>
                                                <List>
                                                    <li>
                                                        <Avatar className={classes.avatar}>
                                                            {this.props.name.charAt(0)}
                                                        </Avatar>
                                                        <h2>{this.props.name}</h2>
                                                        <br />
                                                    </li>
                                                </List>
                                                <Divider />

                                                <List>
                                                    <li>
                                                        <h2 className="mt-2">Current channel: {this.state.channelName}</h2>
                                                        <Button
                                                            onClick={this.connectCall}
                                                            startIcon={<VideoCallIcon />}
                                                            variant="contained"
                                                            color="primary"
                                                            style={{ backgroundColor: "#262d31", borderWidth: 3, marginLeft: "30%" }}>
                                                            Join Video
                                                        </Button>
                                                    </li>
                                                </List>
                                                <List>
                                                    <li>
                                                        <Button
                                                            onClick={this.toggleChat}
                                                            startIcon={<ExitToAppIcon />}
                                                            variant="contained"
                                                            color="primary"
                                                            style={{ backgroundColor: "#262d31", borderWidth: 3, marginLeft: "25%" }}>
                                                            Leave Channel
                                                        </Button>
                                                    </li>
                                                </List>
                                                <Divider />

                                                <List style={{ maxHeight: 275, overflow: 'auto' }}>
                                                    <li>
                                                        <h2 className="mt-2">Recents</h2>
                                                        {
                                                            this.state.channels.length > 0 ?
                                                                this.state.channels.map((channel, id) =>
                                                                    <ListItem key={id} button onClick={() => this.joinRecent(channel)}>
                                                                        <Typography variant="h6">{channel}</Typography>
                                                                        <Divider />
                                                                    </ListItem>
                                                                )

                                                                : <h4 className="mt-2">No recent conversations</h4>
                                                        }
                                                    </li>
                                                </List>
                                                <Divider />

                                                <List>
                                                    <li>
                                                        <button className="standard-button" onClick={e => this.props.logout(e)}>Logout</button>
                                                    </li>
                                                </List>
                                            </div>

                                            : <Room
                                                backtoHome={this.backtoHome}
                                                room={this.state.room}
                                                channelName={this.state.channelName} />}
                            </Paper>
                        </Grid>

                        <Grid item xs={this.state.room === null ? 9 : 3}>
                            <Paper className={this.state.room === null ? classes.paperright : classes.paperrightroom}  >
                                {this.state.showChat === false
                                    ? <div>
                                        <Welcome name={this.props.name} />
                                    </div>
                                    : <ChatScreen
                                        room={this.state.channelName}
                                        identity={this.props.identity}
                                        connectCall={this.connectCall}
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

