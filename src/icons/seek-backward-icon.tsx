import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SeekBackwardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <Svg viewBox="0 0 24 24" width={18} height={18} {...props}>
            <Path d="M0 0h24v24H0z" fill="none" />
            <Path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </Svg>
    );
}

export { SeekBackwardIcon };
