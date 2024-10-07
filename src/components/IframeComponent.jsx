import React from 'react';

const IframeComponent = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <iframe
        src="https://html-classic.itch.zone/html/11663722/RupertusBuild2/index.html"
        className="w-full h-full border-none"
        frameBorder="0"
        allowFullScreen={true}
        scrolling="no"
        id="game_drop"
        allowTransparency="true"
        allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated; web-share"
        msallowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
      />
    </div>
  );
};

export default IframeComponent;