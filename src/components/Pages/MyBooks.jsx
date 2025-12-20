import React, { useEffect, useState } from "react";
import { auth, db } from "../../Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login"); // 🔐 redirect if not logged in
        return;
      }

      try {
        const q = query(
          collection(db, "books"),
          where("ownerId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBooks(booksData);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await deleteDoc(doc(db, "books", id));
      setBooks((prev) => prev.filter((b) => b.id !== id));
      alert("Book deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting book");
    }
  };

  if (loading) {
    return <p className="loading-text">Loading your books...</p>;
  }

  if (books.length === 0) {
    return (
      <div className="no-books-box">
        <div className="no-books-icon">📚</div>

        <h3 className="no-books-title">Your Library Is Empty</h3>
        <p className="no-books-text">
          Start building your personal book collection.
          <br />
          Add your first book now!
        </p>

        <Link to="/addBooks" className="add-book-btn">
          ➕ Add Your First Book
        </Link>
      </div>
    );
  }

  return (
    <div className="my-books">
      <h2>📚 My Books</h2>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="book-img"
              loading="lazy"
            />

            <h3 className="book-title">{book.title}</h3>
            <p className="author">By {book.author}</p>
            <p className="category">Category: {book.category}</p>

            <p className="description">{book.description}</p>

            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="open-btn"
            >
              Read Now
            </a>

            <button
              className="delete-btn"
              onClick={() => deleteBook(book.id)}
            >
              Delete ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
