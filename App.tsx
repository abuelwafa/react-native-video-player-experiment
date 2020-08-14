import React from 'react';
import { Text, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { VideoPlayer, PlayerProvider } from './video-player';

declare const global: { HermesInternal: null | {} };

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView>
                    <Text>hello react native</Text>
                    <PlayerProvider>
                        <VideoPlayer
                            src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
                            repeat={true}
                        />

                        <VideoPlayer
                            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                            repeat={true}
                        />

                        <VideoPlayer
                            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                            repeat={true}
                        />
                    </PlayerProvider>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default App;