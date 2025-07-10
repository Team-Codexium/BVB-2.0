import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const AudioUpload = ({ battleId, rapperId, onUpload }) => {
  console.log("runnig the audio upload component");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileRef.current.files[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("audio", fileRef.current.files[0]);
    try {
      await axios.post(
        `http://localhost:4000/api/media/${battleId}/${rapperId}/addaudio`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (onUpload) onUpload();
      fileRef.current.value = "";
    } catch (err) {
      // Optionally show error
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" text-amber-50 flex gap-2 items-center justify-end"
    >
      <Input
        type="file"
        name="audio"
        ref={fileRef}
        className="mb-0 text-amber-100 w-[20%] "
        required
        disabled={uploading}
      />
      <Button type="submit" disabled={uploading} className="bg-red-600">
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default AudioUpload;
