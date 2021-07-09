import "./App.css"
import React, { Component } from 'react';
import { PinDropRounded } from "@material-ui/icons";

function Welcome(props) {
    return (
        <div class="animated-title">
            <div class="text-top">
                <div>
                    <span>Welcome</span>
                    <span>{props.identity}</span>
                </div>
            </div>
            <div class="text-bottom">
                <div>Join a channel to continue</div>
            </div>
        </div>

    );
}

export default Welcome;