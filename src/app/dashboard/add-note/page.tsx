"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { uploadFile } from "../../../../lib/uploadFile";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormData = {
  title: string;
  content: string;
  tags: string[];
  links: { name: string; url: string }[];
  files: { name: string; file: File | null }[];
  isPinned: boolean;
  isArchived: boolean;
};

export default function AddNote() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      tags: [],
      links: [{ name: "", url: "" }],
      files: [{ name: "", file: null }],
      isPinned: false,
      isArchived: false,
    },
  });

  const [linkFields, setLinkFields] = useState([{ name: "", url: "" }]);
  const [fileFields, setFileFields] = useState([{ name: "", file: null }]);
  const [tagInput, setTagInput] = useState("");

  const router = useRouter();

  const addLinkField = () => {
    setLinkFields([...linkFields, { name: "", url: "" }]);
    setValue("links", [...getValues("links"), { name: "", url: "" }]);
  };

  const removeLinkField = (index: number) => {
    const newLinks = linkFields.filter((_, i) => i !== index);
    setLinkFields(newLinks);
    setValue(
      "links",
      getValues("links").filter((_, i) => i !== index)
    );
  };

  const addFileField = () => {
    setFileFields([...fileFields, { name: "", file: null }]);
    setValue("files", [...getValues("files"), { name: "", file: null }]);
  };

  const removeFileField = (index: number) => {
    const newFiles = fileFields.filter((_, i) => i !== index);
    setFileFields(newFiles);
    setValue(
      "files",
      getValues("files").filter((_, i) => i !== index)
    );
  };

  const addTag = () => {
    if (tagInput.trim() !== "") {
      setValue("tags", [...getValues("tags"), tagInput.trim()]);
      setTagInput("");
    }
  };

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     const newdata = {
  //       ...data,
  //     };
  //     // Append files with name and file object
  //     await data?.files?.forEach(async (f) => {
  //       console.log("Processing file:", f);
  //       if (f.file) {
  //         const file = await uploadFile(f.file);
  //         console.log("Uploaded file data:", file);
  //       }
  //     });

  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/notes/create`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify(newdata),
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const resData = await res.json();

  //     if (resData.success) {
  //       Swal.fire("Success", "Note added successfully!", "success");
  //       reset();
  //       setLinkFields([{ name: "", url: "" }]);
  //       setFileFields([{ name: "", file: null }]);
  //       setTagInput("");
  //     } else {
  //       Swal.fire("Error", resData.error || "Something went wrong", "error");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire("Error", "Something went wrong", "error");
  //   }
  // };

  const onSubmit = async (data: FormData) => {
    try {
      // Process file uploads
      const uploadedFiles: { name: string; url: string }[] = [];

      for (const f of data.files) {
        if (f.file && (f.file as unknown as FileList)[0]) {
          const fileObj = (f.file as unknown as FileList)[0]; // FileList থেকে প্রথম ফাইলটা নেয়া
          const uploaded = await uploadFile(fileObj);
          uploadedFiles.push({
            name: f.name || fileObj.name,
            url: uploaded.file.url,
          });
        }
      }

      const newdata = {
        ...data,
        files: uploadedFiles,
      };
      console.log("Submitting data:", newdata);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notes/create`,
        {
          method: "POST",
          body: JSON.stringify(newdata),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await res.json();

      if (resData.success) {
        Swal.fire("Success", "Note added successfully!", "success");
        reset();
        setLinkFields([{ name: "", url: "" }]);
        setFileFields([{ name: "", file: null }]);
        setTagInput("");
        router.push("/dashboard/all-notes");
      } else {
        Swal.fire("Error", resData.error || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Add New Note</h2>
        <Link href="/dashboard/all-notes">
          <button className="btn btn-primary text-neutral">
            View All Notes
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className={`mt-1 block w-full border px-3 py-2 rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter note title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium">Content</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className={`mt-1 block w-full border px-3 py-2 rounded ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter note content"
            rows={5}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Enter a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn btn-sm btn-primary text-neutral"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {getValues("tags")?.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "tags",
                      getValues("tags").filter((_, i) => i !== index)
                    )
                  }
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <label className="block font-medium">Links</label>
          {linkFields.map((link, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                {...register(`links.${idx}.name` as const)}
                placeholder="Link title"
                className="border px-2 py-1 rounded w-1/2"
              />
              <input
                {...register(`links.${idx}.url` as const)}
                placeholder="URL"
                className="border px-2 py-1 rounded w-1/2"
              />
              <button
                type="button"
                onClick={() => removeLinkField(idx)}
                className="btn btn-sm btn-error text-neutral"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLinkField}
            className="btn btn-sm btn-secondary text-neutral"
          >
            Add Link
          </button>
        </div>

        {/* Files */}
        <div>
          <label className="block font-medium">
            <span>Files</span>
            <span className="block mt-0 opacity-35">
              <small>add multiple files. PDF and images are recommended</small>
            </span>
          </label>
          {fileFields.map((f, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                {...register(`files.${idx}.name` as const)}
                placeholder="File name"
                className="border px-2 py-1 rounded w-1/3"
              />
              <input
                type="file"
                {...register(`files.${idx}.file` as const)}
                className="border px-2 py-1 rounded w-2/3"
              />
              <button
                type="button"
                onClick={() => removeFileField(idx)}
                className="btn btn-sm btn-error text-neutral"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFileField}
            className="btn btn-sm btn-secondary text-neutral"
          >
            Add File
          </button>
        </div>

        {/* Options */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("isPinned")} />
            Pinned
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("isArchived")} />
            Archived
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-neutral"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Add Note"}
        </button>
      </form>
    </div>
  );
}
