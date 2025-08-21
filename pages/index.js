import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [link, setLink] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);

    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) setLink(data.url);
      else alert("上传失败：" + (data.error || "未知错误"));
    } catch (err) {
      alert("上传失败：" + err.message);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert("链接已复制！");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">文件上传</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      {preview && (
        <div className="mb-4">
          {file.type.startsWith("video") ? (
            <video src={preview} controls className="max-w-xs rounded" />
          ) : (
            <img src={preview} alt="预览" className="max-w-xs rounded" />
          )}
        </div>
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-6 py-2 rounded mb-4 hover:bg-blue-600"
      >
        上传
      </button>
      {link && (
        <div className="flex flex-col items-center">
          <input
            type="text"
            readOnly
            value={link}
            className="border px-2 py-1 w-80 mb-2 rounded"
          />
          <button
            onClick={copyLink}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            复制链接
          </button>
        </div>
      )}
    </div>
  );
}
