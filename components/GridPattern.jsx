import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const GridPattern = ({ width, height, spacing = 20, color = 'rgba(255,255,255,0.1)' }) => {
  const patternId = "grid-pattern";
  
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg height={height} width={width}>
        <Path
          d={`M0 0 H${width} V${height} H0 Z`}
          fill={`url(#${patternId})`}
        />
        <Defs>
          <Pattern
            id={patternId}
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <Path
              d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </Pattern>
        </Defs>
      </Svg>
    </View>
  );
};

const Defs = ({ children }) => {
  return children;
};

const Pattern = ({ id, width, height, patternUnits, children }) => {
  return (
    <svg id={id} width={width} height={height} patternUnits={patternUnits}>
      {children}
    </svg>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  }
});

export default GridPattern;
