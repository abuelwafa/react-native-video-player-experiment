import React, { useRef, useState, useEffect, RefObject, useContext } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    StatusBar,
    Button,
    Platform,
    Text,
    Animated,
} from 'react-native';
import Video, { VideoProperties } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Modal from 'react-native-modal';
import { State, PanGestureHandler } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

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
    onNextVideo: () => void;
    onPreviousVideo: () => void;
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
    onPreviousVideo,
    onNextVideo,
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

    const { currentlyPlaying, setCurrentlyPlaying } = useContext(VideoPlayerContext);
    const isPlaying = currentlyPlaying === src;

    const seekPanOffset = useRef(new Animated.Value(0)).current;
    const seekBarWidth = useRef(new Animated.Value(100)).current;

    const commonVideoProps: VideoProperties = {
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
        style: styles.video,
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

    return (
        <View style={styles.container}>
            {!fullScreen && (
                <>
                    <Video {...inlineVideoProps} />
                    <View style={styles.seekbarContainer}>
                        <View
                            style={styles.seekbar}
                            onLayout={Animated.event([
                                { nativeEvent: { layout: { width: seekBarWidth } } },
                            ])}
                        />
                        <PanGestureHandler
                            onGestureEvent={Animated.event(
                                [{ nativeEvent: { x: seekPanOffset } }],
                                { useNativeDriver: true },
                            )}
                            onHandlerStateChange={({ nativeEvent }) => {
                                if (nativeEvent.state === State.END) {
                                    console.log(nativeEvent.translationX);
                                }
                            }}>
                            <Animated.View
                                style={[
                                    styles.seekHandler,
                                    { transform: [{ translateX: seekPanOffset }] },
                                ]}
                            />
                        </PanGestureHandler>
                    </View>
                    <View>
                        <View>
                            <Text>
                                {formatSecondsTime(position)} / {formatSecondsTime(duration)}
                            </Text>
                            <Text>{playableDuration}</Text>
                            <Text>{seekableDuration}</Text>
                            <Text>
                                {isPlaying && playableDuration - position <= 0 ? 'Loading' : '---'}
                            </Text>
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
                        <Button title="Mute" onPress={() => setMuted((s) => !s)} />
                        <Button title="Stop" onPress={() => {}} />
                        <Button
                            title="ToggleFullScreen"
                            onPress={() => {
                                // if (Platform.OS === 'ios') {
                                //     videoRef.current.presentFullscreenPlayer();
                                // } else {
                                setFullScreen(true);
                                Orientation.lockToLandscape();
                                // }
                            }}
                        />
                    </View>
                </>
            )}
            {Platform.OS !== 'android' && (
                <Modal
                    style={{ margin: 0, backgroundColor: 'black' }}
                    coverScreen={true}
                    visible={fullScreen}
                    supportedOrientations={['landscape']}
                    statusBarTranslucent={true}
                    transparent={true}>
                    <StatusBar hidden={fullScreen} />
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setFullScreen(false);
                            Orientation.unlockAllOrientations();
                        }}>
                        <Video {...fullScreenVideoProps} />
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};
export { VideoPlayer, PlayerProvider };
