import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ExoplanetInfo = ({ exoplanet }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-background/80 p-4 rounded-lg shadow-lg max-w-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(exoplanet).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>{key.replace(/_/g, ' ')}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExoplanetInfo;