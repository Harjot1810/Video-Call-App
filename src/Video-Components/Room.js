import React, { Component } from 'react';
import '../Initial/App.css';
import Logo from '../Pictures/logoinverted.jpg'
import Attendee from './Attendee';
import AudioControl from './AudioControl';
import VideoControl from './VideoControl';
import CallEndIcon from '@material-ui/icons/CallEnd';
import PeopleIcon from '@material-ui/icons/People';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    Snackbar,
    Tooltip,
    Toolbar,
    Typography
} from "@material-ui/core";

class Room extends Component {

    constructor(props) {
        super(props);

        const existingPublications = Array.from(this.props.room.localParticipant.tracks.values());
        const existingTracks = existingPublications.map(publication => publication.track);
        const nonNullTracks = existingTracks.filter(track => track !== null)
        this.state = {
            attendeesList: Array.from(this.props.room.participants.values()), //Array of participants in room
            tracks: nonNullTracks,                                            //Track of local participant
            audioOff: false,                                                  //Audio track's state of local participant
            videoOff: false,                                                  //Video track'state of local participant
            setAttendeesOpen: false,
            setSnackbarOpen: false,
            snackBarmessage: ''
        }
        this.disconnectCall = this.disconnectCall.bind(this);                 //binding this to disconnectCall()
        this.changeAudio = this.changeAudio.bind(this);
        this.changeVideo = this.changeVideo.bind(this);
        this.handleAttendeesDialog = this.handleAttendeesDialog.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSnackbar = this.handleSnackbar.bind(this);
        this.changeSnackbarmessage = this.changeSnackbarmessage.bind(this);
    }

    componentDidMount() {
        // Add event listeners for future remote participants coming or going
        this.props.room.on('participantConnected', attendee => this.connectAttendee(attendee));
        this.props.room.on('participantDisconnected', attendee => this.disconnectAttendee(attendee));
        this.props.room.on('dominantSpeakerChanged', attendee => this.CurrentSpeaker(attendee));
        window.addEventListener("beforeunload", this.disconnectCall);
    }

    componentWillUnmount() {
        //Disconnection happens when component unmounts
        this.disconnectCall();
    }

    connectAttendee(attendee) {
        console.log(`${attendee.identity} has joined the call.`);
        this.setState({
            //Update attendeesList
            attendeesList: [...this.state.attendeesList, attendee]
        });
    }

    disconnectAttendee(attendee) {
        console.log(`${attendee.identity} has left the call`);
        this.setState({
            //Update attendeesList
            attendeesList: this.state.attendeesList.filter(p => p.identity !== attendee.identity)
        });
    }

    disconnectCall() {
        this.props.room.disconnect();
        this.props.backtoHome();
    }

    CurrentSpeaker(attendee) {
        //Update dominant speaker
        this.setState({
            dominantSpeaker: attendee ? attendee.identity : null
        });
    }

    changeAudio(track) {
        //Reviewing state of audio track of local Participant
        if (this.state.audioOff) {
            track.enable();
        } else {
            track.disable()
        }

        this.setState({
            audioOff: !this.state.audioOff
        });
    }

    changeVideo(track) {
        //Reviewing state of video track of local participant
        if (this.state.videoOff) {
            track.enable();
        } else {
            track.disable()
        }

        this.setState({
            videoOff: !this.state.videoOff
        });
    }

    handleAttendeesDialog() {
        this.setState({
            setAttendeesOpen: true
        })
    }

    handleClose() {
        this.setState({
            setAttendeesOpen: false
        })
    }

    handleSnackbar() {
        this.setState({
            setSnackbarOpen: true
        })
    }

    changeSnackbarmessage(message) {
        this.setState({
            snackBarmessage: message
        })
    }

    render() {

        const styles = {
            div: {
                display: 'flex',
                flexDirection: 'row wrap',
                padding: 20,
                width: '100%',
            },
            root: {
                flexGrow: 1,
            },
            title: {
                flexGrow: 1,
                marginLeft: 10,
            },
            toolbarButtons: {
                marginLeft: 'auto',
            },
        };

        return (

            <div className="room">

                <CssBaseline />

                <Grid id="appbar" style={styles.root}>
                    <AppBar position="fixed" style={{ zIndex: 1401, background: '#008B8B' }}>
                        <Toolbar variant="dense">
                            <img src={Logo} height="15%" width="4%" alt="" />
                            <Typography variant="h6" style={styles.title}>
                                <Box fontWeight="fontWeightBold" m={1}>
                                    Video Room
                                </Box>
                            </Typography>

                            <div style={styles.toolbarButtons}>

                                <Tooltip title="Microphone" arrow>
                                    <IconButton color="inherit" aria-label="Mic">
                                        {
                                            this.state.tracks.map((track, track_id) =>
                                                track && track.kind === 'audio'
                                                    ?
                                                    <AudioControl key={track_id}
                                                        changeAudio={this.changeAudio}
                                                        audioOff={this.state.audioOff}
                                                        track={track}
                                                    />
                                                    : '')
                                        }
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Video" arrow>
                                    <IconButton color="inherit" aria-label="Video">
                                        {
                                            this.state.tracks.map((track, track_id) =>
                                                track && track.kind === 'video'
                                                    ?
                                                    <VideoControl key={track_id}
                                                        changeVideo={this.changeVideo}
                                                        videoOff={this.state.videoOff}
                                                        track={track}
                                                    />
                                                    : '')
                                        }
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Leave Call" arrow>
                                    <IconButton color="secondary" variant="fab" onClick={this.disconnectCall} aria-label="call end">
                                        <CallEndIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Participants" arrow>
                                    <IconButton aria-label="participants"
                                        color="inherit"
                                        onClick={this.handleAttendeesDialog}>
                                        <Badge badgeContent={this.state.attendeesList.length} color="primary">
                                            <PeopleIcon fontSize="large" />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>

                            </div>
                        </Toolbar>
                    </AppBar>
                </Grid>

                <Toolbar />

                <Grid
                    id="main"
                    container
                    justify="center"
                    alignItems="center"
                    style={{ height: "inherit" }}>

                    <main key={this.props.room.localParticipant.identity}
                        style={this.state.setChatOpen ? styles.shiftTextLeft : styles.shiftTextRight}>

                        <div style={styles.div}>

                            <Grid container>
                                <Grid item>
                                    <Attendee key={this.props.room.localParticipant.identity}
                                        dominantSpeaker={this.state.dominantSpeaker}
                                        localParticipant="true"
                                        attendee={this.props.room.localParticipant}
                                        pushMessage={this.pushMessage}
                                        id={this.props.room.localParticipant.identity}
                                    />
                                </Grid>
                                {
                                    this.state.attendeesList.map(attendee =>
                                        <Grid item>
                                            <Attendee key={attendee.identity}
                                                dominantSpeaker={this.state.dominantSpeaker}
                                                attendee={attendee}
                                                pushMessage={this.pushMessage}
                                                id={attendee.identity}
                                                snackBar={this.handleSnackbar}
                                                changeSnackbarmessage={this.changeSnackbarmessage} />
                                        </Grid>
                                    )
                                }
                            </Grid>

                        </div>
                    </main>
                </Grid>

                <div>
                    <Dialog
                        open={this.state.setAttendeesOpen}
                        onClose={this.handleClose}
                        scroll='paper'
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                    >
                        <DialogTitle id="scroll-dialog-title">
                            Others in Call
                        </DialogTitle>

                        <DialogContent>
                            <Grid container>
                                {
                                    this.state.attendeesList.map((attendee, id) =>
                                        <List key={id}>
                                            <Grid item>
                                                <Avatar
                                                    variant="rounded"
                                                    style={{ backgroundColor: "Blue" }}>
                                                    {attendee.identity.charAt(0)}
                                                </Avatar>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h6">
                                                    {attendee.identity}
                                                    <br />
                                                </Typography>
                                            </Grid>
                                            <Divider />
                                        </List>
                                    )
                                }
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>

                    </Dialog>
                </div>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.setSnackbarOpen}
                    autoHideDuration={6000}
                    message={this.state.snackBarmessage}
                    onClose={(event, reason) => {
                        if (reason === 'clickaway') {
                            return;
                        }
                        this.setState({
                            setSnackbarOpen: false
                        });
                    }}
                />

            </div >
        );
    }
}

export default Room;

