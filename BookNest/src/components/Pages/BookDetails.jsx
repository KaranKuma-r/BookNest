import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Firebase";
import { useAuth } from "../Context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";

const BookDetails = () => {
  const { bookId } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // prevents useEffect from overwriting cleared input
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // 🔹 Fetch book & ratings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 📘 Book
        const bookSnap = await getDoc(doc(db, "books", bookId));
        if (bookSnap.exists()) {
          setBook(bookSnap.data());
        }

        // ⭐ Ratings
        const snap = await getDocs(
          collection(db, "books", bookId, "reviews")
        );

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setRatings(data);

        // ⭐ Prefill rating once
        if (user && !hasSubmitted) {
          const myRating = data.find((r) => r.id === user.uid);
          if (myRating) setRating(myRating.rating);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, user, hasSubmitted]);

  // 🔹 Add / Update Rating
  const submitRating = async () => {
    if (!user) return alert("Login required");
    if (rating < 1 || rating > 5) return alert("Rating must be 1–5");

    setSubmitting(true);

    try {
      const ratingRef = doc(db, "books", bookId, "reviews", user.uid);

      const ratingData = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        rating: Number(rating),
      };

      await setDoc(ratingRef, ratingData);

      const ratingWithId = { id: user.uid, ...ratingData };

      const updated =
        ratings.some((r) => r.id === user.uid)
          ? ratings.map((r) =>
              r.id === user.uid ? ratingWithId : r
            )
          : [...ratings, ratingWithId];

      setRatings(updated);

      const avg =
        updated.reduce((sum, r) => sum + r.rating, 0) /
        updated.length;

      await updateDoc(doc(db, "books", bookId), {
        averageRating: avg,
        totalRatings: updated.length,
      });

      setBook((prev) => ({
        ...prev,
        averageRating: avg,
        totalRatings: updated.length,
      }));

      setRating("");
      setHasSubmitted(true);

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;
return (
  <div className="book-page">

    <div className="book-wrapper">

      {/* LEFT */}
      <div className="book-left">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="book-cover"
        />
      </div>

      {/* RIGHT */}
      <div className="book-right">
        <h1 className="book-title">{book.title}</h1>

        <div className="book-rating">
          ⭐ {book.averageRating?.toFixed(1) || "0.0"}
          <span>({book.totalRatings || 0} ratings)</span>
        </div>

        <button
          className="read-btn"
          onClick={() => window.open(book.pdfUrl, "_blank")}
        >
          📖 Read Now
        </button>

        {/* Description */}
        {book.description && (
          <div className="book-description">
            <h3>About this book:</h3>
            <p>{book.description}</p>
          </div>
        )}

        {/* Rating Box */}
        {user && (
          <div className="rating-box">
            <h3>Rate this book</h3>

            <div className="rating-input">
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <button
                onClick={submitRating}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Submit Rating"}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>

  </div>
);



};

export default BookDetails;
