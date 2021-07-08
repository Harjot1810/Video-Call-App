import './Initial/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';


function VideoControl(props) {
    //assign the correct symbol
    let icon;

    if (props.videoOff) {
        icon = faVideoSlash;
    } else {
        icon = faVideo;
    }

    return (

        <div className="videocontrol">
            <FontAwesomeIcon icon={icon} onClick={() => props.changeVideo(props.track)} />
        </div>
    );

}

export default VideoControl;
