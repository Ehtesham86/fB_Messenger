import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

// This will allow Next.js to process form-data and handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parsing so that formidable can handle it
  },
};

const API_KEY = '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';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    // Parse the form data (including file uploads)
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Form parsing error' });
      }

      // Ensure the file exists and has the 'filepath' property
      const file = files.file ? files.file[0] : null;

      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'No file uploaded or invalid file format' });
      }

      try {
        // Read the file and upload it to the API (e.g., OpenAI or another service)
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.filepath));

        // Replace this URL with the appropriate endpoint you're using to analyze the image
        const openAiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: formData,
        });

        const data = await openAiResponse.json();

        if (data.error) {
          return res.status(400).json({ error: data.error.message });
        }

        // Assuming the API returns a `choices` array with HTML/CSS/JS code
        const htmlCssJsCode = data.choices[0].text; // Adjust this according to the actual API response structure

        res.status(200).json({ code: htmlCssJsCode });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    // If the request method is not POST
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
