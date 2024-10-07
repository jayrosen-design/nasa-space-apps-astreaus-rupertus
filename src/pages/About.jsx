import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">About Astreaus Rupertus</h2>
      
      <div className="aspect-w-16 aspect-h-9 mb-8">
        <iframe
          src="https://www.youtube.com/embed/nasR1Y9SotQ"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-lg"
        ></iframe>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Exploring the Exosky with Rupert</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our team, Astreaus Rupertus, developed a web application for the NASA Space Apps Challenge Exosky, where users can explore the night sky from the perspective of various exoplanets. The app allows kids, students, and anyone to visualize star charts as they would appear from a section of over 5500 known exoplanets, offering an interactive and educational experience.
          </p>
          <p className="mb-4">
            Users can select an exoplanet, explore its unique night sky, and draw their own constellations. Inspired by the mascot Rupert the Space Armadillo, our project weaves together storytelling and space exploration, allowing students to connect with the vast universe.
          </p>
          <p>
            The app provides various levels of complexity depending on the user's age or interest, making it a versatile educational tool.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Exoplanet selection with customized star charts</li>
            <li>Interactive star maps, allowing users to create constellations and explore star data</li>
            <li>Customization options for advanced users, including grid overlays and star detail information</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <img src="https://i.imgur.com/LxRzxQw.jpeg" alt="Exosky Explorer" className="w-full h-auto rounded-lg shadow-lg" />
        <img src="https://i.imgur.com/UQnAvF8.png" alt="Star Map Visualization" className="w-full h-auto rounded-lg shadow-lg" />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our project is a web application that allows users, particularly students, to explore what the night sky would look like from the perspective of different exoplanets. Using data from over 5500 exoplanets and vast star catalogs, the app generates a star chart that is unique to each exoplanet's perspective.
          </p>
          <p className="mb-4">
            The app leverages real space data from the Gaia mission and combines it with exoplanet data to calculate how stars would appear in the sky from each exoplanet's surface. After selecting an exoplanet, the app filters and visualizes relevant stars through a 3D star map, which users can interact with in real time.
          </p>
          <p>
            The app also includes storytelling elements, with Rupert the Space Armadillo acting as a guide. Through Rupert's journey, users are encouraged to create their constellations, name them, and share their discoveries.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Gaia Space Data: Used for accessing detailed star catalogs and exoplanet data</li>
            <li>Unity: Used for visualizing the star data and filtering the stars based on exoplanet perspectives in a 3D environment</li>
            <li>GPT Engineer: Built the React app that calls Unity and handles the visualization of star data. Also used for web hosting</li>
            <li>Python: Utilized to download and process space data from Gaia, unzipping files and preparing them for use in Unity and React</li>
            <li>ChatGPT: Assisted with data organization, debugging, and generating assets and ideas for the app's user interface and narrative</li>
            <li>GitHub Copilot: Helped with generating images and code snippets for image processing</li>
            <li>Suno: Generated the audio elements for the storytelling portions</li>
            <li>Audacity: Used to edit audio files to ensure clarity and professionalism</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources and References</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Space Agency Data:</strong></p>
          <ul className="list-disc list-inside mb-4">
            <li><a href="https://gea.esac.esa.int/archive/" className="text-blue-500 hover:underline">GAIA</a></li>
            <li><a href="https://svs.gsfc.nasa.gov/4851/" className="text-blue-500 hover:underline">NASA Deep Star Maps</a></li>
          </ul>
          <p className="mb-2"><strong>References:</strong></p>
          <ul className="list-disc list-inside">
            <li><a href="https://ccspacemuseum.org/rupert-the-space-armadillo/" className="text-blue-500 hover:underline">Rupert the Space Armadillo</a></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;