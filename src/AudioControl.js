import './Initial/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';



function AudioControl(props) {
    //assign the correct symbol
    let icon;

    if (props.audioOff) {
        icon = faMicrophoneSlash;
    } else {
        icon = faMicrophone;
    }

    return (

        <div className="audiocontrol">
            <FontAwesomeIcon icon={icon} onClick={() => props.changeAudio(props.track)} />
        </div>

    );

}

export default AudioControl;