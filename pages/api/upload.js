// pages/api/upload.js
import { createClient } from "webdav";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // ⚠️ 禁用默认body解析
  },
};

const client = createClient(
  process.env.WEBDAV_URL,
  {
    username: process.env.WEBDAV_USERNAME,
    password: process.env.WEBDAV_PASSWORD,
  }
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileContent = fs.readFileSync(file.filepath);
    const remotePath = `/${file.originalFilename}`;

    try {
      await client.putFileContents(remotePath, fileContent, { overwrite: true });
      const fileUrl = `${process.env.WEBDAV_PUBLIC_URL}/${file.originalFilename}`;
      res.status(200).json({ url: fileUrl });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
