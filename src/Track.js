import React, { Component } from 'react';
import './App.css';
/*import AVreview from './AVreview';
import ChatDisplay from './ChatDisplay';*/

class Track extends Component {
    constructor(props) {
        super(props)

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
                    this.props.messages.push(message);
                    console.log(message);
                });
            }
        }
    }

    render() {
        return (
            <div>

                <div className="track" ref={this.ref}>



                </div>
            </div>
        )
    }
}

export default Track;
