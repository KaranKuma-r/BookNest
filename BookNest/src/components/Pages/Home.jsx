import React, { useEffect, useState } from "react";
import { db } from "../../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const HomeBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const snapshot = await getDocs(collection(db, "books"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="home-books">
      <h2>📚 All Books</h2>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.coverUrl} alt={book.title} className="book-img" />

            <h3 className="book-title">{book.title}</h3>
            <p className="author">By {book.author}</p>

            {book.averageRating ? (
              <p className="rating">
                ⭐ {book.averageRating.toFixed(1)} / 5 ({book.totalRatings})
              </p>
            ) : (
              <p className="rating">⭐ No ratings yet</p>
            )}

            <button
              className="open-btn"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              Read & Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBooks;
