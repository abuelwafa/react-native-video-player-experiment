import React, { useEffect, useState } from 'react';
import { Text, StatusBar, SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import { VideoPlayer, PlayerProvider } from './src/video-player';
import Orientation from 'react-native-orientation-locker';

declare const global: { HermesInternal: null | {} };

const App = () => {
    const { width } = useWindowDimensions();
    const [src, setSrc] = useState('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
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
                        <View style={{ width, height: (width * 9) / 16, backgroundColor: '#eee' }}>
                            <VideoPlayer
                                src={src}
                                onNextVideo={() => {
                                    setSrc(
                                        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                                    );
                                }}
                                onPreviousVideo={() => {
                                    setSrc(
                                        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                                    );
                                }}
                                poster="https://loremflickr.com/440/360"
                                repeat={true}
                            />
                        </View>

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
                        <VideoPlayer
                            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
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
