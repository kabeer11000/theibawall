import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import { CreateToken } from '@/utils/create-token';
import axios from 'axios';

// Disable default body parsing for handling file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// API route handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    try {
      // Prepare data to forward
      const { description, location, link, user, 'location-coord': locationCoord } = fields;
      const file = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : null; // Handle array of files

      // Create a new FormData object for the external API
      const formData = new FormData();
      formData.append('description', description?.toString());
      formData.append('link', link?.toString());
      formData.append('user', user?.toString());
      formData.append('location', location?.toString());
      formData.append('location-coord', locationCoord?.toString());  // 'location-coord' may be an array, we handle it as a string here

      const fileStream = fs.createReadStream(file.filepath);
      formData.append('file', fileStream, file.originalFilename);

      const responseData = await (await axios.post(`https://docs.cloud.kabeers.network/tests/wall/api.php?token=${CreateToken(user)?.toString()}&is-live=false`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      })).data;


      // const responseData = await response.text();

      // if (!response.ok) {
      //   console.error("Error response from external API:", responseData);
      //   return res.status(500).json({ error: "Error forwarding data to external API", details: responseData });
      // }

      // Send back the external API response
      res.status(200).json({ success: true, message: "Data forwarded successfully", data: responseData });

    } catch (error) {
      console.error("Error forwarding data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
