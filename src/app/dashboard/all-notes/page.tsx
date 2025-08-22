"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { FaLink, FaFilePdf, FaTrashAlt, FaTag } from "react-icons/fa";
import Swal from "sweetalert2";
import Link from "next/link";
import { FaShare } from "react-icons/fa6";

interface Note {
  _id: string;
  title: string;
  content: string;
  tags?: string[];
  links?: { _id: string; url: string; name: string }[];
  files?: { _id: string; url: string; name: string }[];
  createdAt: string;
}

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([]);

  // Fetch all notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notes/all`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );
        const data = await res.json();
        setNotes(data?.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Delete note
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This note will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          setNotes((prev) => prev.filter((note) => note._id !== id));

          Swal.fire("Deleted!", "Your note has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting note:", error);
          Swal.fire("Error!", "Failed to delete note.", "error");
        }
      }
    });
  };

  const handleShare = (id: string) => {
    // Implement share functionality here
    console.log("Sharing note:", id);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">All Notes</h1>
        <Link href="/dashboard/add-note">
          <button className="btn btn-primary text-neutral">Add New Note</button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4 bg-white rounded-2xl shadow-md space-y-3 border flex flex-col justify-between"
            >
              {/* Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </div>

              {/* Content */}
              <p className="text-gray-700">{note.content}</p>

              {/* Tags */}
              {(note.tags?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags?.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                    >
                      <FaTag /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              {(note.links?.length ?? 0) > 0 && (
                <div className="space-y-1">
                  <p className="font-medium">Links:</p>
                  {note.links?.map(
                    (link: { _id: string; url: string; name: string }) => (
                      <a
                        key={link._id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <FaLink /> {link.name}
                      </a>
                    )
                  )}
                </div>
              )}

              {/* Files */}
              {(note.files?.length ?? 0) > 0 && (
                <div className="space-y-1">
                  <p className="font-medium">Files:</p>
                  {note.files?.map(
                    (file: { _id: string; url: string; name: string }) => (
                      <a
                        key={file._id}
                        href={file.url}
                        // target="_blank"
                        download={file.name}
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:underline"
                      >
                        <FaFilePdf /> {file.name}
                      </a>
                    )
                  )}
                </div>
              )}

              {/* Created At */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Created: {format(new Date(note.createdAt), "PPpp")}
                </p>
                <button
                  onClick={() => handleShare(note._id)}
                  className="btn btn-sm btn-primary text-neutral"
                >
                  <FaShare />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
