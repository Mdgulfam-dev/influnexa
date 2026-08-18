import { useEffect, useState } from "react";
import axios from "axios";
import Config from "../config/Config";
import Papa from "papaparse";
import { saveAs } from "file-saver";

function UploadBrandsCSV() {

  // ========================================
  // STATES
  // ========================================
const [expandedRows, setExpandedRows] = useState({});
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [csvBrands, setCsvBrands] = useState([]);

  const [uploadReport, setUploadReport] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 100;

  const [summary, setSummary] = useState({
    totalRecords: 0,
    successfulRecords: 0,
    updatedRecords: 0,
    failedRecords: 0,
  });


  // ========================================
  // INITIAL FETCH
  // ========================================

  useEffect(() => {

    fetchLatestReport();

    fetchCSVBrands();

  }, []);


  // ========================================
  // FETCH LATEST REPORT
  // ========================================

  const fetchLatestReport = async () => {

    try {

      const response = await axios.get(
        `${Config.API_URL}/csv-brands/latest-report`
      );


      if (
        response.data.success &&
        response.data.report
      ) {

        const report =
          response.data.report;


        setSummary({
          totalRecords:
            report.totalRecords || 0,

          successfulRecords:
            report.successfulRecords || 0,

          updatedRecords:
            report.updatedRecords || 0,

          failedRecords:
            report.failedRecords || 0,
        });


        setUploadReport(
          Array.isArray(report.report)
            ? report.report
            : []
        );

      } else {

        setUploadReport([]);

        setSummary({
          totalRecords: 0,
          successfulRecords: 0,
          updatedRecords: 0,
          failedRecords: 0,
        });

      }

    } catch (error) {

      console.log(
        "BRAND REPORT FETCH ERROR:",
        error.response?.data ||
        error.message
      );

      setUploadReport([]);

    }

  };


  // ========================================
  // FETCH BRANDS
  // ========================================

  const fetchCSVBrands = async () => {

    try {

      const response = await axios.get(
        `${Config.API_URL}/csv-brands`,
        {
          params: {
            page: 1,
            limit: 100,
          },
        }
      );


      setCsvBrands(
        response.data.data || []
      );

    } catch (error) {

      console.log(
        "CSV BRAND FETCH ERROR:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ========================================
  // UPLOAD CSV
  // ========================================

  const uploadCSV = async () => {

    console.log("Brand upload button clicked");

    console.log(
      "Selected file:",
      file
    );


    try {

      if (!file) {

        alert(
          "Please select CSV file first"
        );

        return;
      }


      setLoading(true);


      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );


      const response =
        await axios.post(
          `${Config.API_URL}/csv-brands/upload`,
          formData,
          {
            timeout: 0,
          }
        );


      setSummary({

        totalRecords:
          response.data.totalRecords || 0,

        successfulRecords:
          response.data.successfulRecords || 0,

        updatedRecords:
          response.data.updatedRecords || 0,

        failedRecords:
          response.data.failedRecords || 0,

      });


      setUploadReport(
        response.data.report || []
      );


      setCurrentPage(1);


      await fetchCSVBrands();


      setFile(null);


      alert(
        "Brands uploaded successfully"
      );


      console.log(
        "BRAND UPLOAD RESPONSE:",
        response.data
      );

    } catch (error) {

      console.log(
        "BRAND CSV ERROR:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        "Brand CSV upload failed"
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // DELETE ALL BRANDS
  // ========================================

  const deleteCSVBrands = async () => {

    try {

      const confirmDelete =
        window.confirm(
          "Delete all CSV uploaded brands?"
        );


      if (!confirmDelete) {
        return;
      }


      const response =
        await axios.delete(
          `${Config.API_URL}/csv-brands`
        );


      alert(
        response.data.message
      );


      setUploadReport([]);

      setSummary({
        totalRecords: 0,
        successfulRecords: 0,
        updatedRecords: 0,
        failedRecords: 0,
      });

      setFile(null);

      setCsvBrands([]);

      setCurrentPage(1);

    } catch (error) {

      console.log(
        "DELETE ALL BRAND ERROR:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        "Delete failed"
      );

    }

  };


  // ========================================
  // DELETE SINGLE BRAND
  // ========================================

  const deleteSingleCSVBrand = async (
    id
  ) => {

    try {

      const confirmDelete =
        window.confirm(
          "Delete this CSV brand?"
        );


      if (!confirmDelete) {
        return;
      }


      const response =
        await axios.delete(
          `${Config.API_URL}/csv-brands/${id}`
        );


      alert(
        response.data.message
      );


      await fetchCSVBrands();

    } catch (error) {

      console.log(
        "DELETE BRAND ERROR:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        "Brand delete failed"
      );

    }

  };


  // ========================================
  // REPORT PAGINATION
  // ========================================

  const totalPages =
    Math.ceil(
      uploadReport.length /
      recordsPerPage
    );


  const indexOfLastRecord =
    currentPage *
    recordsPerPage;


  const indexOfFirstRecord =
    indexOfLastRecord -
    recordsPerPage;


  const currentRecords =
    uploadReport.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );


  // ========================================
  // NEXT
  // ========================================

  const handleNext = () => {

    if (
      currentPage <
      totalPages
    ) {

      setCurrentPage(
        (prev) => prev + 1
      );

    }

  };


  // ========================================
  // PREVIOUS
  // ========================================

  const handlePrevious = () => {

    if (
      currentPage > 1
    ) {

      setCurrentPage(
        (prev) => prev - 1
      );

    }

  };


  // ========================================
  // DOWNLOAD FAILED BRANDS
  // ========================================

  const downloadFailedCSV = () => {

    const failedRecords =
      uploadReport

        .filter(
          (item) =>
            item.status ===
            "Failed"
        )

        .map((item) => ({

          "Company Name":
            item.companyName || "",

          "Full Name":
            item.fullName || "",

          "ProsPects":
            item.prospects || "",

          "Email Id":
            item.email || "",

          "Official Email Id":
            item.officialEmail || "",

          "Mobile Number":
            item.mobileNumber || "",

          "Linkedin Profile":
            item.linkedinProfile || "",

          "City":
            item.city || "",

          "Address":
            item.address || "",

          "Directors":
            item.directors || "",

          "Age of the Company":
            item.ageOfCompany || "",

          "Website URL":
            item.websiteUrl || "",

          "Data Type":
            item.dataType || "",

        }));


    if (
      !failedRecords.length
    ) {

      alert(
        "No failed records found."
      );

      return;
    }


    const csv =
      Papa.unparse(
        failedRecords
      );


    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );


    saveAs(
      blob,
      "Failed_Brands.csv"
    );

  };

const toggleReason = (index) => {
  setExpandedRows((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};
  // ========================================
  // UI
  // ========================================

  return (

    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-[24px]
        shadow-sm
        overflow-hidden
      "
    >

      {/* ========================================
          HEADER
      ======================================== */}

      <div
        className="
          px-7
          pt-7
          pb-5
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-bold
                text-slate-900
                tracking-tight
              "
            >
              Upload Brand CSV
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Upload brand data in CSV
              format and review uploaded,
              updated, and failed records.
            </p>

          </div>


          <button
            onClick={
              deleteCSVBrands
            }
            className="
              h-11
              px-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              text-red-600
              text-sm
              font-semibold
              hover:bg-red-100
              transition
            "
          >
            Delete CSV Brands
          </button>

        </div>

      </div>


      {/* ========================================
          UPLOAD SECTION
      ======================================== */}

      <div
        className="
          px-7
          pb-6
        "
      >

        <div
          className="
            rounded-[22px]
            border
            border-slate-200
            bg-slate-50
            p-5
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-end
              gap-4
            "
          >

            {/* FILE INPUT */}

            <div
              className="
                flex-1
                w-full
              "
            >

              <label
                className="
                  block
                  text-sm
                  font-bold
                  
                  tracking-wide
                  text-slate-500
                  mb-2
                "
              >
                Select Brand CSV File
              </label>


              <input
                type="file"
                accept=".csv"
                onChange={(e) => {

                  console.log(
                    "Brand file selected:",
                    e.target.files[0]
                  );

                  setFile(
                    e.target.files[0]
                  );

                }}
                className="
                  w-full
                  h-14
                  px-4
                  py-3
                  bg-white
                  border
                  border-slate-300
                  rounded-xl
                  text-slate-700
                  text-sm
                  outline-none
                  transition
                  focus:border-slate-500
                  focus:ring-2
                  focus:ring-slate-200
                  file:mr-4
                  file:rounded-lg
                  file:border-0
                  file:bg-slate-900
                  file:px-4
                  file:py-2
                  file:text-sm
                  file:font-semibold
                  file:text-white
                  hover:file:bg-slate-800
                "
              />

            </div>


            {/* UPLOAD BUTTON */}

            <button
              onClick={
                uploadCSV
              }
              disabled={
                loading
              }
              className="
                h-14
                px-7
                rounded-xl
                bg-slate-900
                hover:bg-slate-800
                text-white
                text-sm
                font-semibold
                transition
                shadow-sm
                disabled:opacity-50
                disabled:cursor-not-allowed
                min-w-[150px]
              "
            >
              {loading
                ? "Uploading..."
                : "Upload CSV"}
            </button>

          </div>


          {/* SELECTED FILE */}

          {file && (

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                text-slate-600
              "
            >

              <span
                className="
                  font-semibold
                "
              >
                Selected file:
              </span>


              <span
                className="
                  px-3
                  py-1.5
                  bg-white
                  border
                  border-slate-200
                  rounded-lg
                "
              >
                {file.name}
              </span>

            </div>

          )}

        </div>

      </div>


      {/* ========================================
          SUMMARY
      ======================================== */}

      {summary.totalRecords >
        0 && (

        <div
          className="
            px-7
            pb-6
          "
        >

          <div
            className="
              rounded-[22px]
              border
              border-slate-200
              bg-white
              overflow-hidden
            "
          >

            <div
              className="
                px-5
                py-4
                border-b
                border-slate-200
                bg-slate-50
              "
            >

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                Brand Upload Summary
              </h3>

            </div>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
                p-5
              "
            >

              {/* TOTAL */}

              <div
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                "
              >

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >
                  Total Records
                </p>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-slate-900
                  "
                >
                  {
                    summary.totalRecords
                  }
                </h2>

              </div>


              {/* UPLOADED */}

              <div
                className="
                  rounded-xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  p-5
                "
              >

                <p
                  className="
                    text-sm
                    font-medium
                    text-emerald-700
                  "
                >
                  Successfully Uploaded
                </p>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-emerald-700
                  "
                >
                  {
                    summary.successfulRecords
                  }
                </h2>

              </div>


              {/* UPDATED */}

              <div
                className="
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
                "
              >

                <p
                  className="
                    text-sm
                    font-medium
                    text-amber-700
                  "
                >
                  Successfully Updated
                </p>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-amber-700
                  "
                >
                  {
                    summary.updatedRecords
                  }
                </h2>

              </div>


              {/* FAILED */}

              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  p-5
                "
              >

                <p
                  className="
                    text-sm
                    font-medium
                    text-red-700
                  "
                >
                  Failed
                </p>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-red-700
                  "
                >
                  {
                    summary.failedRecords
                  }
                </h2>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* ========================================
          REPORT HEADER
      ======================================== */}

      <div
        className="
          px-7
          pb-4
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >

          <div>

            <h3
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Brand Upload Report
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Review the status of every
              uploaded brand record.
            </p>

          </div>


          <button
            onClick={
              downloadFailedCSV
            }
            className="
              h-11
              px-5
              rounded-xl
              bg-red-600
              hover:bg-red-700
              text-white
              text-sm
              font-semibold
              transition
              shadow-sm
            "
          >
            Download Failed CSV
          </button>

        </div>

      </div>


      {/* ========================================
          REPORT TABLE
      ======================================== */}

      {uploadReport.length >
      0 ? (

        <div
          className="
            px-7
            pb-7
          "
        >

          <div
            className="
              border
              border-slate-200
              rounded-[20px]
              overflow-hidden
              bg-white
            "
          >

            <div
              className="
                overflow-x-auto
                overflow-y-auto
                max-h-[650px]
              "
            >
<table
  className="
    min-w-[1400px]
    w-full
    table-fixed
    text-sm
    border-collapse
  "
>

  <thead
    className="
      bg-slate-50
      sticky
      top-0
      z-20
    "
  >
    <tr>

      <th className="w-[80px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        SL No.
      </th>

      <th className="w-[200px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        Company Name
      </th>

      <th className="w-[180px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        Full Name
      </th>

      <th className="w-[240px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        Email Id
      </th>

      <th className="w-[240px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        Official Email ID
      </th>

      <th className="w-[180px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        Mobile Number
      </th>

      <th className="w-[140px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        Status
      </th>

      <th className="w-[400px] px-4 py-3 text-left whitespace-nowrap font-semibold text-slate-500 border-b border-slate-200">
        Reason
      </th>

    </tr>
  </thead>


  <tbody
    className="
      divide-y
      divide-slate-100
      bg-white
    "
  >

    {currentRecords.map(
      (item, index) => (

        <tr
          key={index}
          className="
            hover:bg-slate-50
            transition
          "
        >

          {/* SL NO */}
          <td className="w-[80px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
            {indexOfFirstRecord + index + 1}
          </td>


          {/* COMPANY NAME */}
          <td
            className="
              w-[200px]
              px-4
              py-3
              text-left
              whitespace-nowrap
              align-middle
              font-semibold
              text-slate-800
            "
          >
            {item.companyName || "-"}
          </td>


          {/* FULL NAME */}
          <td className="w-[180px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
            {item.fullName || "-"}
          </td>


          {/* EMAIL */}
          <td className="w-[240px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
            {item.email || "-"}
          </td>


          {/* OFFICIAL EMAIL */}
          <td className="w-[240px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
            {item.officialEmail || "-"}
          </td>


          {/* MOBILE */}
          <td className="w-[180px] px-4 py-3 text-left whitespace-nowrap text-slate-700 align-middle">
            {item.mobileNumber || "-"}
          </td>


          {/* STATUS */}
          <td className="w-[140px] px-4 py-3 text-left whitespace-nowrap align-middle">

            <span
              className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-bold

                ${
                  item.status === "Failed"

                    ? "bg-red-50 text-red-600 border border-red-200"

                    : item.status === "Updated"

                    ? "bg-amber-50 text-amber-600 border border-amber-200"

                    : item.status === "Skipped"

                    ? "bg-slate-50 text-slate-600 border border-slate-200"

                    : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                }
              `}
            >
              {item.status || "-"}
            </span>

          </td>


          {/* REASON */}
   <td
  className="
    w-[400px]
    px-4
    py-3
    text-left
    align-middle
  "
>
  <div className="max-w-[380px]">
    {expandedRows[index] ? (
      <div>
        <div className="whitespace-normal break-words text-slate-700">
          {item.reason || "-"}
        </div>

        {item.reason && item.reason.length > 100 && (
          <button
            type="button"
            onClick={() => toggleReason(index)}
            className="
              mt-1
              text-xs
              font-semibold
              text-blue-600
              hover:text-blue-800
              hover:underline
            "
          >
            See Less
          </button>
        )}
      </div>
    ) : (
      <div>
        <div className="whitespace-normal break-words text-slate-700">
          {item.reason
            ? item.reason.length > 100
              ? `${item.reason.substring(0, 100)}...`
              : item.reason
            : "-"}
        </div>

        {item.reason && item.reason.length > 100 && (
          <button
            type="button"
            onClick={() => toggleReason(index)}
            className="
              mt-1
              text-xs
              font-semibold
              text-blue-600
              hover:text-blue-800
              hover:underline
            "
          >
            See More
          </button>
        )}
      </div>
    )}
  </div>
</td>

        </tr>

      )
    )}

  </tbody>

</table>

            </div>

          </div>


          {/* ========================================
              PAGINATION
          ======================================== */}

          {uploadReport.length >
            recordsPerPage && (

            <div
              className="
                flex
                justify-between
                items-center
                mt-5
                px-2
              "
            >

              <button
                onClick={
                  handlePrevious
                }
                disabled={
                  currentPage ===
                  1
                }
                className={`
                  h-10
                  px-5
                  rounded-xl
                  border
                  text-sm
                  font-semibold
                  transition

                  ${
                    currentPage ===
                    1

                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"

                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                Previous
              </button>


              <span
                className="
                  text-sm
                  font-semibold
                  text-slate-600
                "
              >
                Page{" "}
                {currentPage}{" "}
                of{" "}
                {totalPages}
              </span>


              <button
                onClick={
                  handleNext
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className={`
                  h-10
                  px-5
                  rounded-xl
                  border
                  text-sm
                  font-semibold
                  transition

                  ${
                    currentPage ===
                    totalPages

                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"

                      : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                  }
                `}
              >
                Next
              </button>

            </div>

          )}

        </div>

      ) : (

        <div
          className="
            px-7
            pb-8
          "
        >

          <div
            className="
              py-12
              text-center
              text-slate-500
              font-medium
            "
          >
            No Brand Upload Report Found
          </div>

        </div>

      )}

    </div>

  );

}

export default UploadBrandsCSV;