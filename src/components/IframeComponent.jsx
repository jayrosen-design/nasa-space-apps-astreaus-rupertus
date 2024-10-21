import React from 'react';
import { Button } from '@/components/ui/button';

const IframeComponent = () => {
  const openInBrowser = () => {
    window.open('https://jayrosen.itch.io/astreaus-rupertus', '_blank');
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-black flex flex-col">
      <iframe
        src="https://html-classic.itch.zone/html/11779929/Exosky3/index.html"
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
      <div className="p-4 flex justify-center">
        <Button onClick={openInBrowser}>Open in Browser</Button>
      </div>
    </div>
  );
};

export default IframeComponent;