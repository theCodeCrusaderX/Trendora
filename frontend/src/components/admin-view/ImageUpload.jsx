import React, { useRef } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { UploadCloudIcon } from 'lucide-react';
import { FileIcon } from 'lucide-react';
import { XIcon } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

function ImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {

  function handleDragOver(e) {
    e.preventDefault()

  }

  function handleDrop(e) {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);    
  }

  // React.useEffect(() => {
  //   console.log("Updated imageFile:", imageFile);
  // }, [imageFile]);

  function handleRemoveImage() {
    setImageFile(null);
    if(inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const handleImgFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setImageFile(selectedFile);    
  }

  async function uploadToCloudinary() {
    setImageLoadingState(true)
    console.log("before", imageFile);
    
    const data = new FormData()
    data.append("my_file",imageFile)

    const res = await axios.post("https://trendora-backend-uonr.onrender.com/api/v1/admin/img-upload",data)

    console.log("res", res);
    if (res?.data?.success) {
      setUploadedImageUrl(res.data.result.url);
      setImageLoadingState(false);
    }
    
  }

  useEffect(() => {
    if(imageFile !== null) uploadToCloudinary()
  }, [imageFile])
  

  const inputRef = useRef()

  return (
    <div
    className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
  >
    <Label >Upload Image</Label>
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`${
        isEditMode ? "opacity-60" : ""
      } border-2 border-dashed rounded-lg p-4`}
    >
      <Input
        id="image-upload"
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImgFileChange}
        disabled={isEditMode}
      />
      {!imageFile ? (
        <Label
          htmlFor="image-upload"
          className={`${
            isEditMode ? "cursor-not-allowed" : ""
          } flex flex-col items-center justify-center h-32 cursor-pointer`}
        >
          <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
          <span>Drag & drop or click to upload image</span>
        </Label>
      ) : imageLoadingState ? (
        <Skeleton className="h-10 bg-gray-100" />
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileIcon className="w-8 text-primary mr-2 h-8" />
          </div>
          <p className="text-sm font-medium">{imageFile.name}</p>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleRemoveImage}
          >
            <XIcon className="w-4 h-4" />
            <span className="sr-only">Remove File</span>
          </Button>
        </div>
      )}
    </div>
  </div>
  )
}

export default ImageUpload