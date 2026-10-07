import React, { useEffect, useMemo, useState } from "react";
import {
  getAssignedCreators,
  getBrandTickets,
} from "../lib/api";

const AssignedTicketCreators = () => {

  
const [creatorActions, setCreatorActions] = useState({});
const [creatorCommercials, setCreatorCommercials] = useState({});
const [creatorReadyStatus, setCreatorReadyStatus] = useState({});


  const [ticket, setTicket] = useState(null);
  const [assignedCreators, setAssignedCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatorSearch, setCreatorSearch] = useState("");
  const [expandedCells, setExpandedCells] = useState({});
  const [selectedCreatorIds, setSelectedCreatorIds] = useState([]);

  const ticketId = new URLSearchParams(
    window.location.search
  ).get("ticket");

  useEffect(() => {
    loadData();
  }, [ticketId]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (!ticketId) {
        throw new Error("Brand ticket ID is missing.");
      }

      const [tickets, creators] = await Promise.all([
        getBrandTickets(),
        getAssignedCreators(ticketId),
      ]);

      const currentTicket = tickets.find(
        (item) => item._id === ticketId
      );

      setTicket(currentTicket || null);
      setAssignedCreators(creators || []);
    } catch (error) {
      console.error(
        "GET ASSIGNED CREATORS ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to load assigned creators."
      );
    } finally {
      setLoading(false);
    }
  };


/* =========================================================
   CREATOR ACTION / COMMERCIAL / READY TO CAMPAIGN
========================================================= */

const handleCreatorAction = (creatorId, value) => {
  setCreatorActions((prev) => ({
    ...prev,
    [creatorId]: value,
  }));
};

const handleCreatorCommercial = (creatorId, value) => {
  setCreatorCommercials((prev) => ({
    ...prev,
    [creatorId]: value,
  }));
};

const handleReadyToCampaign = (creatorId, value) => {
  setCreatorReadyStatus((prev) => ({
    ...prev,
    [creatorId]: value,
  }));
};



  /* =========================================================
     SEE MORE / SEE LESS
  ========================================================= */

  const toggleCell = (creatorId, field) => {
    const key = `${creatorId}-${field}`;

    setExpandedCells((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderLongText = (
    creator,
    field,
    value,
    limit = 35
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const text = Array.isArray(value)
      ? value.join(", ")
      : String(value);

    if (text.length <= limit) {
      return text;
    }

    const key = `${creator._id}-${field}`;
    const expanded = expandedCells[key];

    return (
      <div className="max-w-[18.75vw] leading-[1.6]">
        <span
          className={
            expanded
              ? "whitespace-normal break-words"
              : "break-words"
          }
        >
          {expanded
            ? text
            : `${text.slice(0, limit)}...`}
        </span>

        <button
          type="button"
          onClick={() =>
            toggleCell(creator._id, field)
          }
          className="
            ml-[0.5vw]
            text-blue-500
            font-semibold
            hover:text-blue-400
            cursor-pointer
            whitespace-nowrap
            transition-colors
          "
        >
          {expanded ? "See Less" : "See More"}
        </button>
      </div>
    );
  };

  /* =========================================================
     CLICKABLE LINK
  ========================================================= */

  const renderLink = (
    creator,
    field,
    value,
    limit = 35
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const url = String(value).trim();

    const href = /^https?:\/\//i.test(url)
      ? url
      : `https://${url}`;

    if (url.length <= limit) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="
            text-blue-600
            hover:text-blue-700
            hover:underline
            cursor-pointer
            break-all
          "
        >
          {url}
        </a>
      );
    }

    const key = `${creator._id}-${field}`;
    const expanded = expandedCells[key];

    return (
      <div className="max-w-[18.75vw] leading-[1.6]">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="
            text-blue-600
            hover:text-blue-700
            hover:underline
            cursor-pointer
            break-all
          "
        >
          {expanded
            ? url
            : `${url.slice(0, limit)}...`}
        </a>

        <button
          type="button"
          onClick={() =>
            toggleCell(creator._id, field)
          }
          className="
            ml-[0.5vw]
            text-blue-600
            font-semibold
            hover:text-blue-700
            hover:underline
            cursor-pointer
            whitespace-nowrap
            transition-colors
          "
        >
          {expanded ? "See Less" : "See More"}
        </button>
      </div>
    );
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredCreators = useMemo(() => {
    const search = creatorSearch
      .trim()
      .toLowerCase();

    if (!search) {
      return assignedCreators;
    }

    return assignedCreators.filter((creator) =>
      [
        creator.fullName,
        creator.instagramUsername,
        creator.instagramProfileLink,
        creator.email,
        creator.phoneNumber,
        creator.whatsappNumber,
        creator.categories,
        creator.campaignType,
        creator.influencerType,
        creator.gender,
        creator.languages,
        creator.fullAddress,
        creator.city,
        creator.state,
        creator.country,
        creator.youtubeUsername,
        creator.youtubeChannelLink,
        creator.bio,
        creator.InflunexaUserId,
        creator.influnexaUserId,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(search)
        )
    );
  }, [
    assignedCreators,
    creatorSearch,
  ]);

  /* =========================================================
     CREATOR SELECTION
  ========================================================= */

  const toggleCreatorSelection = (creatorId) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredCreators.map(
      (creator) => creator._id
    );

    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) =>
        selectedCreatorIds.includes(id)
      );

    if (allSelected) {
      setSelectedCreatorIds((prev) =>
        prev.filter(
          (id) => !filteredIds.includes(id)
        )
      );
    } else {
      setSelectedCreatorIds((prev) => [
        ...new Set([
          ...prev,
          ...filteredIds,
        ]),
      ]);
    }
  };

  /* =========================================================
     DOWNLOAD ALL ASSIGNED CREATORS CSV
  ========================================================= */

  const downloadCSV = () => {
    if (!filteredCreators.length) {
      alert("No creators available to download.");
      return;
    }

    // If creators are selected, download only selected creators.
    // If nothing is selected, existing filtered download behavior remains.
    const creatorsToDownload =
      selectedCreatorIds.length > 0
        ? assignedCreators.filter((creator) =>
            selectedCreatorIds.includes(
              creator._id
            )
          )
        : filteredCreators;

    if (!creatorsToDownload.length) {
      alert(
        "No selected creators available to download."
      );
      return;
    }

    const headers = [
      "SL.No.",
      "Full Name",
      "Instagram Username",
      "Instagram Profile Link",
      "Instagram Follower Range",
      "Exact Followers",
      "Phone Number",
      "Whatsapp Number",
      "Email",
      "Categories",
      "Campaign Type",
      "Influencer Type",
      "Gender",
      "Date of Birth",
      "Languages",
      "Full Address",
      "Landmark",
      "City",
      "State",
      "Country",
      "Pincode",
      "Youtube Username",
      "Youtube Channel Link",
      "Youtube Subscribers Range",
      "Commercials For 1 Instagram Reel",
      "Photo Link",
      "Commercials For 1 Instagram Story",
      "Commercials For 1 Instagram Post",
      "Commercials For 1 Dedicated YouTube Video",
      "Commercials For 1 Integrated YouTube Video",
      "Commercials For 1 Dedicated YouTube Shorts Video",
      "Commercials For 1 Integrated YouTube Shorts Video",
      "What Kind Of Deal Do You Participate In",
      "Speaking Video Link",
      "Are you a TV/movies/OTT celebrity",
      "What all platforms are you avilable on",
      "Type Of Celebrity",
      "How many Amazon reviews you do per month",
      "Platform",
      "Bio",
      "InflunexaUserId",
    ];

    const escapeCSV = (value) => {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "";
      }

      if (Array.isArray(value)) {
        value = value.join(", ");
      }

      const text = String(value);

      return `"${text.replace(/"/g, '""')}"`;
    };

    // DOWNLOAD ONLY CURRENTLY SELECTED OR FILTERED CREATORS
    const rows = creatorsToDownload.map(
      (creator, index) =>
        [
          index + 1,
          creator.fullName,
          creator.instagramUsername,
          creator.instagramProfileLink,
          creator.instagramFollowerRange,
          creator.exactFollowers,
          creator.phoneNumber,
          creator.whatsappNumber,
          creator.email,
          creator.categories,
          creator.campaignType,
          creator.influencerType,
          creator.gender,
          creator.dateOfBirth
            ? new Date(
                creator.dateOfBirth
              ).toLocaleDateString()
            : "",
          creator.languages,
          creator.fullAddress,
          creator.landmark,
          creator.city,
          creator.state,
          creator.country,
          creator.pincode,
          creator.youtubeUsername,
          creator.youtubeChannelLink,
          creator.youtubeSubscribersRange,
          creator.commercialsFor1InstagramReel,
          creator.photoLink,
          creator.commercialsFor1InstagramStory,
          creator.commercialsFor1InstagramPost,
          creator.commercialsFor1DedicatedYoutubeVideo,
          creator.commercialsFor1IntegratedYoutubeVideo,
          creator.commercialsFor1DedicatedYoutubeShortsVideo,
          creator.commercialsFor1IntegratedYoutubeShortsVideo,
          creator.whatKindOfDealDoYouParticipateIn,
          creator.speakingVideoLink,
          creator.isCelebrity !== undefined
            ? creator.isCelebrity
              ? "Yes"
              : "No"
            : "",
          creator.availablePlatforms,
          creator.typeOfCelebrity,
          creator.amazonReviewsPerMonth,
          creator.platform,
          creator.createdAt
            ? new Date(
                creator.createdAt
              ).toLocaleString()
            : "",
          creator.updatedAt
            ? new Date(
                creator.updatedAt
              ).toLocaleString()
            : "",
          creator.bio,
          creator.InflunexaUserId ||
            creator.influnexaUserId,
        ]
          .map(escapeCSV)
          .join(",")
    );

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const ticketName = (
      ticket?.ticketNumber ||
      ticket?.brandName ||
      "assigned-creators"
    )
      .toString()
      .replace(/[^a-z0-9-_]+/gi, "-");

    const link = document.createElement("a");

    link.href = url;

    link.download = `${ticketName}-assigned-creators.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-page">
        <div
          className="
            admin-panel
            mx-[1.75vw]
            mt-[1.25vw]
          "
        >
          <div
            className="
              flex
              items-center
              gap-[0.75vw]
              text-slate-600
            "
          >
            <div
              className="
                w-[1.25vw]
                h-[1.25vw]
                min-w-[18px]
                min-h-[18px]
                rounded-full
                border-[0.15vw]
                border-slate-200
                border-t-emerald-600
                animate-spin
              "
            />

            <span className="font-medium text-[0.9vw]">
              Loading assigned creators...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     TICKET NOT FOUND
  ========================================================= */

  if (!ticket) {
    return (
      <div className="admin-page">
        <div
          className="
            admin-panel
            mx-[1.75vw]
            mt-[1.25vw]
          "
        >
          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/admin#tickets")
            }
            className="
              mb-[1.25vw]
              inline-flex
              items-center
              gap-[0.5vw]
              px-[1vw]
              py-[0.65vw]
              rounded-[0.75vw]
              bg-slate-900
              text-white
              text-[0.85vw]
              font-semibold
              hover:bg-slate-800
              transition-colors
              cursor-pointer
            "
          >
            ← Back to Tickets
          </button>

          <h2
            className="
              text-[1.25vw]
              font-bold
              text-slate-900
            "
          >
            Brand ticket not found.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        admin-page
        w-full
        min-h-screen
        pt-[1.5vw]
        pb-[2vw]
        overflow-visible
      "
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          admin-panel
          mx-[1.75vw]
          mt-[1.25vw]
          mb-[1.25vw]
          bg-white
          border
          border-slate-200
          rounded-[1.5vw]
          shadow-sm
        "
      >
        {/* ===================================================
            HEADER TOP
        =================================================== */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-[1.5vw]
            flex-wrap
          "
        >
          {/* LEFT */}

          <div className="min-w-0">
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "/admin#tickets")
              }
              className="
                mb-[1vw]
                inline-flex
                items-center
                gap-[0.45vw]
                text-[0.85vw]
                font-semibold
                text-slate-500
                hover:text-emerald-600
                transition-colors
                cursor-pointer
              "
            >
              ← Back to Tickets
            </button>

            <div
              className="
                text-[0.7vw]
                font-bold
                tracking-[0.18em]
                text-emerald-600
              "
            >
              ASSIGNED CREATORS
            </div>

            <h1
              className="
                mt-[0.5vw]
                text-[1.75vw]
                font-bold
                text-slate-900
                break-words
                leading-tight
              "
            >
              {ticket.ticketNumber} ·{" "}
              {ticket.brandName}
            </h1>

            <p
              className="
                mt-[0.35vw]
                text-[0.95vw]
                text-slate-500
                break-words
              "
            >
              {ticket.campaignName}
            </p>
          </div>

          {/* RIGHT — COUNT + DOWNLOAD */}

          <div
            className="
              shrink-0
              flex
              items-center
              gap-[0.75vw]
            "
          >
            {/* COUNT */}

            <div
              className="
                min-w-[11.25vw]
                px-[1.25vw]
                py-[1vw]
                rounded-[1.25vw]
                bg-emerald-50
                border
                border-emerald-100
              "
            >
              <span
                className="
                  block
                  text-[0.7vw]
                  font-semibold
                  text-emerald-700
                  whitespace-nowrap
                "
              >
                ASSIGNED CREATORS
              </span>

              <strong
                className="
                  block
                  mt-[0.3vw]
                  text-[1.5vw]
                  font-bold
                  text-slate-900
                "
              >
                {assignedCreators.length.toLocaleString()}
              </strong>

              {selectedCreatorIds.length > 0 && (
                <span
                  className="
                    block
                    mt-[0.15vw]
                    text-[0.65vw]
                    font-semibold
                    text-emerald-600
                    whitespace-nowrap
                  "
                >
                  {selectedCreatorIds.length.toLocaleString()} selected
                </span>
              )}
            </div>

            {/* DOWNLOAD CSV */}

            <button
              onClick={downloadCSV}
              disabled={!assignedCreators.length}
              className="
                h-11
                px-5
                rounded-xl
                bg-emerald-600
                hover:bg-emerald-700
                disabled:bg-slate-300
                disabled:cursor-not-allowed
                text-white
                text-sm
                font-semibold
                transition
                whitespace-nowrap
                cursor-pointer
              "
            >
              {selectedCreatorIds.length > 0
                ? `Download Selected (${selectedCreatorIds.length})`
                : "Download CSV"}
            </button>
          </div>
        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="mt-[1.5vw]">
          <div
            className="
              relative
              w-full
            "
          >
            <span
              className="
                absolute
                left-[1vw]
                top-1/2
                -translate-y-1/2
                text-[1vw]
                text-slate-400
                pointer-events-none
              "
            >
              🔍
            </span>

            <input
              type="text"
              value={creatorSearch}
              onChange={(e) =>
                setCreatorSearch(e.target.value)
              }
              placeholder="Search Creator By Name, Email, Instagram..."
              className="
                w-full
                h-[3vw]
                min-h-[42px]
                max-h-[52px]
                pl-[2.75vw]
                pr-[1vw]
                rounded-[0.8vw]
                border
                border-slate-200
                bg-white
                text-[0.85vw]
                text-slate-700
                placeholder:text-slate-400
                outline-none
                transition-all
                focus:border-gray-600
                focus:ring-[0.15vw]
                focus:ring-emerald-100
              "
            />
          </div>

          {creatorSearch && (
            <div
              className="
                mt-[0.5vw]
                text-[0.7vw]
                text-slate-500
              "
            >
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredCreators.length.toLocaleString()}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {assignedCreators.length.toLocaleString()}
              </span>{" "}
              assigned creators
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          TABLE CONTAINER
      ===================================================== */}

      <div
        className="
          mx-[1.75vw]
          border
          border-slate-200
          rounded-[1.25vw]
          bg-white
          overflow-hidden
          shadow-sm
        "
      >
        <div
          className="
            relative
            isolate
            w-full
            overflow-x-auto
            overflow-y-auto
            max-h-[40.625vw]
            min-h-[20vw]
          "
        >
          <table
            className="
              min-w-[225vw]
              w-max
              text-[0.9vw]
              border-separate
              border-spacing-0
            "
          >
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead className="bg-slate-50">
              <tr>
                {[
                  "SL.No.",
                  "Full Name",
                  "Instagram Username",
                  "Instagram Profile Link",
                  "Instagram Follower Range",
                  "Exact Followers",
                  "Phone Number",
                  "Whatsapp Number",
                  "Email",
                  "Categories",
                  "Campaign Type",
                  "Influencer Type",
                  "Gender",
                  "Date of Birth",
                  "Languages",
                  "Full Address",
                  "Landmark",
                  "City",
                  "State",
                  "Country",
                  "Pincode",
                  "Youtube Username",
                  "Youtube Channel Link",
                  "Youtube Subscribers Range",
                  "Commercials For 1 Instagram Reel",
                  "Photo Link",
                  "Commercials For 1 Instagram Story",
                  "Commercials For 1 Instagram Post",
                  "Commercials For 1 Dedicated YouTube Video",
                  "Commercials For 1 Integrated YouTube Video",
                  "Commercials For 1 Dedicated YouTube Shorts Video",
                  "Commercials For 1 Integrated YouTube Shorts Video",
                  "What Kind Of Deal Do You Participate In",
                  "Speaking Video Link",
                  "Are you a TV/movies/OTT celebrity",
                  "What all platforms are you avilable on",
                  "Type Of Celebrity",
                  "How many Amazon reviews you do per month",
                  "Platform",
                  "Commercial",
                  "Ready to Campaign",
                  "Status",
                  "Action",
                  "Bio",
                  "InflunexaUserId",
                ].map((header, index) => (
                  <th
                    key={header}
                    className={`
                      sticky
                      top-0
                      z-30
                      px-[1vw]
                      py-[0.9vw]
                      text-left
                      text-[1vw]
                      font-bold
                      tracking-[0.08em]
                      text-slate-500
                      bg-slate-50
                      border-b
                      border-slate-200
                      whitespace-nowrap
                      shadow-[0_1px_0_rgba(226,232,240,1)]

                      ${
                        index === 1
                          ? `
                            left-0
                            z-50
                            w-[13.75vw]
                            min-w-[13.75vw]
                            max-w-[13.75vw]
                            border-r
                            border-slate-200
                            bg-slate-50
                          `
                          : ""
                      }
                    `}
                  >
                    {index === 0 ? (
                      <div className="flex items-center gap-[0.5vw]">
                        <input
                          type="checkbox"
                          checked={
                            filteredCreators.length > 0 &&
                            filteredCreators.every((creator) =>
                              selectedCreatorIds.includes(
                                creator._id
                              )
                            )
                          }
                          onChange={toggleSelectAll}
                          className="
                            w-4
                            h-4
                            accent-emerald-600
                            cursor-pointer
                          "
                        />

                        <span>{header}</span>
                      </div>
                    ) : (
                      header
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {filteredCreators.length === 0 ? (
                <tr>
                  <td
                    colSpan={43}
                    className="
                      px-[1.5vw]
                      py-[4vw]
                      text-center
                      border-b
                      border-slate-200
                    "
                  >
                    <div
                      className="
                        text-[2vw]
                        mb-[0.75vw]
                      "
                    >
                      🔍
                    </div>

                    <div
                      className="
                        text-[0.95vw]
                        font-semibold
                        text-slate-700
                      "
                    >
                      No creators found
                    </div>

                    <div
                      className="
                        mt-[0.25vw]
                        text-[0.8vw]
                        text-slate-400
                      "
                    >
                      Try changing your search.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCreators.map(
                  (creator, index) => (
                    <tr
                      key={creator._id}
                      className="
                        group
                        hover:bg-emerald-50/30
                        transition-colors
                      "
                    >
                      {/* 1. SL NO + CHECKBOX */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          text-slate-500
                          whitespace-nowrap
                          align-top
                        "
                      >
                        <div className="flex items-center gap-[0.5vw]">
                          <input
                            type="checkbox"
                            checked={selectedCreatorIds.includes(
                              creator._id
                            )}
                            onChange={() =>
                              toggleCreatorSelection(
                                creator._id
                              )
                            }
                            className="
                              w-4
                              h-4
                              accent-emerald-600
                              cursor-pointer
                            "
                          />

                          <span>{index + 1}</span>
                        </div>
                      </td>

                      {/* 2. FULL NAME */}

                      <td
                        className="
                          sticky
                          left-0
                          z-20
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-r
                          border-slate-200
                          bg-white
                          group-hover:bg-emerald-50
                          align-top
                          w-[13.75vw]
                          min-w-[13.75vw]
                          max-w-[13.75vw]
                          transition-colors
                        "
                      >
                        {renderLongText(
                          creator,
                          "fullName",
                          creator.fullName,
                          30
                        )}
                      </td>

                      {/* 3. INSTAGRAM USERNAME */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {renderLongText(
                          creator,
                          "instagramUsername",
                          creator.instagramUsername
                        )}
                      </td>

                      {/* 4. INSTAGRAM PROFILE LINK */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          text-blue-500
                        "
                      >
                        {renderLink(
                          creator,
                          "instagramProfileLink",
                          creator.instagramProfileLink
                        )}
                      </td>

                      {/* 5. INSTAGRAM FOLLOWER RANGE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.instagramFollowerRange ||
                          "—"}
                      </td>

                      {/* 6. EXACT FOLLOWERS */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {Number(
                          creator.exactFollowers || 0
                        ).toLocaleString()}
                      </td>

                      {/* 7. PHONE NUMBER */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.phoneNumber || "—"}
                      </td>

                      {/* 8. WHATSAPP NUMBER */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.whatsappNumber || "—"}
                      </td>

                      {/* 9. EMAIL */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "email",
                          creator.email
                        )}
                      </td>

                      {/* 10. CATEGORIES */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "categories",
                          creator.categories
                        )}
                      </td>

                      {/* 11. CAMPAIGN TYPE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "campaignType",
                          creator.campaignType
                        )}
                      </td>

                      {/* 12. INFLUENCER TYPE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.influencerType || "—"}
                      </td>

                      {/* 13. GENDER */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.gender || "—"}
                      </td>

                      {/* 14. DATE OF BIRTH */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.dateOfBirth
                          ? new Date(
                              creator.dateOfBirth
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* 15. LANGUAGES */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "languages",
                          creator.languages
                        )}
                      </td>

                      {/* 16. FULL ADDRESS */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "fullAddress",
                          creator.fullAddress,
                          45
                        )}
                      </td>

                      {/* 17. LANDMARK */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "landmark",
                          creator.landmark
                        )}
                      </td>

                      {/* 18. CITY */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.city || "—"}
                      </td>

                      {/* 19. STATE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.state || "—"}
                      </td>

                      {/* 20. COUNTRY */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.country || "—"}
                      </td>

                      {/* 21. PINCODE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.pincode || "—"}
                      </td>

                      {/* 22. YOUTUBE USERNAME */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "youtubeUsername",
                          creator.youtubeUsername
                        )}
                      </td>

                      {/* 23. YOUTUBE CHANNEL LINK */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLink(
                          creator,
                          "youtubeChannelLink",
                          creator.youtubeChannelLink
                        )}
                      </td>

                      {/* 24. YOUTUBE SUBSCRIBERS RANGE */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.youtubeSubscribersRange ||
                          "—"}
                      </td>

                      {/* 25. COMMERCIALS INSTAGRAM REEL */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1InstagramReel ||
                          "—"}
                      </td>

                      {/* 26. PHOTO LINK */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLink(
                          creator,
                          "photoLink",
                          creator.photoLink
                        )}
                      </td>

                      {/* 27. COMMERCIALS INSTAGRAM STORY */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1InstagramStory ||
                          "—"}
                      </td>

                      {/* 28. COMMERCIALS INSTAGRAM POST */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1InstagramPost ||
                          "—"}
                      </td>

                      {/* 29. DEDICATED YOUTUBE VIDEO */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1DedicatedYoutubeVideo ||
                          "—"}
                      </td>

                      {/* 30. INTEGRATED YOUTUBE VIDEO */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1IntegratedYoutubeVideo ||
                          "—"}
                      </td>

                      {/* 31. DEDICATED YOUTUBE SHORTS */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1DedicatedYoutubeShortsVideo ||
                          "—"}
                      </td>

                      {/* 32. INTEGRATED YOUTUBE SHORTS */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.commercialsFor1IntegratedYoutubeShortsVideo ||
                          "—"}
                      </td>

                      {/* 33. DEAL */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "deal",
                          creator.whatKindOfDealDoYouParticipateIn
                        )}
                      </td>

                      {/* 34. SPEAKING VIDEO LINK */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLink(
                          creator,
                          "speakingVideoLink",
                          creator.speakingVideoLink
                        )}
                      </td>

                      {/* 35. CELEBRITY */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.isCelebrity !==
                        undefined
                          ? creator.isCelebrity
                            ? "Yes"
                            : "No"
                          : "—"}
                      </td>

                      {/* 36. AVAILABLE PLATFORMS */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "availablePlatforms",
                          creator.availablePlatforms
                        )}
                      </td>

                      {/* 37. TYPE OF CELEBRITY */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.typeOfCelebrity ||
                          "—"}
                      </td>

                      {/* 38. AMAZON REVIEWS */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                        {creator.amazonReviewsPerMonth ||
                          "—"}
                      </td>

                      {/* 39. PLATFORM */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                        "
                      >
                       {creator.platform ||
    (() => {
      const hasInstagram = Boolean(
        creator.instagramProfileLink?.trim()
      );

      const hasYoutube = Boolean(
        creator.youtubeChannelLink?.trim()
      );

      if (hasInstagram && hasYoutube) {
        return "Instagram, YouTube";
      }

      if (hasInstagram) {
        return "Instagram";
      }

      if (hasYoutube) {
        return "YouTube";
      }

      return "-";
    })()}
</td>
{/* 40. COMMERCIAL */}
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    min-w-[13vw]
  "
>
  <input
    type="number"
    min="0"
    step="1"
    value={creatorCommercials[creator._id] || ""}
    onChange={(e) => {
      const value = e.target.value;

      // Allow only numbers
      if (/^\d*$/.test(value)) {
        handleCreatorCommercial(
          creator._id,
          value
        );
      }
    }}
    placeholder="Enter amount"
    inputMode="numeric"
    className="
      w-full
      min-w-[11vw]
      h-[2.7vw]
      min-h-[40px]
      px-[0.7vw]
      rounded-[0.6vw]
      border
      border-slate-200
      bg-white
      text-[0.8vw]
      text-slate-700
      placeholder:text-slate-400
      outline-none
      focus:border-gray-500
      focus:ring-[0.15vw]
      focus:ring-gray-100
    "
  />
</td>
{/* 41. READY TO CAMPAIGN */}
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    min-w-[12vw]
  "
>
  <select
    value={creatorReadyStatus[creator._id] || ""}
    onChange={(e) =>
      handleReadyToCampaign(
        creator._id,
        e.target.value
      )
    }
    className="
      w-full
      min-w-[10vw]
      h-[2.7vw]
      min-h-[40px]
      px-[0.7vw]
      rounded-[0.6vw]
      border
      border-slate-200
      bg-white
      text-[0.8vw]
      text-slate-700
      outline-none
      focus:border-gray-500
      focus:ring-[0.15vw]
      focus:ring-gray-100
      cursor-pointer
    "
  >
    <option value="">Select</option>
    <option value="Agreed">Agreed</option>
    <option value="Disagreed">Disagreed</option>
  </select>
</td>

{/* 42. STATUS */}
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    whitespace-nowrap
  "
>
  {creatorActions[creator._id] ? (
    <span
      className={`
        inline-flex
        items-center
        px-[0.7vw]
        py-[0.35vw]
        rounded-full
        text-[0.75vw]
        font-semibold
        ${
          creatorActions[creator._id] === "Approved"
            ? "bg-emerald-50 text-emerald-700"
            : creatorActions[creator._id] === "Rejected"
            ? "bg-red-50 text-red-700"
            : creatorActions[creator._id] === "Pending"
            ? "bg-amber-50 text-amber-700"
            : "bg-blue-50 text-blue-700"
        }
      `}
    >
      {creatorActions[creator._id]}
    </span>
  ) : (
    <span className="text-slate-400">—</span>
  )}
</td>

{/* 43. ACTION */}
<td
  className="
    px-[1vw]
    py-[1vw]
    border-b
    border-slate-200
    align-top
    min-w-[12vw]
  "
>
  <select
    value={creatorActions[creator._id] || ""}
    onChange={(e) =>
      handleCreatorAction(
        creator._id,
        e.target.value
      )
    }
    className="
      w-full
      min-w-[10vw]
      h-[2.7vw]
      min-h-[40px]
      px-[0.7vw]
      rounded-[0.6vw]
      border
      border-slate-200
      bg-white
      text-[0.8vw]
      text-slate-700
      outline-none
      focus:border-gray-500
      focus:ring-[0.15vw]
      focus:ring-gray-100
      cursor-pointer
    "
  >
    <option value="">Select Action</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
    <option value="Pending">Pending</option>
    <option value="On-Discussion">On-Discussion</option>
  </select>
</td>
                      
                      {/* 42. BIO */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                        "
                      >
                        {renderLongText(
                          creator,
                          "bio",
                          creator.bio,
                          60
                        )}
                      </td>

                      {/* 43. INFLUNEXA USER ID */}

                      <td
                        className="
                          px-[1vw]
                          py-[1vw]
                          border-b
                          border-slate-200
                          align-top
                          whitespace-nowrap
                          font-semibold
                          text-slate-700
                        "
                      >
                        {creator.InflunexaUserId ||
                          creator.influnexaUserId ||
                          "—"}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedTicketCreators;