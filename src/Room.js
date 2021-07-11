import React, { Component } from 'react';
import './Initial/App.css';
import Snackbar from '@material-ui/core/Snackbar';
import Logo from './logoinverted.jpg'
import Attendee from './Attendee';
import AudioControl from './AudioControl';
import VideoControl from './VideoControl';
import { Paper, Grid } from "@material-ui/core";
import CallEndIcon from '@material-ui/icons/CallEnd';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import PeopleIcon from '@material-ui/icons/People';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';

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
            appbar: {
                zIndex: 2000,
                background: '#2E3B55',
                marginRight: 360,
                background: '#008B8B'

            },
            root: {
                flexGrow: 1,
            },
            title: {
                flexGrow: 1,
                marginLeft: 10
            },
            toolbarButtons: {
                marginLeft: 'auto',

            },
        };

        return (

            <div className="room">

                <CssBaseline />

                <Grid id="appbar" style={styles.root}>
                    <AppBar position="fixed" style={styles.appbar} style={{ zIndex: 1401, background: '#008B8B' }}>
                        <Toolbar variant="dense">
                            <img src={Logo} height="15%" width="4%" />
                            <Typography variant="h6" style={styles.title}>
                                Video Room
                            </Typography>

                            <div style={styles.toolbarButtons}>

                                <Tooltip title="Microphone" arrow>
                                    <IconButton color="inherit">
                                        {
                                            this.state.tracks.map((track, track_id) =>
                                                track && track.kind == 'audio'
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
                                    <IconButton color="inherit">
                                        {
                                            this.state.tracks.map((track, track_id) =>
                                                track && track.kind == 'video'
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
                                    <IconButton color="secondary" variant="fab" onClick={this.disconnectCall}>
                                        <CallEndIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Participants" arrow>
                                    <IconButton
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
                            <DialogContentText
                                id="scroll-dialog-description"
                                tabIndex={-1}>
                                {
                                    this.state.attendeesList.map(attendee =>
                                        <List>
                                            <Avatar variant="rounded" style={{ backgroundColor: "Blue" }}>{attendee.identity.charAt(0)}</Avatar>
                                            <Typography variant="h6">{attendee.identity}</Typography>
                                            <Divider />
                                        </List>
                                    )
                                }
                            </DialogContentText>
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

