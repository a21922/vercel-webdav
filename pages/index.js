import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [url, setUrl] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
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
      if (res.ok) {
        setUrl(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (e) {
      alert("Upload error: " + e.message);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Copied to clipboard!");
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>WebDAV 文件上传</h1>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>上传</button>

      {preview && (
        <div style={{ marginTop: 20 }}>
          {file.type.startsWith("image") ? (
            <img src={preview} alt="预览" style={{ maxWidth: "100%" }} />
          ) : (
            <video src={preview} controls style={{ maxWidth: "100%" }} />
          )}
        </div>
      )}

      {url && (
        <div style={{ marginTop: 20 }}>
          <input type="text" value={url} readOnly style={{ width: "80%" }} />
          <button onClick={copyLink} style={{ marginLeft: 10 }}>复制链接</button>
        </div>
      )}
    </div>
  );
}
