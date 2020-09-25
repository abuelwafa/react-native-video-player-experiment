import React, { useEffect } from 'react';
import { Text, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { VideoPlayer, PlayerProvider } from './src/video-player';
import Orientation from 'react-native-orientation-locker';

declare const global: { HermesInternal: null | {} };

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView>
                    <Text>
                        Elit asperiores repellat beatae ducimus labore numquam, harum, nihil Harum
                        facilis sed ipsam recusandae provident. Autem ab ab tempore dolorum sapiente
                        Necessitatibus pariatur facere eligendi consectetur impedit. Ea fugit vitae!
                    </Text>
                    <Text>
                        Elit asperiores repellat beatae ducimus labore numquam, harum, nihil Harum
                        facilis sed ipsam recusandae provident. Autem ab ab tempore dolorum sapiente
                        Necessitatibus pariatur facere eligendi consectetur impedit. Ea fugit vitae!
                    </Text>
                    <Text>
                        Elit asperiores repellat beatae ducimus labore numquam, harum, nihil Harum
                        facilis sed ipsam recusandae provident. Autem ab ab tempore dolorum sapiente
                        Necessitatibus pariatur facere eligendi consectetur impedit. Ea fugit vitae!
                    </Text>
                    <PlayerProvider>
                        <VideoPlayer
                            src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
                            poster="https://via.placeholder.com/440x360/EEAACC/FFFFFF"
                            repeat={true}
                            style={{ marginBottom: 20 }}
                        />

                        <Text>
                            Elit asperiores repellat beatae ducimus labore numquam, harum, nihil
                            Harum facilis sed ipsam recusandae provident. Autem ab ab tempore
                            dolorum sapiente Necessitatibus pariatur facere eligendi consectetur
                            impedit. Ea fugit vitae!
                        </Text>
                        <Text>
                            Elit asperiores repellat beatae ducimus labore numquam, harum, nihil
                            Harum facilis sed ipsam recusandae provident. Autem ab ab tempore
                            dolorum sapiente Necessitatibus pariatur facere eligendi consectetur
                            impedit. Ea fugit vitae!
                        </Text>
                        <Text>
                            Elit asperiores repellat beatae ducimus labore numquam, harum, nihil
                            Harum facilis sed ipsam recusandae provident. Autem ab ab tempore
                            dolorum sapiente Necessitatibus pariatur facere eligendi consectetur
                            impedit. Ea fugit vitae!
                        </Text>
                        <Text>
                            Elit asperiores repellat beatae ducimus labore numquam, harum, nihil
                            Harum facilis sed ipsam recusandae provident. Autem ab ab tempore
                            dolorum sapiente Necessitatibus pariatur facere eligendi consectetur
                            impedit. Ea fugit vitae!
                        </Text>
                        <Text>
                            Elit asperiores repellat beatae ducimus labore numquam, harum, nihil
                            Harum facilis sed ipsam recusandae provident. Autem ab ab tempore
                            dolorum sapiente Necessitatibus pariatur facere eligendi consectetur
                            impedit. Ea fugit vitae!
                        </Text>
                        <Text>
                            Elit asperiores repellat beatae ducimus labore numquam, harum, nihil
                            Harum facilis sed ipsam recusandae provident. Autem ab ab tempore
                            dolorum sapiente Necessitatibus pariatur facere eligendi consectetur
                            impedit. Ea fugit vitae!
                        </Text>
                        {/* <VideoPlayer */}
                        {/*     src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" */}
                        {/*     repeat={true} */}
                        {/*     style={{ marginBottom: 20 }} */}
                        {/* /> */}
                        {/*  */}
                        {/* <VideoPlayer */}
                        {/*     src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" */}
                        {/*     repeat={true} */}
                        {/*     style={{ marginBottom: 20 }} */}
                        {/* /> */}
                    </PlayerProvider>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default App;
