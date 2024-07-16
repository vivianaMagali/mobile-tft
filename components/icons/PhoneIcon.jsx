import React from 'react';
import Svg, {Path} from 'react-native-svg';

const PhoneIcon = ({size = 16, color = '#38b2ac'}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path stroke="none" d="M0 0h24v24H0z" />
    <Path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
  </Svg>
);

export default PhoneIcon;
