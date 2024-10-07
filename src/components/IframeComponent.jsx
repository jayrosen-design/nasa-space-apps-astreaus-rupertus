import React from 'react';

const IframeComponent = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <iframe
        src="https://html-classic.itch.zone/html/11663362/RupertusBuild/index.html"
        className="w-full h-full border-none"
        allowTransparency="true"
        allowFullScreen={true}
        allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated; web-share"
        scrolling="no"
      />
    </div>
  );
};

export default IframeComponent;