import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setUrl(data.url);
    } else {
      alert("上传失败: " + data.error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">图床 Demo</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        上传
      </button>

      {url && (
        <div className="mt-4">
          <p>外链：</p>
          <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            {url}
          </a>
          <div>
            <img src={url} alt="preview" className="mt-2 max-w-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
