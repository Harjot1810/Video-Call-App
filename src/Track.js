import React, { Component } from 'react';
import './Initial/App.css';


class Track extends Component {
    constructor(props) {
        super(props)
        this.state = {
            raiseHand: false,
            trackOff: false
        }

        //access DOM element in order to attatch the track
        this.ref = React.createRef();

    }

    componentDidMount() {
        //uses the ref to attach the track object’s associated audio or video element to the DOM
        if (this.props.track !== null) {
            if (this.props.track.kind !== 'data') {
                const child = this.props.track.attach();
                this.ref.current.classList.add(this.props.track.kind);
                this.ref.current.appendChild(child);

            } else {
                this.props.track.on('message', message => {
                    this.setState({ raiseHand: message });
                });
            }
        }
    }

    render() {
        return (
            <div>

                <div className="track" ref={this.ref}>
                    {
                        this.props.track && this.props.track.kind === 'data'
                            ? <div>{
                                this.state.raiseHand || this.props.raiseHand === true ?
                                    <h4>handraised</h4> : ''

                            }
                            </div>
                            : ''
                    }
                </div>
            </div>
        )
    }
}

export default Track;




