import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AudioUpload = () => {
  return (
    <div className="">
      <form 
          action="http://localhost:4000/api/media/battle/addaudio"
        method="POST" 
        encType="multipart/form-data"
      >
        <Input 
          type="file" 
          name="audio" 
         
          className="mb-4 text-amber-100" 
          required 
        />
        <Button type="submit">Upload</Button>
      </form>
    </div>
  );
};

export default AudioUpload;
