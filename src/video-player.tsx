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
    ActivityIndicator,
} from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Modal from 'react-native-modal';

import { SoundOnIcon } from './icons/sound-on-icon';
import { SoundMutedIcon } from './icons/sound-muted-icon';
import { EnterFullscreenIcon } from './icons/enter-fullscreen-icon';
import { ExitFullscreenIcon } from './icons/exit-fullscreen-icon';
import { SeekForwardIcon } from './icons/seek-forward-icon';
import { SeekBackwardIcon } from './icons/seek-backward-icon';

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
    const [fullscreen, setFullscreen] = useState(false);
    const [duration, setDuration] = useState(0);
    const [inlineVideoPosition, setInlineVideoPosition] = useState(0);
    const [fullscreenVideoPosition, setFullscreenVideoPosition] = useState(0);
    const [playableDuration, setPlayableDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [seekableDuration, setSeekableDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [inlineVideoStarted, setInlineVideoStarted] = useState(false);
    const returnFromFullscreen = useRef(false);

    const { currentlyPlaying, setCurrentlyPlaying } = useContext(VideoPlayerContext);
    const isPlaying = currentlyPlaying === src;

    let showControlsTimeoutId: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);
    const resetShowControlsTimeout = () => {
        console.log('reset show controls timeout called...', videoLoaded);
        if (videoLoaded) {
            if (showControlsTimeoutId.current) {
                clearTimeout(showControlsTimeoutId.current);
            }
            setShowControls(true);
            showControlsTimeoutId.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    // clear timeout on showControlsTimeout on unmount
    useEffect(() => () => {
        showControlsTimeoutId.current && clearTimeout(showControlsTimeoutId.current);
    });

    // const seekPanOffset = useRef(new Animated.Value(0)).current;
    // const seekBarWidth = useRef(new Animated.Value(100)).current;

    const commonVideoProps: VideoProperties = {
        controls: false,
        repeat,
        paused: !isPlaying,
        fullscreenAutorotate: true,
        fullscreenOrientation: 'landscape',
        posterResizeMode: 'cover',
        ...rest,
        source: { uri: src },
        volume: muted ? 0 : volume,
        onLoad: ({ duration }) => {
            setDuration(duration);
            setVideoLoaded(true);
        },
    };

    const inlineVideoProps: VideoProps = {
        ...commonVideoProps,
        key: src,
        style: [styles.video],
        resizeMode: 'contain',
        ref: inlineVideoRef,
        onProgress: ({ currentTime, playableDuration, seekableDuration }) => {
            setInlineVideoPosition(currentTime);
            setPlayableDuration(playableDuration);
            setSeekableDuration(seekableDuration);
        },
        onLoad: (...params) => {
            commonVideoProps.onLoad(...params);
            if (inlineVideoRef.current && returnFromFullscreen.current) {
                inlineVideoRef.current.seek(fullscreenVideoPosition);
            }
        },
    };

    const fullscreenVideoProps: VideoProps = {
        ...commonVideoProps,
        key: src,
        resizeMode: 'cover',
        ref: fullscreenVideoRef,
        style: styles.fullscreenVideo,
        onLoad: (...params) => {
            commonVideoProps.onLoad(...params);
            if (fullscreenVideoRef.current) {
                fullscreenVideoRef.current.seek(inlineVideoPosition);
            }
        },
        onProgress: ({ currentTime, playableDuration, seekableDuration }) => {
            setFullscreenVideoPosition(currentTime);
        },
    };

    const isLoading = isPlaying && playableDuration - inlineVideoPosition <= 0;

    return (
        <>
            <View style={[styles.container, rest.style]}>
                {!fullscreen && (
                    <View
                        style={{
                            position: 'relative',
                            backgroundColor: 'lime',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <TouchableWithoutFeedback onPress={resetShowControlsTimeout}>
                            <Video {...inlineVideoProps} />
                        </TouchableWithoutFeedback>

                        {isLoading && !videoLoaded && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                }}>
                                <ActivityIndicator color="#fff" size="large" />
                            </View>
                        )}

                        {videoLoaded && showControls && (
                            <>
                                {/* bottom controls container */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: 6,
                                        backgroundColor: 'rgba(128, 128, 128, 0.4)',
                                        height: 40,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text>
                                        {formatSecondsTime(inlineVideoPosition)} /{' '}
                                        {formatSecondsTime(duration)}
                                    </Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        {/* toggle mute button */}
                                        {muted ? (
                                            <TouchableOpacity
                                                style={[styles.iconButton]}
                                                onPress={() => {
                                                    resetShowControlsTimeout();
                                                    setMuted(false);
                                                }}>
                                                <SoundMutedIcon {...iconProps} />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={[styles.iconButton]}
                                                onPress={() => {
                                                    resetShowControlsTimeout();
                                                    setMuted(true);
                                                }}>
                                                <SoundOnIcon {...iconProps} />
                                            </TouchableOpacity>
                                        )}

                                        {/* enter fullscreen button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                resetShowControlsTimeout();
                                                if (Platform.OS === 'ios') {
                                                    inlineVideoRef.current.presentFullscreenPlayer();
                                                } else {
                                                    setFullscreen(true);
                                                    Orientation.lockToLandscape();
                                                }
                                            }}
                                            style={[styles.iconButton, { marginLeft: 8 }]}>
                                            <EnterFullscreenIcon {...iconProps} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* center controls container */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '70%',
                                        }}>
                                        {/* seek backward button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (fullscreen) {
                                                    fullscreenVideoRef.current?.seek(
                                                        fullscreenVideoPosition - skipInterval,
                                                    );
                                                } else {
                                                    inlineVideoRef.current?.seek(
                                                        inlineVideoPosition - skipInterval,
                                                    );
                                                }
                                            }}
                                            style={{ padding: 8 }}>
                                            <SeekBackwardIcon width={42} height={42} fill="#fff" />
                                        </TouchableOpacity>

                                        {/* play/pause button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (isPlaying) {
                                                    setCurrentlyPlaying(null);
                                                } else {
                                                    setInlineVideoStarted(true);
                                                    setCurrentlyPlaying(src);
                                                }
                                            }}
                                            style={{ padding: 8 }}>
                                            <EnterFullscreenIcon
                                                width={42}
                                                height={42}
                                                fill="#fff"
                                            />
                                        </TouchableOpacity>

                                        {/* seek forward button */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (fullscreen) {
                                                    fullscreenVideoRef.current?.seek(
                                                        fullscreenVideoPosition + skipInterval,
                                                    );
                                                } else {
                                                    inlineVideoRef.current?.seek(
                                                        inlineVideoPosition + skipInterval,
                                                    );
                                                }
                                            }}
                                            style={{ padding: 8 }}>
                                            <SeekForwardIcon width={42} height={42} fill="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                )}

                {Platform.OS === 'android' && (
                    <Modal
                        style={{ margin: 0, backgroundColor: 'black' }}
                        visible={fullscreen}
                        supportedOrientations={['landscape']}
                        statusBarTranslucent={true}
                        transparent={true}>
                        <StatusBar hidden={fullscreen} />

                        <Video {...fullscreenVideoProps} />

                        {/* exit fullscreen button*/}
                        <TouchableOpacity
                            onPress={() => {
                                returnFromFullscreen.current = true;
                                setFullscreen(false);
                                Orientation.lockToPortrait();
                            }}
                            style={[styles.iconButton, { top: 10, right: 10 }]}>
                            <ExitFullscreenIcon {...iconProps} />
                        </TouchableOpacity>
                    </Modal>
                )}
            </View>

            <View>
                <View>
                    <Text>{playableDuration}</Text>
                    <Text>{seekableDuration}</Text>
                    <Text>{isLoading ? 'Loading' : '---'}</Text>
                    <Button
                        title="Play/Pause"
                        onPress={() => {
                            if (isPlaying) {
                                setCurrentlyPlaying(null);
                            } else {
                                setInlineVideoStarted(true);
                                setCurrentlyPlaying(src);
                            }
                        }}
                    />
                </View>
            </View>
        </>
    );
};
export { VideoPlayer, PlayerProvider };
