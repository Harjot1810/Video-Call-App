import React, { Component } from 'react';
import './Initial/App.css';
import Track from './Track';


class Attendee extends Component {

    constructor(props) {
        super(props);

        const existingPublications = Array.from(this.props.attendee.tracks.values());             //Get all the tracks of attendees
        const existingTracks = existingPublications.map(publication => publication.track);
        const nonNullTracks = existingTracks.filter(track => track !== null)

        this.state = {
            tracks: nonNullTracks, //audio, video and data tracks of all the attendees
            raiseHand: false
        }

        this.changeraiseHand = this.changeraiseHand.bind(this);

    }

    componentDidMount() {
        //adding event listeners
        if (!this.props.localParticipant) {
            // when someone subscribes to one a new remote participants audio or video tracks (subscription by local participant happens automatically)
            this.props.attendee.on('trackSubscribed', track => this.addTrack(track));
            // when a remote participant joins the room and publishes a new data track
            this.props.attendee.on('trackPublished', publication => this.addTrack(publication.track));
        }
    }

    addTrack(track) {
        this.setState({
            tracks: [...this.state.tracks, track]    //Update tracks whenever a track is published or subscribed
        });
    }

    changeraiseHand() {
        const dataTrack = this.state.tracks.find(track => track.kind == "data");
        dataTrack.send(!this.state.raiseHand);
        this.setState({ raiseHand: !this.state.raiseHand });

    }

    render() {
        const isDominantSpeaker = this.props.dominantSpeaker === this.props.attendee.identity ? 'dominantSpeaker' : '';
        return (

            <div className={`attendee ${isDominantSpeaker}`} id={this.props.attendee.identity}>
                <div className="identity">{this.props.attendee.identity}</div>
                {
                    this.props.localParticipant
                        ? <div classname="raisehand"><button className="standard-button" onClick={this.state.changeraiseHand}>Raise hand</button></div>
                        : ''
                }
                {

                    this.state.tracks.map(track =>
                        <Track key={track}
                            track={track}
                            raiseHand={this.state.raiseHand}
                            local={this.props.localParticipant}
                            snackBar={this.props.snackBar}
                            changeSnackbarmessage={this.props.changeSnackbarmessage}
                            pushMessage={this.props.pushMessage} id={this.props.id} />
                    )

                }
            </div>

        );
    }
}

export default Attendee;