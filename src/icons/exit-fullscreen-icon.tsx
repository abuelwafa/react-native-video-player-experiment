import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ExitFullscreenIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...props}>
            <Path d="M0 0h24v24H0z" fill="none" />
            <Path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
        </Svg>
    );
}

export { ExitFullscreenIcon };
