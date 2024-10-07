import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">About Astreaus Rupertus</h2>
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <iframe
          src="https://www.youtube.com/embed/your-video-id"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      <p className="mb-4">
        Astreaus Rupertus is an interactive space exploration application that allows users to discover constellations, exoplanets, and embark on virtual space journeys.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <img src="/path/to/image1.jpg" alt="Space Image 1" className="w-full h-auto rounded" />
        <img src="/path/to/image2.jpg" alt="Space Image 2" className="w-full h-auto rounded" />
      </div>
    </div>
  );
};

export default About;