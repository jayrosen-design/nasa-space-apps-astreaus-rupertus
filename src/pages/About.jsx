import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutSection = ({ title, children }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">About Astreaus Rupertus</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="aspect-w-16 aspect-h-9 h-[480px]">
          <iframe
            src="https://www.youtube.com/embed/nasR1Y9SotQ"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-lg"
          ></iframe>
        </div>
        <div className="aspect-w-16 aspect-h-9 h-[480px]">
          <iframe
            src="https://www.youtube.com/embed/wyHuolYbA-k"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>

      <AboutSection title="Exploring the Exosky with Rupert">
        <p className="mb-4">
          Our team, Astreaus Rupertus, developed a web application for the NASA Space Apps Challenge Exosky, where users can explore the night sky from the perspective of various exoplanets. The app allows kids, students, and anyone to visualize star charts as they would appear from a section of over 5500 known exoplanets, offering an interactive and educational experience.
        </p>
        <p>
          Users can select an exoplanet, explore its unique night sky, and draw their own constellations. Inspired by the mascot Rupert the Space Armadillo, our project weaves together storytelling and space exploration, allowing students to connect with the vast universe.
        </p>
      </AboutSection>

      <AboutSection title="Key Features">
        <ul className="list-disc list-inside space-y-2">
          <li>Exoplanet selection with customized star charts</li>
          <li>Interactive star maps, allowing users to create constellations and explore star data</li>
          <li>Customization options for advanced users, including grid overlays and star detail information</li>
        </ul>
      </AboutSection>

      <h3 className="text-2xl font-bold mb-4">ExoSpace - Draw Your Own Constellations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <img src="https://i.imgur.com/LxRzxQw.jpeg" alt="Exosky Explorer" className="w-full h-auto rounded-lg shadow-lg" />
        <img src="https://i.imgur.com/IjlxBB3.jpeg" alt="ExoSpace Constellation Drawing" className="w-full h-auto rounded-lg shadow-lg" />
      </div>

      <AboutSection title="Project Details">
        <p className="mb-4">
          Our project allows users to explore the night sky from different exoplanets' perspectives. Using data from over 5500 exoplanets and vast star catalogs, the app generates unique star charts for each exoplanet.
        </p>
        <p>
          The app leverages real space data from the Gaia mission, combining it with exoplanet data to visualize stars through an interactive 3D star map. It also includes storytelling elements, with Rupert the Space Armadillo guiding users to create and share their own constellations.
        </p>
      </AboutSection>

      <AboutSection title="Technologies Used">
        <ul className="list-disc list-inside space-y-2">
          <li>Gaia Space Data: For star catalogs and exoplanet data</li>
          <li>Unity: 3D visualization of star data</li>
          <li>GPT Engineer: React app development and web hosting</li>
          <li>Python: Data processing and preparation</li>
          <li>ChatGPT & GitHub Copilot: Assistance in development and asset generation</li>
          <li>Suno & Audacity: Audio generation and editing</li>
        </ul>
      </AboutSection>

      <AboutSection title="In the News">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <img src="https://i.imgur.com/pECxY7K.jpeg" alt="Hometown News Article" className="w-full md:w-1/2 h-auto rounded-lg shadow-lg" />
          <div>
            <p className="font-semibold">
              <a href="https://www.hometownnewsbrevard.com/eedition/page-08/page_e36ec591-c639-5f5b-b983-8e90bb3a8356.html?fbclid=IwY2xjawGDmRFleHRuA2FlbQIxMAABHa7Lr8N8t3-KWFiZDljs8HKtujI9lzcWGb5-OHJSd3YV5RIsLC8rA_O2rg_aem_JiTPllj1OM6rpAzUwPvmHA" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Hometown News. "Innovators Unite and Inspire"
              </a>
            </p>
            <p className="text-sm text-gray-600">Oct. 11, 2024</p>
          </div>
        </div>
      </AboutSection>

      <AboutSection title="Team">
        <img src="https://i.imgur.com/UQnAvF8.png" alt="Astreaus Rupertus Team" className="w-full h-auto rounded-lg shadow-lg mb-4" />
        <ul className="list-disc list-inside space-y-2">
          <li>Julieth Lorne</li>
          <li>Laura Chavez</li>
          <li>A'sa Dickens</li>
          <li>Paul Muszynski</li>
          <li>Jay Rosen</li>
        </ul>
      </AboutSection>

      <AboutSection title="Resources and References">
        <p className="mb-2"><strong>Space Agency Data:</strong></p>
        <ul className="list-disc list-inside mb-4">
          <li><a href="https://gea.esac.esa.int/archive/" className="text-blue-500 hover:underline">GAIA</a></li>
          <li><a href="https://svs.gsfc.nasa.gov/4851/" className="text-blue-500 hover:underline">NASA Deep Star Maps</a></li>
        </ul>
        <p className="mb-2"><strong>References:</strong></p>
        <ul className="list-disc list-inside">
          <li><a href="https://ccspacemuseum.org/rupert-the-space-armadillo/" className="text-blue-500 hover:underline">Rupert the Space Armadillo</a></li>
        </ul>
      </AboutSection>
    </div>
  );
};

export default About;