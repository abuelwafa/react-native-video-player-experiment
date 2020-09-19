import React, { useRef, useState, useEffect, RefObject, useContext } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Button,
    Platform,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Modal from 'react-native-modal';

import { SoundOnIcon } from './icons/sound-on-icon';
import { SoundMutedIcon } from './icons/sound-muted-icon';
import { EnterFullscreenIcon } from './icons/enter-fullscreen-icon';
import { ExitFullscreenIcon } from './icons/exit-fullscreen-icon';

const { width } = Dimensions.get('window');

const iconProps = { width: 25, height: 25, fill: '#fff' };

const styles = StyleSheet.create({
    container: { backgroundColor: '#bbb' },
    fullscreenVideo: {
        ...StyleSheet.absoluteFillObject,
    },
    video: {
        width,
        height: (width * 9) / 16,
        backgroundColor: 'black',
    },
    seekbarContainer: {
        padding: 15,
        backgroundColor: '#dedede',
        justifyContent: 'center',
    },
    seekbar: {
        height: 3,
        backgroundColor: '#333',
        // position: 'absolute'
    },
    seekHandler: {
        borderRadius: 20,
        width: 20,
        height: 20,
        backgroundColor: 'red',
        position: 'absolute',
        left: 5,
    },
    iconButton: {
        padding: 6,
        backgroundColor: 'rgba(128, 128, 128, 0.4)',
        position: 'absolute',
    },
});

const formatSecondsTime = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const VideoPlayerContext = React.createContext({
    currentlyPlaying: null,
    setCurrentlyPlaying: () => {},
});

const PlayerProvider = ({ children }) => {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    return (
        <VideoPlayerContext.Provider value={{ currentlyPlaying, setCurrentlyPlaying }}>
            {children}
        </VideoPlayerContext.Provider>
    );
};

interface VideoPlayerProps extends VideoProperties {
    src: string;
    skipInterval?: number;
    showSkipButtons?: boolean;
    showPlaylistControls?: boolean;
    onNextVideo?: () => void;
    onPreviousVideo?: () => void;
}

// change to controlled component api
// finish uncontrolled component
// play / pause / stop
// seek
// playback rate
// thumbnail
// duration display --- done
// volume control
// callbacks
// loading/buffering state and ui
// handle back button on android full screen
// subtitles support
// theming - customizing styling

// next video / previous video --- done
// mute --- done
// fullscreen --- done
// seek 15sec buttons --- done

type VideoProps = VideoProperties & { key: string; ref: RefObject<Video | null> };

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    showSkipButtons = false,
    skipInterval = 10,
    repeat = false,
    onPreviousVideo = () => {},
    onNextVideo = () => {},
    ...rest
}) => {
    const inlineVideoRef = useRef<Video>(null);
    const fullscreenVideoRef = useRef<Video>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPostiion] = useState(0);
    const [playableDuration, setPlayableDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [seekableDuration, setSeekableDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);

    const { currentlyPlaying, setCurrentlyPlaying } = useContext(VideoPlayerContext);
    const isPlaying = currentlyPlaying === src;

    let showControlsTimeoutId: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);
    const resetShowControlsTimeout = () => {
        console.log('resetShowControlsTimeout called', { id: showControlsTimeoutId.current });

        if (showControlsTimeoutId.current) {
            clearTimeout(showControlsTimeoutId.current);
        }
        setShowControls(true);
        showControlsTimeoutId.current = setTimeout(() => setShowControls(false), 3000);
    };

    // clear timeout on showControlsTimeout on unmount
    useEffect(
        () => () => {
            showControlsTimeoutId.current && clearTimeout(showControlsTimeoutId.current);
        },
        [showControlsTimeoutId.current],
    );

    // const seekPanOffset = useRef(new Animated.Value(0)).current;
    // const seekBarWidth = useRef(new Animated.Value(100)).current;

    const commonVideoProps: VideoProperties = {
        controls: true,
        repeat,
        paused: !isPlaying,
        fullscreenAutorotate: true,
        fullscreenOrientation: 'landscape',
        ...rest,
        source: { uri: src },
        volume: muted ? 0 : volume,
        onLoad: ({ duration }) => setDuration(duration),
        onProgress: ({ currentTime, playableDuration, seekableDuration }) => {
            setPostiion(currentTime);
            setPlayableDuration(playableDuration);
            setSeekableDuration(seekableDuration);
        },
    };

    const inlineVideoProps: VideoProps = {
        ...commonVideoProps,
        key: src,
        style: [styles.video, rest.style],
        resizeMode: 'contain',
        ref: inlineVideoRef,
    };

    const fullScreenVideoProps: VideoProps = {
        ...commonVideoProps,
        key: src,
        resizeMode: 'cover',
        ref: fullscreenVideoRef,
        style: styles.fullscreenVideo,
    };

    const isLoading = isPlaying && playableDuration - position <= 0;

    return (
        <View style={styles.container}>
            {!fullScreen && (
                <>
                    <View>
                        <TouchableWithoutFeedback onPress={resetShowControlsTimeout}>
                            <Video {...inlineVideoProps} />
                        </TouchableWithoutFeedback>

                        {isLoading && (
                            <View style={styles.iconButton}>
                                <EnterFullscreenIcon {...iconProps} />
                            </View>
                        )}

                        {showControls && (
                            <>
                                {/* enter fullscreen button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        resetShowControlsTimeout();
                                        if (Platform.OS === 'ios') {
                                            videoRef.current.presentFullscreenPlayer();
                                        } else {
                                            setFullScreen(true);
                                            Orientation.lockToLandscape();
                                        }
                                    }}
                                    style={[styles.iconButton, { top: 10, right: 10 }]}>
                                    <EnterFullscreenIcon {...iconProps} />
                                </TouchableOpacity>

                                {/* toggle mute button */}
                                {muted ? (
                                    <TouchableOpacity
                                        style={[styles.iconButton, { top: 57, right: 10 }]}
                                        onPress={() => {
                                            resetShowControlsTimeout();
                                            setMuted(false);
                                        }}>
                                        <SoundMutedIcon {...iconProps} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.iconButton, { top: 57, right: 10 }]}
                                        onPress={() => {
                                            resetShowControlsTimeout();
                                            setMuted(true);
                                        }}>
                                        <SoundOnIcon {...iconProps} />
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                    </View>

                    <View>
                        <View>
                            <Text>
                                {formatSecondsTime(position)} / {formatSecondsTime(duration)}
                            </Text>
                            <Text>{playableDuration}</Text>
                            <Text>{seekableDuration}</Text>
                            <Text>{isLoading ? 'Loading' : '---'}</Text>
                        </View>
                        <Button
                            title="Play/Pause"
                            onPress={() => {
                                if (isPlaying) {
                                    setCurrentlyPlaying(null);
                                } else {
                                    setCurrentlyPlaying(src);
                                }
                            }}
                        />
                        <Button
                            title={`Skip ${skipInterval} sec`}
                            onPress={() => {
                                if (fullScreen) {
                                    fullscreenVideoRef.current?.seek(position + skipInterval);
                                } else {
                                    inlineVideoRef.current?.seek(position + skipInterval);
                                }
                            }}
                        />
                        <Button
                            title={`Back ${skipInterval} sec`}
                            onPress={() => {
                                if (fullScreen) {
                                    fullscreenVideoRef.current?.seek(position - skipInterval);
                                } else {
                                    inlineVideoRef.current?.seek(position - skipInterval);
                                }
                            }}
                        />
                    </View>
                </>
            )}

            {Platform.OS === 'android' && (
                <Modal
                    style={{ margin: 0, backgroundColor: 'black' }}
                    coverScreen={true}
                    visible={fullScreen}
                    supportedOrientations={['landscape']}
                    statusBarTranslucent={true}
                    transparent={true}>
                    <StatusBar hidden={fullScreen} />

                    <Video {...fullScreenVideoProps} />

                    <TouchableOpacity
                        onPress={() => {
                            setFullScreen(false);
                            Orientation.lockToPortrait();
                        }}
                        style={[styles.iconButton, { top: 10, right: 10 }]}>
                        <ExitFullscreenIcon {...iconProps} />
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};
export { VideoPlayer, PlayerProvider };
