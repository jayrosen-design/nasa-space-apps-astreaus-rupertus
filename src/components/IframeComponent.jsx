import React from 'react';

const IframeComponent = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    }}>
      <iframe
        src="https://html-classic.itch.zone/html/11663362/RupertusBuild/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allowTransparency="true"
        allowFullScreen={true}
        allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated; web-share"
        scrolling="no"
      />
    </div>
  );
};

export default IframeComponent;