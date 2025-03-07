import React, { useEffect, useState } from "react";
import { Viewer } from "@tracespace/viewer";

const GerberPreview = ({ fileUrl }) => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!fileUrl) return;

    const fetchGerberFile = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        setFile(arrayBuffer);
      } catch (error) {
        console.error("Error loading Gerber file:", error);
      }
    };

    fetchGerberFile();
  }, [fileUrl]);

  return (
    <div>
      {file ? <Viewer file={file} /> : <p>Loading Gerber file...</p>}
    </div>
  );
};

export default GerberPreview;
