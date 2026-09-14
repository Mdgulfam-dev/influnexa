import React from "react";
import "../industries.css";

const industries = [
  "Fashion",
  "Beauty and Makeup",
  "Personal Care",
  "UGC Creators",
  "Tech Reviews",
  "Body Care",
  "Skin Care",
  "LifeStyle",
  "Food",
  "Housewife",
  "Podcasters",
  "Cooking and Recipes",
  "Health & Wellness",
  "Gym",
  "Fitness",
  "Moms",
  "Pets",
  "Travel & Adventure",
  "Celebrity",
  "Film, OTT and TV Series",
  "Memes",
  "Models",
  "Yoga",
  "Hair Care",
  "Student",
  "Family/Parenting",
  "Home & Decor",
  "Baby Care",
  "Education",
  "Dogs",
  "Diet & Nutrition",
  "Dermatologist",
  "Doctors",
  "Crypto and NFTs",
  "Personal Finance",
  "Luxury Goods",
  "Motivation",
  "Working class",
  "Ethnic Wear",
  "Stock Market",
  "Comedy",
  "Forex",
  "Esports",
  "Finance",
  "Dance",
  "Cats",
  "Crypto & NFT",
  "Sports",
  "Software Development",
  "Vegan",
  "Dentists",
  "Gadgets",
  "Electronics and Technology",
  "Entertainment",
  "Higher Education",
  "Entrepreneurship",
  "DIY",
  "Footwear",
  "Gaming",
  "Home & Garden",
  "Home & Kitchen",
  "Athletes",
  "Automotive",
  "Mental Health Care",
  "Motorcycles",
  "Religious",
  "Seniority Old Age",
  "Sexual Wellness",
  "Sneakers",
  "Music",
  "Arts and Crafts",
  "Business Making Money",
  "Coffee Tea Beverages",
  "Computer Software",
  "Nails",
  "Veterinary",
  "Fan Accounts",
  "Lingeries",
  "Architecture & Interior",
  "Banking",
  "Cars",
  "Hospitality",
  "Love & Romance",
  "Medical Practice",
  "Photography",
  "Plus Size Fashion",
  "Professional Training & Coaching",
  "Public Safety",
  "Wine and Spirits",
  "Farming",
  "Animals",
  "Automation & Robotics",
  "Quotes & Texts",
  "Politics",
  "Activism & Social Causes",
  "Books and Movies",
  "Gambling & Casinos",
  "Recreational Facilities",
  "Alternative Medicine",
  "Tobacco",
  "Airlines Aviation",
];

/*
  Images are loaded automatically.
  You do NOT need to download or import images.

 /* =========================================================
   INDUSTRY IMAGE PROMPTS
   ========================================================= */
const industryImageKeywords = {
  "Fashion": "fashion model clothing",
  "Beauty and Makeup": "beauty makeup cosmetics",
  "Personal Care": "personal care skincare",
  "UGC Creators": "",
  "Tech Reviews": "technology reviewer gadgets",
  "Body Care": "body care cosmetics",
  "Skin Care": "skincare beauty face",
  "LifeStyle": "lifestyle influencer",
  "Food": "food restaurant delicious",
  "Housewife": "woman home lifestyle",
  "Podcasters": "podcast microphone studio",
  "Cooking and Recipes": "cooking kitchen recipe",
  "Health & Wellness": "health wellness",
  "Gym": "gym workout weights",
  "Fitness": "fitness workout trainer",
  "Moms": "mother baby family",
  "Pets": "pets dog cat",
  "Travel & Adventure": "travel adventure mountain",
  "Celebrity": "celebrity red carpet",
  "Film, OTT and TV Series": "film television movie production",
  "Memes": "social media smartphone funny",
  "Models": "fashion model photoshoot",
  "Yoga": "yoga meditation",
  "Hair Care": "hair salon hair care",
  "Student": "student studying university",
  "Family/Parenting": "family parenting children",
  "Home & Decor": "home interior decor",
  "Baby Care": "baby care mother",
  "Education": "education classroom teacher",
  "Dogs": "dog pet",
  "Diet & Nutrition": "healthy food nutrition",
  "Dermatologist": "dermatologist skincare doctor",
  "Doctors": "doctor medical hospital",
  "Crypto and NFTs": "cryptocurrency bitcoin blockchain",
  "Personal Finance": "personal finance money",
  "Luxury Goods": "luxury fashion jewelry",
  "Motivation": "success motivation business",
  "Working class": "worker professional workplace",
  "Ethnic Wear": "traditional clothing ethnic fashion",
  "Stock Market": "stock market trading",
  "Comedy": "comedy comedian stage",
  "Forex": "forex trading financial charts",
  "Esports": "esports gaming competition",
  "Finance": "finance banking business",
  "Dance": "dance dancer performance",
  "Cats": "cat pet",
  "Crypto & NFT": "crypto bitcoin nft blockchain",
  "Sports": "sports athlete stadium",
  "Software Development": "software developer coding computer",
  "Vegan": "vegan food vegetables",
  "Dentists": "dentist dental clinic",
  "Gadgets": "smartphone gadgets technology",
  "Electronics and Technology": "electronics technology devices",
  "Entertainment": "entertainment stage performance",
  "Higher Education": "university college students",
  "Entrepreneurship": "entrepreneur startup business",
  "DIY": "DIY crafts tools",
  "Footwear": "shoes footwear fashion",
  "Gaming": "video game gamer gaming",
  "Home & Garden": "home garden plants",
  "Home & Kitchen": "kitchen home appliances",
  "Athletes": "professional athlete sports",
  "Automotive": "car automobile",
  "Mental Health Care": "mental health meditation wellness",
  "Motorcycles": "motorcycle rider",
  "Religious": "religion spirituality worship",
  "Seniority Old Age": "senior elderly lifestyle",
  "Sexual Wellness": "wellness self care lifestyle",
  "Sneakers": "sneakers shoes fashion",
  "Music": "musician music concert",
  "Arts and Crafts": "art painting crafts",
  "Business Making Money": "business entrepreneur money",
  "Coffee Tea Beverages": "coffee tea cafe",
  "Computer Software": "computer software technology",
  "Nails": "nail art manicure",
  "Veterinary": "veterinarian animal clinic",
  "Fan Accounts": "fans social media celebrity",
  "Lingeries": "fashion lingerie clothing",
  "Architecture & Interior": "architecture interior design",
  "Banking": "bank finance banking",
  "Cars": "cars automobile road",
  "Hospitality": "hotel hospitality resort",
  "Love & Romance": "couple romance love",
  "Medical Practice": "doctor medical clinic",
  "Photography": "photographer camera photoshoot",
  "Plus Size Fashion": "plus size fashion model",
  "Professional Training & Coaching": "business coach training",
  "Public Safety": "police emergency safety",
  "Wine and Spirits": "wine vineyard restaurant",
  "Farming": "farmer agriculture farm",
  "Animals": "wildlife animals",
  "Automation & Robotics": "robotics automation technology",
  "Quotes & Texts": "writing books typography",
  "Politics": "politics government parliament",
  "Activism & Social Causes": "social activism community",
  "Books and Movies": "books movies entertainment",
  "Gambling & Casinos": "casino gaming cards",
  "Recreational Facilities": "recreation sports leisure",
  "Alternative Medicine": "natural medicine wellness",
  "Tobacco": "tobacco agriculture",
  "Airlines Aviation": "airplane aviation airport",
};


/* =========================================================
   AUTOMATIC INDUSTRY IMAGE
   ========================================================= */

const getIndustryImage = (industry, index) => {
  const keywords =
    industryImageKeywords[industry] ||
    `${industry} lifestyle`;

  return `https://loremflickr.com/900/650/${encodeURIComponent(
    keywords
  )}?lock=${index + 100}`;
};const getDescription = (industry) => {
  const descriptions = {
    Fashion:
      "Connect fashion brands with creators who influence trends and inspire buying decisions.",
    "Beauty and Makeup":
      "Reach beauty-focused audiences through creators who understand products, trends and routines.",
    "Personal Care":
      "Build trust around personal care products through authentic creator recommendations.",
    "UGC Creators":
      "Create authentic user-generated content designed for social media, ads and brand campaigns.",
    "Tech Reviews":
      "Partner with technology creators who simplify products and influence purchase decisions.",
    Food:
      "Turn food experiences into engaging creator content that audiences love to discover.",
    Fitness:
      "Connect with fitness creators who motivate communities and drive action.",
    "Health & Wellness":
      "Reach wellness-conscious audiences with trusted and relatable creator voices.",
    "Travel & Adventure":
      "Showcase destinations, experiences and travel products through inspiring creators.",
    Gaming:
      "Engage passionate gaming communities through creators with highly active audiences.",
    Finance:
      "Build credibility with finance creators who create educational and trusted content.",
    Gadgets:
      "Put your products in front of audiences through creators who love discovering new gadgets.",
    Automotive:
      "Reach automotive enthusiasts through creators who influence vehicle and lifestyle decisions.",
    "Home & Decor":
      "Inspire audiences with creators who specialize in interiors, home styling and decor.",
    Music:
      "Connect brands with music creators and communities through culture-driven campaigns.",
    Photography:
      "Create visually powerful campaigns with photographers and visual storytellers.",
  };

  return (
    descriptions[industry] ||
    `Connect with relevant ${industry.toLowerCase()} creators and reach audiences that matter to your brand.`
  );
};

export default function Industries() {
  return (
    <main className="all-industries-page">

      {/* HERO */}
      <section className="all-industries-hero">
        <div className="all-industries-hero-inner"
        >
<a href="/#industires" className="industries-back-button">
  <span className="industries-back-arrow">←</span>
  <span>Back to Website</span>
</a>
          <div className="all-industries-eyebrow">
            <span></span>
            <p>INFLUNEXA INDUSTRY NETWORK</p>
            <span></span>
          </div>

          <h1>
            Creator Campaigns Built for{" "}
            <span>Every Industry.</span>
          </h1>

          <p>
            Discover creators across 100+ industries and connect your brand
            with the right audience, community and culture.
          </p>

          <div className="all-industries-stats">
            <div>
              <strong>101+</strong>
              <span>Industries</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Verified Creators</span>
            </div>

            <div>
              <strong>8+</strong>
              <span>Countries</span>
            </div>
          </div>

        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="all-industries-section">
        <div className="all-industries-container">

          <div className="all-industries-heading">
            <div>
              <span>EXPLORE OUR NETWORK</span>
              <h2>
                Industries We <strong>Serve.</strong>
              </h2>
            </div>

            <p>
              From fashion and beauty to technology, finance, fitness,
              entertainment and beyond.
            </p>
          </div>

          <div className="all-industries-grid">

            {industries.map((industry, index) => (
              <article
                className="all-industry-card"
                key={`${industry}-${index}`}
              >

                {/* IMAGE */}
                <div className="all-industry-image">

  <img
  src={getIndustryImage(industry, index)}
  alt={industry}
  loading="lazy"
  onError={(event) => {
    event.currentTarget.src =
      `https://loremflickr.com/900/650/business?lock=${index + 1000}`;
  }}
/>

                  <div className="all-industry-overlay"></div>

                  <div className="all-industry-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                </div>

                {/* CONTENT */}
                <div className="all-industry-content">

                  <h3>{industry}</h3>

                  <p>
                    {getDescription(industry)}
                  </p>

                  <div className="all-industry-footer">
                    <span>Creator Marketing</span>
                    
                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="all-industries-bottom-cta">

        <div>
          <span>READY TO GROW?</span>

          <h2>
            Find the Right Creators
            <br />
            for Your <strong>Brand.</strong>
          </h2>

          <p>
            Tell us what you're building and we'll help you connect
            with creators who can move your brand forward.
          </p>

          <a href="/register/brand">
            Start Your Campaign
            <span>→</span>
          </a>
        </div>

      </section>

    </main>
  );
}