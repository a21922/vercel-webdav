import { createClient } from "webdav";
import multer from "multer";
import nextConnect from "next-connect";

const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post(async (req, res) => {
  try {
    const { buffer, originalname } = req.file;

    // 读取环境变量里的 WebDAV 配置
    const client = createClient(process.env.WEBDAV_URL, {
      username: process.env.WEBDAV_USER,
      password: process.env.WEBDAV_PASS,
    });

    // 保存到 WebDAV
    const filename = Date.now() + "_" + originalname;
    await client.putFileContents(`/images/${filename}`, buffer, { overwrite: true });

    // 返回外链地址（根据你的 WebDAV 服务的访问路径调整）
    const fileUrl = `${process.env.WEBDAV_PUBLIC}/${filename}`;
    res.status(200).json({ url: fileUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // 让 multer 接管
  },
};

export default apiRoute;
