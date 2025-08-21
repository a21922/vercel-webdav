// pages/api/upload.js
import { createClient } from "webdav";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // 必须禁用 Next.js 默认解析
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file; // 前端上传的文件字段名为 'file'
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const client = createClient(
        process.env.WEBDAV_URL,
        {
          username: process.env.WEBDAV_USERNAME,
          password: process.env.WEBDAV_PASSWORD,
        }
      );

      const fileContent = fs.readFileSync(file.filepath);
      const remotePath = `/${file.originalFilename}`;

      await client.putFileContents(remotePath, fileContent, { overwrite: true });

      const fileURL = `${process.env.WEBDAV_URL.replace(/\/+$/, "")}/${file.originalFilename}`;

      res.status(200).json({ url: fileURL });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Upload failed", detail: e.message });
    }
  });
}
