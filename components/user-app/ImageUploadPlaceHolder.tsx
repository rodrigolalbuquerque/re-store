"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FilePreview {
  file: Blob;
  preview: string;
}

interface TFileToProcess {
  path: string;
}

export function ImageUploadPlaceHolder() {
  const [file, setFile] = useState<FilePreview | null>();
  const [fileToProcess, setFileToProcess] = useState<TFileToProcess | null>(
    null,
  );
  const [restoredFile, setRestoredFile] = useState<FilePreview | null>();
  const onDrop = useCallback(async (acceptFiles: File[]) => {
    try {
      const file = acceptFiles[0];
      setFile({
        file,
        preview: URL.createObjectURL(file),
      });
      console.log("arquivo salvo");

      // const supabase = createClientComponentClient();
      // const { data, error } = await supabase.storage
      //   .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
      //   .upload(
      //     `${process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER_PROCESSING}/${file.name}`,
      //     file,
      //   );
      // if (!error) {
      //   setFileToProcess(data);
      // }
    } catch (error) {
      console.log("onDrop ", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      console.log("useEffect: unmount");
      if (file) URL.revokeObjectURL(file.preview);
      if (restoredFile) URL.revokeObjectURL(restoredFile.preview);
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
    },
  });

  const handleDialogOpenChange = async (isDialogOpen: boolean) => {
    if (!isDialogOpen) {
      setFile(null);
      setRestoredFile(null);
    }
    console.log(`File: ${file}`);
    console.log(`RestoreFile: ${restoredFile}`);
  };

  const handleEnhance = async () => {
    if ((!file && !restoredFile) || (file && restoredFile)) {
      console.log("Impossible to enhance");
      return;
    }

    try {
      const supabase = createClientComponentClient();
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_APP_BUCKET_IMAGE_FOLDER)
        .getPublicUrl(`${fileToProcess?.path}`);

      const res = await fetch("api/ai/replicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: publicUrl,
        }),
      });

      const restoredImageUrl = await res.json();
      const readImageRes = await fetch(restoredImageUrl.data);
      const imageBlob = await readImageRes.blob();

      setRestoredFile({
        file: imageBlob,
        preview: URL.createObjectURL(imageBlob),
      });
    } catch (error) {
      console.log("handleEnhance: ", error);
    }
  };
  return (
    <div className="flex h-[200px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-10 w-10 text-muted-foreground"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="11" r="1" />
          <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
          <path d="M17 18.5a9 9 0 1 0-10 0" />
        </svg>

        <h3 className="mt-4 text-lg font-semibold">No photos added</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You have not added any photos. Add one below.
        </p>
        <Dialog onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" className="relative">
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Photo</DialogTitle>
              <DialogDescription>
                Copy and paste the photo feed URL to import.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                {!file && (
                  <div className="cursor-pointer" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p
                      className={`grid h-36 items-center rounded-md border border-dashed border-blue-400 bg-blue-100 p-6 text-center opacity-70 ${
                        isDragActive ? "bg-blue-200" : "bg-blue-100"
                      }`}
                    >
                      {isDragActive
                        ? "Drop your photo here..."
                        : "Drag or Click to choose image"}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center justify-evenly gap-2 sm:flex-row">
                {file && (
                  <div className="flex flex-row flex-wrap drop-shadow-md">
                    <div className="relative flex h-48 w-48">
                      <img
                        className="w-60 rounded-md object-contain"
                        src={file.preview}
                        alt="imagePreview"
                        onLoad={() => URL.revokeObjectURL(file.preview)}
                      />
                    </div>
                  </div>
                )}
                {restoredFile && (
                  <div className="flex flex-row flex-wrap drop-shadow-md">
                    <div className="relative flex h-48 w-48">
                      <img
                        className="w-60 rounded-md object-contain"
                        src={restoredFile.preview}
                        alt="imagePreview"
                        onLoad={() => URL.revokeObjectURL(restoredFile.preview)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEnhance}>Enhance</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
