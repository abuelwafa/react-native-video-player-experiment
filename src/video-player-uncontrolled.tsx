import React from 'react';

import { VideoPlayer } from './video-player';

const VideoPlayerUncontrolled = (props) => {
    const [playing, setPlaying] = useState(false);
    return (
        <VideoPlayer
            {...props}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            volume={1}
            onMute={() => {}}
            onUnMute={() => {}}
        />
    );
};
