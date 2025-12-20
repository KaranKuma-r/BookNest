import React, { useState } from "react";
import { db, auth } from "../../Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [pages, setPages] = useState("");
  const [tags, setTags] = useState("");

  const [cover, setCover] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleUpload = async (file, folder) => {
    try {
      const resourceType =
        file.type === "application/pdf" ? "raw" : "image";

      const url = `https://api.cloudinary.com/v1_1/drmuxsv2y/${resourceType}/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "booknest_preset");
      formData.append("folder", folder);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      return data;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 Auth guard (NO UI CHANGE)
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    if (!cover || !pdf) {
      alert("Please upload both cover and PDF");
      return;
    }

    // 📦 File size limits (production safety)
    if (cover.size > 3 * 1024 * 1024) {
      alert("Cover image must be under 3MB");
      return;
    }

    if (pdf.size > 10 * 1024 * 1024) {
      alert("PDF must be under 10MB");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const coverRes = await handleUpload(cover, "booknest/covers");
      if (!coverRes) {
        alert("❌ Cover upload failed");
        return;
      }

      const pdfRes = await handleUpload(pdf, "booknest/pdfs");
      if (!pdfRes) {
        alert("❌ PDF upload failed");
        return;
      }

      await addDoc(collection(db, "books"), {
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        description: description.trim(),
        language: language.trim(),
        publishedYear: Number(publishedYear),
        pages: Number(pages),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),

        ownerId: auth.currentUser.uid,

        coverUrl: coverRes.secure_url,
        coverPublicId: coverRes.public_id,

        pdfUrl: pdfRes.secure_url,
        pdfPublicId: pdfRes.public_id,

        createdAt: serverTimestamp(),
        averageRating: 0,
        totalRatings: 0,
      });

      alert("✅ Book added successfully!");

      // Reset inputs (UI SAME)
      setTitle("");
      setAuthor("");
      setCategory("");
      setDescription("");
      setLanguage("");
      setPublishedYear("");
      setPages("");
      setTags("");
      setCover(null);
      setPdf(null);
    } catch (err) {
      console.error("Add book error:", err);
      alert("⚠️ Error adding book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-book-form">
      <h2 className="form-title">Add New Book</h2>

      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="form-input"
      />

      <input
        type="text"
        placeholder="Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="form-input"
      />

      <input
        type="text"
        placeholder="Category (e.g., Fiction, JavaScript)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="form-input"
      />

      <textarea
        placeholder="Book Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="form-input"
      ></textarea>

      <input
        type="text"
        placeholder="Language (e.g., English)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="form-input"
      />

      <input
        type="number"
        placeholder="Published Year"
        value={publishedYear}
        onChange={(e) => setPublishedYear(e.target.value)}
        className="form-input"
      />

      <input
        type="number"
        placeholder="Total Pages"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        className="form-input"
      />

      <input
        type="text"
        placeholder="Tags (comma separated: study, coding, fiction)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="form-input"
      />

      <label className="file-label">Upload Book Cover</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files[0])}
        required
        className="file-input"
      />

      <label className="file-label">Upload PDF File</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files[0])}
        required
        className="file-input"
      />

      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting ? "Adding..." : "Add Book"}
      </button>
    </form>
  );
}

export default AddBook;
