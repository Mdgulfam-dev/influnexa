import { useState,useEffect } from "react";
import axios from "axios";
import Config from "../config/Config";
import Papa from "papaparse";
import { saveAs } from "file-saver";

function UploadCreatorsCSV(){
const [expandedReasons, setExpandedReasons] = useState({});
  const [file,setFile] = useState(null);
  const [loading,setLoading] = useState(false);
const [summary, setSummary] = useState({
  totalRecords: 0,
  successfulRecords: 0,
  updatedRecords: 0,
  failedRecords: 0,
});

const [uploadReport, setUploadReport] = useState([]);

const [csvCreators,setCsvCreators] = useState([]);
useEffect(()=>{

  fetchLatestReport();
   fetchCSVCreators();
},[]);

const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 100; // Show 100 records per page

//   Fetch latest report

const fetchLatestReport = async()=>{

  try{

    const response = await axios.get(
      `${Config.API_URL}/csv-creators/latest-report`
    );


    if(
      response.data.success &&
      response.data.report
    ){

      setSummary({

        totalRecords: response.data.report.totalRecords,

        successfulRecords: response.data.report.successfulRecords,
        updatedRecords:response.data.report.updatedRecords,

        failedRecords: response.data.report.failedRecords

      });


      setUploadReport(
    Array.isArray(response.data.report.report)
        ? response.data.report.report
        : []
);


    }
    else{

      setUploadReport([]);

      setSummary({

        totalRecords:0,

        successfulRecords:0,
        updatedRecords:0,

        failedRecords:0

      });

    }


  }
  catch(error){

    console.log(
      "REPORT FETCH ERROR:",
      error.response?.data || error.message
    );


    setUploadReport([]);

  }

};


const fetchCSVCreators = async()=>{

try{

const response = await axios.get(
`${Config.API_URL}/csv-creators`
);


setCsvCreators(
response.data.data || []
);


}
catch(error){

console.log(
"CSV CREATOR FETCH ERROR",
error.response?.data || error.message
);

}

};

// UPLOAD CSV FILE 
  const uploadCSV = async()=>{

    console.log("Button clicked");
    console.log("Selected file:", file);


    try{

      if(!file){
        alert("Please select CSV file first");
        return;
      }


      setLoading(true);


      const formData = new FormData();

      formData.append("file", file);


      const response = await axios.post(
         `${Config.API_URL}/csv-creators/upload`,
        formData,
        {
          timeout:0,
        }
      );
     
      setSummary({
    totalRecords: response.data.totalRecords,
    successfulRecords: response.data.successfulRecords,
    updatedRecords:response.data.updatedRecords,
    failedRecords: response.data.failedRecords,
});

setUploadReport(response.data.report);

// fetchLatestReport();
fetchCSVCreators();

      console.log(
        "UPLOAD RESPONSE:",
        response.data
      );


      alert("Creators uploaded successfully");


    }
    catch(error){

      console.log(
        "CSV ERROR:",
        error.response?.data || error.message
      );


      alert(
        error.response?.data?.message ||
        "CSV upload failed"
      );

    }
    finally{

      setLoading(false);

    }

  }

  // Delete CSV file
const deleteCSVCreators = async()=>{

 try{

  const confirmDelete = window.confirm(
    "Delete all CSV uploaded creators?"
  );


  if(!confirmDelete) return;


  const response = await axios.delete(
   `${Config.API_URL}/csv-creators`
  );


  alert(response.data.message);
  setUploadReport([]);

setSummary({
 totalRecords:0,
 successfulRecords:0,
 updatedRecords:0,
 failedRecords:0
});

setFile(null);
setCsvCreators([]);

 }
 catch(error){

  console.log(
   error.response?.data || error.message
  );

  alert("Delete failed");

 }

};



// DELETE SINGLE CSV CREATOR

const deleteSingleCSV = async(id)=>{


try{


const confirmDelete = window.confirm(
"Delete this CSV creator?"
);


if(!confirmDelete)
return;



const response = await axios.delete(

`${Config.API_URL}/csv-creators/${id}`

);



alert(response.data.message);



// refresh report/data if needed

// fetchLatestReport();
fetchCSVCreators();


}
catch(error){


console.log(
error.response?.data || error.message
);


alert(
"Single creator delete failed"
);
}
};

// Pagination
const totalPages = Math.ceil(uploadReport.length / recordsPerPage);

const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

const currentRecords = uploadReport.slice(
  indexOfFirstRecord,
  indexOfLastRecord
);

const handleNext = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
  }
};

const handlePrevious = () => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
  }
};

// DOWNLOAD FAILED CSV FILE

const downloadFailedCSV = () => {
  const failedRecords = uploadReport
    .filter(item => item.status === "Failed")
    .map(item => ({
      "Timestamp": item.timestamp,
      "Instagram Username": item.instagramUsername,
      "Instagram Profile Link": item.instagramProfileLink,
      "Instagram Followers Range": item.instagramFollowersRange,
      "Exact Followers": item.exactFollowers,

      "Categories": Array.isArray(item.categories)
        ? item.categories.join(", ")
        : item.categories,

      "Phone Number": item.phoneNumber,
      "Whatsapp Number": item.whatsappNumber,

      "Full Name": item.fullName,
      "Email": item.email,
      "Gender": item.gender,
      "Date of Birth": item.dateOfBirth,
       "influencerType":item.influencerType,
      "Campaign type": Array.isArray(item.campaignType)
        ? item.campaignType.join(", ")
        : item.campaignType,

      "What kind of deal do you participate in":
        item.whatKindOfDealDoYouParticipateIn,

      "Languages": Array.isArray(item.languages)
        ? item.languages.join(", ")
        : item.languages,

      "Speaking Video Link": item.speakingVideoLink,

      "Full Address": item.fullAddress,
      "Landmark": item.landmark,
      "City": item.city,
      "State": item.state,
      "Country": item.country,
      "Pincode": item.pincode,

      "Photo Link": item.photoLink,

      "YouTube Username": item.youtubeUsername,
      "YouTube Channel Link": item.youtubeChannelLink,
      "YouTube Subscribers Range": item.youtubeSubscribersRange,

      "Commercials For 1 Instagram Reel":
        item.commercialsFor1InstagramReel,

      "Commercials For 1 Instagram Story":
        item.commercialsFor1InstagramStory,

      "Commercials For 1 Instagram Post":
        item.commercialsFor1InstagramPost,

      "Commercials For 1 Dedicated YouTube Video":
        item.commercialsFor1DedicatedYouTubeVideo,

      "Commercials For 1 Integrated YouTube Video":
        item.commercialsFor1IntegratedYouTubeVideo,

      "Commercials For 1 Dedicated YouTube Shorts Video":
        item.commercialsFor1DedicatedYouTubeShortsVideo,

      "Commercials For 1 Integrated YouTube Shorts Video":
        item.commercialsFor1IntegratedYouTubeShortsVideo,
      "Bio": item.bio,

      "Are you a TV/movies/OTT celebrity":
        item.areYouATvMoviesOttCelebrity,

      "Type of Celeb": item.typeOfCeleb,

      "What all platforms are you avilable on": Array.isArray(
        item.whatAllPlatformsAreYouAvailableOn
      )
        ? item.whatAllPlatformsAreYouAvailableOn.join(", ")
        : item.whatAllPlatformsAreYouAvailableOn,

      "How many Amazon reviews you do per month":
        item.howManyAmazonReviewsYouDoPerMonth,

      "Fetched from Brand Page": item.fetchedFromBrandPage,
      "Fetched For Brand": item.fetchedForBrand,
      "Platform": item.platform,
      "Fetched Date": item.fetchedDate,

      "InflunexaUserId": item.InflunexaUserId,

      "Status": item.status,
      "Reason": item.reason
    }));

  if (!failedRecords.length) {
    alert("No failed records found.");
    return;
  }

  const csv = Papa.unparse(failedRecords);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  saveAs(blob, "Failed_Creators.csv");
};

const toggleReason = (index) => {
  setExpandedReasons((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};

return(
<div className="
    bg-white
    border
    border-slate-200
    rounded-[24px]
    shadow-sm
    overflow-hidden
  ">

{/* HEADER */}
<div className="px-7 pt-7 pb-5">

  <div className="
    flex
    flex-col
    lg:flex-row
    lg:items-center
    lg:justify-between
    gap-4
  ">

    <div>

      <h2 className="
        text-3xl
        font-bold
        text-slate-900
        tracking-tight
      ">
        Upload Creator CSV
      </h2>

      <p className="
        mt-2
        text-sm
        text-slate-500
      ">
        Upload creator data in CSV format and review uploaded,
        updated, and failed records.
      </p>

    </div>


    <button
      onClick={deleteCSVCreators}
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
      Delete CSV Creators
    </button>

  </div>

</div>


{/* CSV UPLOAD SECTION */}
<div className="px-7 pb-6">

  <div className="
    rounded-[22px]
    border
    border-slate-200
    bg-slate-50
    p-5
  ">

    <div className="
      flex
      flex-col
      lg:flex-row
      lg:items-end
      gap-4
    ">

      {/* FILE INPUT */}
      <div className="flex-1 w-full">

        <label className="
          block
          text-sm
          font-bold
          
          tracking-wide
          text-slate-500
          mb-2
        ">
          Select CSV File
        </label>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            console.log("File selected:", e.target.files[0]);
            setFile(e.target.files[0]);
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
        onClick={uploadCSV}
        disabled={loading}
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
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

    </div>


    {/* SELECTED FILE */}
    {file && (
      <div className="
        mt-4
        flex
        items-center
        gap-2
        text-sm
        text-slate-600
      ">

        <span className="font-semibold">
          Selected file:
        </span>

        <span className="
          px-3
          py-1.5
          bg-white
          border
          border-slate-200
          rounded-lg
        ">
          {file.name}
        </span>

      </div>
    )}

  </div>

</div>
{summary.totalRecords > 0 && (

  <div className="px-7 pb-6">

    <div className="
      rounded-[22px]
      border
      border-slate-200
      bg-white
      overflow-hidden
    ">

      {/* SUMMARY HEADER */}
      <div className="
        px-5
        py-4
        border-b
        border-slate-200
        bg-slate-50
      ">

        <h3 className="
          text-lg
          font-bold
          text-slate-900
        ">
          Upload Summary
        </h3>

      </div>


      {/* SUMMARY CARDS */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
        p-5
      ">

        {/* TOTAL */}
        <div className="
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-5
        ">

          <p className="
            text-sm
            font-medium
            text-slate-500
          ">
            Total Records
          </p>

          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-slate-900
          ">
            {summary.totalRecords}
          </h2>

        </div>


        {/* SUCCESSFULLY UPLOADED */}
        <div className="
          rounded-xl
          border
          border-emerald-200
          bg-emerald-50
          p-5
        ">

          <p className="
            text-sm
            font-medium
            text-emerald-700
          ">
            Successfully Uploaded
          </p>

          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-emerald-700
          ">
            {summary.successfulRecords}
          </h2>

        </div>


        {/* SUCCESSFULLY UPDATED */}
        <div className="
          rounded-xl
          border
          border-amber-200
          bg-amber-50
          p-5
        ">

          <p className="
            text-sm
            font-medium
            text-amber-700
          ">
            Successfully Updated
          </p>

          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-amber-700
          ">
            {summary.updatedRecords}
          </h2>

        </div>


        {/* FAILED */}
        <div className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-5
        ">

          <p className="
            text-sm
            font-medium
            text-red-700
          ">
            Failed
          </p>

          <h2 className="
            mt-2
            text-3xl
            font-bold
            text-red-700
          ">
            {summary.failedRecords}
          </h2>

        </div>

      </div>

    </div>

  </div>

)}

 {/* UPLOAD REPORT HEADER */}
<div className="
  px-7
  pb-4
">

  <div className="
    flex
    flex-col
    sm:flex-row
    sm:items-center
    sm:justify-between
    gap-4
  ">

    {/* TITLE */}
    <div>

      <h3 className="
        text-xl
        font-bold
        text-slate-900
      ">
        Upload Report
      </h3>

      <p className="
        mt-1
        text-sm
        text-slate-500
      ">
        Review the status of every uploaded creator record.
      </p>

    </div>


    {/* DOWNLOAD FAILED CSV */}
    <button
      onClick={downloadFailedCSV}
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
{uploadReport.length > 0 ? (

<div className="px-7 pb-7">

  <div className="
    border
    border-slate-200
    rounded-[20px]
    overflow-hidden
    bg-white
  ">

    <div className="
      overflow-x-auto
      overflow-y-auto
      max-h-[650px]
    ">

      <table className="
        min-w-[1200px]
        w-full
        text-sm
        border-collapse
      ">

        <thead className="
          bg-slate-50
          sticky
          top-0
          z-20
        ">
<tr>

<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold
  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">SL No.</th>
<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold

  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">Name</th>
<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold
  
  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">Email</th>
<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold
  
  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">Mobile</th>
<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold
  
  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">Instagram UserName</th>
<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold
  
  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">YouTube UserName</th>
<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold
  
  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">Status</th>
<th className="
  px-4
  py-4
  text-left
  text-sm
  font-bold
  
  tracking-wider
  text-slate-500
  bg-slate-50
  border-b
  border-slate-200
  whitespace-nowrap
">Reason</th>

</tr>

</thead>


<tbody className="divide-y divide-slate-100 bg-white">

  {currentRecords.map((item, index) => (

    <tr
      key={index}
      className="hover:bg-slate-50 transition"
    >

      {/* SL NO */}
      <td className="
        px-4
        py-4
        text-sm
        text-slate-500
        whitespace-nowrap
      ">
        {indexOfFirstRecord + index + 1}
      </td>


      {/* NAME */}
      <td className="
        px-4
        py-4
        text-sm
        font-semibold
        text-slate-800
        whitespace-nowrap
      ">
        {item.fullName || "-"}
      </td>


      {/* EMAIL */}
      <td className="
        px-4
        py-4
        text-sm
        text-slate-600
        whitespace-nowrap
      ">
        {item.email || "-"}
      </td>


      {/* MOBILE */}
      <td className="
        px-4
        py-4
        text-sm
        text-slate-600
        whitespace-nowrap
      ">
        {item.phoneNumber || "-"}
      </td>


      {/* INSTAGRAM */}
      <td className="
        px-4
        py-4
        text-sm
        text-slate-600
        whitespace-nowrap
      ">
        {item.instagramUsername || "-"}
      </td>


      {/* YOUTUBE */}
      <td className="
        px-4
        py-4
        text-sm
        text-slate-600
        whitespace-nowrap
      ">
        {item.youtubeUsername || "-"}
      </td>


      {/* STATUS */}
      <td className="px-4 py-4 whitespace-nowrap">

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
    px-4
    py-4
    text-sm
    text-slate-600
    max-w-[350px]
    align-top
  "
>
  <div className="max-w-[350px]">
    {expandedReasons[index] ? (
      <>
        <div className="whitespace-normal break-words">
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
      </>
    ) : (
      <>
        <div
          className="truncate"
          title={item.reason || ""}
        >
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
            See More
          </button>
        )}
      </>
    )}
  </div>
</td>

    </tr>

  ))}

</tbody>

</table>
</div>
</div>

{uploadReport.length > recordsPerPage && (
  <div className="
    flex
    justify-between
    items-center
    mt-5
    px-2
  ">

    <button
      onClick={handlePrevious}
      disabled={currentPage === 1}
      className={`
        h-10
        px-5
        rounded-xl
        border
        text-sm
        font-semibold
        transition
        ${
          currentPage === 1
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      Previous
    </button>

    <span className="
      text-sm
      font-semibold
      text-slate-600
    ">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`
        h-10
        px-5
        rounded-xl
        border
        text-sm
        font-semibold
        transition
        ${
          currentPage === totalPages
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

)

:

(

<div className="
mt-8
text-center
text-white
text-xl
font-bold
">

No Creator Found

</div>

)
}
</div>
)
}


export default UploadCreatorsCSV;