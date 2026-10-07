import React, { useEffect, useState } from "react";
import {
  createBrandTicket,
  updateBrandTicket,
} from "../lib/api";

function CreateBrandTicket() {
  const editId = new URLSearchParams(window.location.search).get("edit");

  const [ticketForm, setTicketForm] = useState({
    brandName: "",
    campaignName: "",
    fullName: "",
    contactEmail: "",
    objective: "",
    platforms: "",
    status: "Pending",
    startDate: "",
    endDate: "",
    budget: "",
    currency: "INR",
    metrics: {
      creators: 0,
      posts: 0,
      reach: 0,
      impressions: 0,
      engagements: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
    },
    notes: "",
  });

  const [loading, setLoading] = useState(Boolean(editId));
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // LOAD TICKET FOR EDIT
  // =========================================================

  useEffect(() => {
    if (!editId) {
      setLoading(false);
      return;
    }

    const loadTicket = () => {
      try {
        const storedTicket = sessionStorage.getItem(
          "influnexa_edit_brand_ticket"
        );

        if (!storedTicket) {
          alert("Ticket data not found.");
          window.location.href = "/admin#tickets";
          return;
        }

        const ticket = JSON.parse(storedTicket);

        // Make sure the stored ticket matches the URL edit ID
        if (ticket._id && ticket._id !== editId) {
          alert("Invalid ticket data.");
          sessionStorage.removeItem("influnexa_edit_brand_ticket");
          window.location.href = "/admin#tickets";
          return;
        }

        setTicketForm({
          brandName: ticket.brandName || "",
          campaignName: ticket.campaignName || "",
          fullName: ticket.fullName || "",
          contactEmail: ticket.contactEmail || "",
          objective: ticket.objective || "",

          platforms: Array.isArray(ticket.platforms)
            ? ticket.platforms.join(", ")
            : ticket.platforms || "",

          status: ticket.status || "Pending",

          startDate: ticket.startDate
            ? new Date(ticket.startDate).toISOString().slice(0, 10)
            : "",

          endDate: ticket.endDate
            ? new Date(ticket.endDate).toISOString().slice(0, 10)
            : "",

          budget: ticket.budget ?? "",

          currency: ticket.currency || "INR",

          metrics: {
            creators: ticket.metrics?.creators ?? 0,
            posts: ticket.metrics?.posts ?? 0,
            reach: ticket.metrics?.reach ?? 0,
            impressions: ticket.metrics?.impressions ?? 0,
            engagements: ticket.metrics?.engagements ?? 0,
            clicks: ticket.metrics?.clicks ?? 0,
            conversions: ticket.metrics?.conversions ?? 0,
            spend: ticket.metrics?.spend ?? 0,
          },

          notes: ticket.notes || "",
        });
      } catch (error) {
        console.error("Failed to load ticket:", error);
        alert("Unable to load ticket.");
        window.location.href = "/admin#tickets";
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [editId]);

  // =========================================================
  // HANDLE NORMAL FIELD CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTicketForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE METRIC CHANGE
  // =========================================================

  const handleMetricChange = (e) => {
    const { name, value } = e.target;

    setTicketForm((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: value,
      },
    }));
  };

  // =========================================================
  // SUBMIT CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      brandName: ticketForm.brandName?.trim(),

      campaignName: ticketForm.campaignName?.trim(),

      fullName: ticketForm.fullName?.trim(),

      contactEmail: ticketForm.contactEmail?.trim(),

      objective: ticketForm.objective?.trim(),

      platforms: (ticketForm.platforms || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      status: ticketForm.status,

      startDate: ticketForm.startDate,

      endDate: ticketForm.endDate,

      budget: Number(ticketForm.budget || 0),

      currency: ticketForm.currency?.trim(),

      metrics: {
        creators: Number(
          ticketForm.metrics.creators || 0
        ),

        posts: Number(
          ticketForm.metrics.posts || 0
        ),

        reach: Number(
          ticketForm.metrics.reach || 0
        ),

        impressions: Number(
          ticketForm.metrics.impressions || 0
        ),

        engagements: Number(
          ticketForm.metrics.engagements || 0
        ),

        clicks: Number(
          ticketForm.metrics.clicks || 0
        ),

        conversions: Number(
          ticketForm.metrics.conversions || 0
        ),

        spend: Number(
          ticketForm.metrics.spend || 0
        ),
      },

      notes: ticketForm.notes?.trim() || "",
    };

    try {
      setSubmitting(true);

      // =====================================================
      // UPDATE EXISTING TICKET
      // =====================================================

      if (editId) {
        await updateBrandTicket(editId, payload);

        // Remove temporary edit ticket data
        sessionStorage.removeItem(
          "influnexa_edit_brand_ticket"
        );

        alert("Brand ticket updated successfully.");
      }

      // =====================================================
      // CREATE NEW TICKET
      // =====================================================

      else {
        await createBrandTicket(payload);

        alert("Brand ticket created successfully.");
      }

      // =====================================================
      // BACK TO DASHBOARD
      // =====================================================

      window.location.href = "/admin#tickets";

    } catch (error) {
      console.error("Failed to save brand ticket:", error);

      alert(
        error.message ||
          "Unable to save brand ticket."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="admin-ticket-workspace create-ticket-page">
        <div className="admin-panel">
          <h2>Loading ticket...</h2>
        </div>
      </div>
    );
  }

  // =========================================================
  // FORM
  // =========================================================

  return (
    <div className="admin-ticket-workspace create-ticket-page">

      {/* Back to Tickets */}
      <div className="create-ticket-back-row">

        <button
          type="button"
          className="create-ticket-back-btn"
          onClick={() => {
            sessionStorage.removeItem(
              "influnexa_edit_brand_ticket"
            );

            window.location.href = "/admin#tickets";
          }}
        >
          ← Back to Tickets
        </button>

      </div>

      <form
        className="admin-panel admin-blog-form"
        onSubmit={handleSubmit}
      >

        {/* =====================================================
            TITLE
        ===================================================== */}

        <div className="admin-panel-title-row">

          <h2>
            {editId
              ? "Edit Brand Ticket"
              : "Create Brand Ticket"}
          </h2>

        </div>

        {/* =====================================================
            BRAND NAME + CAMPAIGN NAME
        ===================================================== */}

        <div className="admin-form-row">

          <label>
            Brand name{" "}
            <span className="admin-required">*</span>

            <input
              name="brandName"
              type="text"
              value={ticketForm.brandName}
              onChange={handleChange}
              required
            />
          </label>
          

          <label>
            Campaign name{" "}
            <span className="admin-required">*</span>

            <input
              name="campaignName"
              type="text"
              value={ticketForm.campaignName}
              onChange={handleChange}
              required
            />
          </label>

        </div>

        {/* =====================================================
            FULL NAME + EMAIL
        ===================================================== */}

        <div className="admin-form-row">

          <label>
            Full name{" "}
            <span className="admin-required">*</span>

            <input
              name="fullName"
              type="text"
              value={ticketForm.fullName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contact email{" "}
            <span className="admin-required">*</span>

            <input
              name="contactEmail"
              type="email"
              value={ticketForm.contactEmail}
              onChange={handleChange}
              required
            />
          </label>

        </div>

        {/* =====================================================
            OBJECTIVE
        ===================================================== */}

        <label>
          Campaign objective{" "}
          <span className="admin-required">*</span>

          <textarea
            name="objective"
            rows="2"
            placeholder="Awareness, product launch, conversions..."
            value={ticketForm.objective}
            onChange={handleChange}
            required
          />
        </label>

        {/* =====================================================
            PLATFORMS + STATUS
        ===================================================== */}

        <div className="admin-form-row">

          <label>
            Platforms{" "}
            <span className="admin-required">*</span>

            <input
              name="platforms"
              type="text"
              placeholder="Instagram, YouTube"
              value={ticketForm.platforms}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Status{" "}
            <span className="admin-required">*</span>

            <select
              name="status"
              value={ticketForm.status}
              onChange={handleChange}
              required
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </label>

        </div>

        {/* =====================================================
            DATES
        ===================================================== */}

        <div className="admin-form-row">

          <label>
            Start date{" "}
            <span className="admin-required">*</span>

            <input
              name="startDate"
              type="date"
              value={ticketForm.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            End date{" "}
            <span className="admin-required">*</span>

            <input
              name="endDate"
              type="date"
              value={ticketForm.endDate}
              onChange={handleChange}
              required
            />
          </label>

        </div>

        {/* =====================================================
            BUDGET + CURRENCY
        ===================================================== */}

        <div className="admin-form-row">

          <label>
            Budget{" "}
            <span className="admin-required">*</span>

            <input
              min="0"
              name="budget"
              type="number"
              value={ticketForm.budget}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Currency{" "}
            <span className="admin-required">*</span>

            <input
              name="currency"
              type="text"
              value={ticketForm.currency}
              onChange={handleChange}
              required
            />
          </label>

        </div>

        {/* =====================================================
            CAMPAIGN PERFORMANCE
        ===================================================== */}

        <h3 className="admin-ticket-subheading">
          Campaign performance
        </h3>

        <div className="admin-ticket-metrics">

          {[
            ["creators", "Creators"],
            ["posts", "Posts"],
            ["reach", "Reach"],
            ["impressions", "Impressions"],
            ["engagements", "Engagements"],
            ["clicks", "Clicks"],
            ["conversions", "Conversions"],
            ["spend", "Spend"],
          ].map(([key, label]) => (

            <label key={key}>

              {label}

              <input
                min="0"
                name={key}
                type="number"
                value={
                  ticketForm.metrics[key] ?? 0
                }
                onChange={handleMetricChange}
              />

            </label>

          ))}

        </div>

        {/* =====================================================
            NOTES
        ===================================================== */}

        <label>
          Internal notes

          <textarea
            name="notes"
            rows="3"
            value={ticketForm.notes}
            onChange={handleChange}
          />

        </label>

        {/* =====================================================
            BUTTONS
        ===================================================== */}

        <div className="admin-login-actions">

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? editId
                ? "Updating..."
                : "Creating..."
              : editId
              ? "Update Ticket"
              : "Create Ticket"}
          </button>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(
                "influnexa_edit_brand_ticket"
              );

              window.location.href =
                "/admin#tickets";
            }}
            disabled={submitting}
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}

export default CreateBrandTicket;