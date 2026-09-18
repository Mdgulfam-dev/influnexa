import React, { useState } from "react";
import { submitTestimonial } from "../lib/api";
import "../shareexperience.css";

function ShareExperience() {
  const [reviewForm, setReviewForm] = useState({
    name: "",
    role: "",
    type: "Brand",
    email: "",
    rating: "5",
    quote: "",
  });

  const [reviewStatus, setReviewStatus] = useState({
    type: "",
    message: "",
  });

  const updateReviewField = (event) => {
    const { name, value } = event.target;

    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitReview = async (event) => {
    event.preventDefault();

    setReviewStatus({
      type: "",
      message: "",
    });

    try {
      await submitTestimonial({
        ...reviewForm,
        rating: Number(reviewForm.rating),
      });

      setReviewStatus({
        type: "success",
        message:
          "Thank you! Your review has been submitted and is awaiting admin approval.",
      });

      setReviewForm({
        name: "",
        role: "",
        type: "Brand",
        email: "",
        rating: "5",
        quote: "",
      });
    } catch (error) {
      console.error("Testimonial submission error:", error);

      setReviewStatus({
        type: "error",
        message:
          "Email already exist.",
      });
    }
  };

  const goBackToWebsite = () => {
    window.location.href = "/";
  };

  return (
    <div className="share-experience-page">
      <div className="share-experience-container">

        {/* BACK TO WEBSITE */}
        <button
          type="button"
          className="back-website-btn"
          onClick={goBackToWebsite}
        >
          ← Back to Website
        </button>

        {/* HEADER */}
        <div className="share-experience-header">
          <span className="share-experience-eyebrow">
            ✦ INFLUNEXA
          </span>

          <h1>Share Your Influnexa Experience</h1>

          <p>
            Tell us about your experience with Influnexa. Your review will be
            reviewed by our admin team before being published.
          </p>
        </div>

        {/* FORM */}
        <form
          className="testimonial-form share-experience-form"
          onSubmit={submitReview}
        >
          <div className="testimonial-form-grid">

            {/* NAME */}
            <label>
              Name

              <input
                name="name"
                value={reviewForm.name}
                onChange={updateReviewField}
                placeholder="Enter your name"
                required
              />
            </label>

            {/* ROLE */}
            <label>
              Role or company

              <input
                name="role"
                value={reviewForm.role}
                onChange={updateReviewField}
                placeholder="Your role or company"
                required
              />
            </label>

            {/* TYPE */}
            <label>
              Feedback Type

              <select
                name="type"
                value={reviewForm.type}
                onChange={updateReviewField}
                required
              >
                <option value="Brand">Brand</option>
                <option value="Creator">Creator</option>
              </select>
            </label>

            {/* EMAIL */}
            <label>
              Email

              <input
                name="email"
                type="email"
                value={reviewForm.email}
                onChange={updateReviewField}
                placeholder="you@example.com"
              />
            </label>

            {/* RATING */}
            <label>
              Rating

              <select
                name="rating"
                value={reviewForm.rating}
                onChange={updateReviewField}
              >
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </label>

            {/* REVIEW */}
            <label className="wide">
              Review

              <textarea
                name="quote"
                value={reviewForm.quote}
                onChange={updateReviewField}
                placeholder="Share your experience with Influnexa..."
                rows="6"
                required
              />
            </label>

          </div>

          {/* STATUS */}
          {reviewStatus.message && (
            <div
              className={`testimonial-status ${reviewStatus.type}`}
            >
              {reviewStatus.message}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="submit-review-btn"
          >
            Submit Review
          </button>
        </form>

      </div>
    </div>
  );
}

export default ShareExperience;
