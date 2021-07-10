/*import React, { Component } from 'react';
import './Initial/App.css';
import PanToolIcon from '@material-ui/icons/PanTool';


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
                    console.log(this.state.raiseHand);
                    console.log(this.props.raiseHand);
                });
            }
        }
    }

    render() {
        return (
            <div>

                <div className="track" ref={this.ref}>
                    {this.state.raiseHand || this.props.raiseHand === true ?
                        this.props.track && this.props.track.kind === 'data'
                            ? <div className="raisehand">{
                                <PanToolIcon />
                            }
                            </div>
                            : ''
                        : ''
                    }
                </div>
            </div>
        )
    }
}

export default Track;*/

import React, { Component } from 'react';
import './Initial/App.css';
import PanToolIcon from '@material-ui/icons/PanTool';


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
                    if (message === 'true') {
                        this.props.snackBar();
                        this.props.changeSnackbarmessage(`${this.props.id} has raised hand`);
                    }
                    this.setState({ raiseHand: message === 'true' ? true : false });
                });
            }
        }
    }

    render() {
        return (
            <div>

                <div className="track" ref={this.ref}>
                    {this.state.raiseHand ? <div className="raisehand">{
                        <PanToolIcon />
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




