import React, { useCallback, useEffect, useState } from "react";
import { getLeadWorkflow } from "../lib/api";
import "../leadworkflow.css"
// ============================================================
// STATUS COLUMNS
// ============================================================

const STATUS_COLUMNS = [
  { key: "pending", label: "Pending" },
  { key: "reachout", label: "Reachout" },
  { key: "followup1", label: "Followup-1" },
  { key: "followup2", label: "Followup-2" },
  { key: "followup3", label: "Followup-3" },
  { key: "nurture", label: "Nurture" },
  { key: "interested", label: "Interested" },
  { key: "verified", label: "Verified" },
  { key: "proposalSent", label: "Proposal Sent" },
  { key: "negotiation", label: "Negotiation" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
  { key: "noResponse", label: "No Response" },
  { key: "notUseful", label: "Not Useful" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...STATUS_COLUMNS,
];

// ============================================================
// COMPONENT
// ============================================================

export default function LeadWorkflowSection({ refreshKey = 0 }) {
  const [leads, setLeads] = useState([]);
  const [summary, setSummary] = useState({});

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD WORKFLOW
  // ==========================================================
const loadWorkflow = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();

    params.set("page", page);
    params.set("limit", limit);

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (status) {
      params.set("status", status);
    }

    const response = await getLeadWorkflow(
      `?${params.toString()}`
    );

    console.log("LEAD WORKFLOW API RESPONSE:", response);

    // Backend returns:
    // {
    //   success: true,
    //   data: {
    //     leads: [],
    //     summary: {},
    //     pagination: {}
    //   }
    // }

    setLeads(response?.data?.leads || []);

    setSummary(response?.data?.summary || {});

    setPagination(
      response?.data?.pagination || {
        page,
        limit,
        total: 0,
        totalPages: 0,
      }
    );
  } catch (err) {
    console.error(
      "Lead workflow load error:",
      err
    );

    setError(
      err?.message ||
        "Failed to load brand workflow."
    );
  } finally {
    setLoading(false);
  }
}, [page, limit, search, status]);
  // ==========================================================
  // LOAD WHEN FILTER/PAGE/REFRESH CHANGES
  // ==========================================================

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow, refreshKey]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // ==========================================================
  // PREVIOUS PAGE
  // ==========================================================

  const handlePrevious = () => {
    setPage((current) => Math.max(current - 1, 1));
  };

  // ==========================================================
  // NEXT PAGE
  // ==========================================================

  const handleNext = () => {
    setPage((current) =>
      Math.min(
        current + 1,
        pagination.totalPages || 1
      )
    );
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================================
  // SUMMARY CARD
  // ==========================================================

  const SummaryCard = ({ label, value }) => (
    <div className="lead-workflow-summary-card">
      <span className="lead-workflow-summary-label">
        {label}
      </span>

      <strong className="lead-workflow-summary-value">
        {(value || 0).toLocaleString()}
      </strong>
    </div>
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="lead-workflow-section">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="lead-workflow-header">
        <div>
          <h2 className="lead-workflow-title">
            Brand Lead Workflow
          </h2>

          <p className="lead-workflow-subtitle">
            Track how many brand workflow statuses each lead
            has completed.
          </p>
        </div>

       
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="lead-workflow-summary-grid">
        <SummaryCard
          label="Total Completed"
          value={summary.totalCompleted}
        />

        <SummaryCard
          label="Pending"
          value={summary.pending}
        />

        <SummaryCard
          label="Reachout"
          value={summary.reachout}
        />

        <SummaryCard
          label="Followup-1"
          value={summary.followup1}
        />

        <SummaryCard
          label="Followup-2"
          value={summary.followup2}
        />

        <SummaryCard
          label="Followup-3"
          value={summary.followup3}
        />

        <SummaryCard
          label="Interested"
          value={summary.interested}
        />

        <SummaryCard
          label="Won"
          value={summary.won}
        />
      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="lead-workflow-filters">
        <div className="lead-workflow-search-wrap">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search lead name or email..."
            className="lead-workflow-search"
          />
        </div>

        <select
          value={status}
          onChange={handleStatusChange}
          className="lead-workflow-status-filter"
        >
         {STATUS_OPTIONS.map((option, index) => (
  <option
    key={`${option.value || "empty"}-${index}`}
    value={option.value}
  >
    {option.label}
  </option>
))}
        </select>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="lead-workflow-error">
          {error}
        </div>
      )}

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="lead-workflow-table-wrapper">
        <table className="lead-workflow-table">
          <thead>
            <tr>
              <th className="lead-workflow-sticky-column">
                Lead
              </th>

              <th>Total</th>

              {STATUS_COLUMNS.map((column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              ))}

              <th>Last Completed</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={STATUS_COLUMNS.length + 3}
                  className="lead-workflow-empty"
                >
                  Loading workflow...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td
                  colSpan={STATUS_COLUMNS.length + 3}
                  className="lead-workflow-empty"
                >
                  No workflow records found.
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <tr
                  key={`${lead.email}-${index}`}
                >
                  {/* LEAD */}
                  <td className="lead-workflow-sticky-column lead-workflow-person">
                    <strong>
                      {lead.name || "Unknown"}
                    </strong>

                    <span>
                      {lead.email || "No email"}
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="lead-workflow-total">
                    {(
                      lead.totalCompleted || 0
                    ).toLocaleString()}
                  </td>

                  {/* STATUS COUNTS */}
                  {STATUS_COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      className={
                        lead[column.key] > 0
                          ? "lead-workflow-count has-value"
                          : "lead-workflow-count"
                      }
                    >
                      {(
                        lead[column.key] || 0
                      ).toLocaleString()}
                    </td>
                  ))}

                  {/* LAST COMPLETED */}
                  <td>
                    {formatDate(
                      lead.lastCompletedAt
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      <div className="lead-workflow-pagination">
        <span>
          {pagination.total > 0
            ? `Showing ${
                (pagination.page - 1) *
                  pagination.limit +
                1
              }–${Math.min(
                pagination.page *
                  pagination.limit,
                pagination.total
              )} of ${pagination.total.toLocaleString()}`
            : "No records"}
        </span>

        <div className="lead-workflow-pagination-buttons">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={
              loading ||
              pagination.page <= 1
            }
          >
            ← Previous
          </button>

          <span>
            Page {pagination.page || 1} of{" "}
            {pagination.totalPages || 1}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={
              loading ||
              pagination.page >=
                (pagination.totalPages || 1)
            }
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}