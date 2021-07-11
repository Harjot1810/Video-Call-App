import "./App.css"
import React from 'react';

function Welcome(props) {  //for welcome screen

    return (
        <div className="animated-title">
            <div className="text-top">
                <div>
                    <span>Welcome</span>
                    <span>{props.name}</span>
                </div>
            </div>
            <div className="text-bottom">
                <div>Join a channel to continue</div>
            </div>
            <br />
            <br />
        </div>

    );
}

export default Welcome;