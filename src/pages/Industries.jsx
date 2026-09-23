import "../industries.css";
import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "../lib/theme";
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
  "Fashion": "fashion",
  "Beauty and Makeup": "makeup",
  "Personal Care": "skincare",
  "UGC Creators": "creator",
  "Tech Reviews": "laptop",
  "Body Care": "Bodycare",
  "Skin Care": "Facewash",
  "LifeStyle": "Nature",
  "Food": "Biriyani",
  "Housewife": "Ladies",
  "Podcasters": "microphone",
  "Cooking and Recipes": "cooking",
  "Health & Wellness": "Health",
  "Gym": "gym",
  "Fitness": "fitness",
  "Moms": "mother",
  "Pets": "Dog",
  "Travel & Adventure": "travel",
  "Celebrity": "Celebrity",
  "Film, OTT and TV Series": "cinema",
  "Memes": "Funny",
  "Models": "model",
  "Yoga": "yoga",
  "Hair Care": "hair",
  "Student": "student",
  "Family/Parenting": "family",
  "Home & Decor": "interior",
  "Baby Care": "baby",
  "Education": "education",
  "Dogs": "dog",
  "Diet & Nutrition": "nutrition",
  "Dermatologist": "dermatologist",
  "Doctors": "doctor",
  "Crypto and NFTs": "bitcoin",
  "Personal Finance": "money",
  "Luxury Goods": "luxury",
  "Motivation": "success",
  "Working class": "worker",
  "Ethnic Wear": "saree",
  "Stock Market": "stocks",
  "Comedy": "comedian",
  "Forex": "forex",
  "Esports": "esports",
  "Finance": "finance",
  "Dance": "dancer",
  "Cat": "Cat",
  "Crypto & NFT": "nft",
  "Sports": "sports",
  "Software Development": "coding",
  "Vegan": "vegan",
  "Dentists": "dentist",
  "Gadgets": "smartphone",
  "Electronics and Technology": "electronics",
  "Entertainment": "entertainment",
  "Higher Education": "university",
  "Entrepreneurship": "entrepreneur",
  "DIY": "crafts",
  "Footwear": "shoes",
  "Gaming": "gaming",
  "Home & Garden": "garden",
  "Home & Kitchen": "kitchen",
  "Athletes": "athlete",
  "Automotive": "automobile",
  "Mental Health Care": "meditation",
  "Motorcycles": "motorcycle",
  "Religious": "worship",
  "Seniority Old Age": "elderly",
  "Sexual Wellness": "wellness",
  "Sneakers": "sneakers",
  "Music": "music",
  "Arts and Crafts": "painting",
  "Business Making Money": "business",
  "Coffee Tea Beverages": "coffee",
  "Computer Software": "computer",
  "Nails": "manicure",
  "Veterinary": "veterinarian",
  "Fan Accounts": "fans",
  "Lingeries": "lingerie",
  "Architecture & Interior": "architecture",
  "Banking": "bank",
  "Cars": "car",
  "Hospitality": "hotel",
  "Love & Romance": "couple",
  "Medical Practice": "clinic",
  "Photography": "camera",
  "Plus Size Fashion": "fashion",
  "Professional Training & Coaching": "coaching",
  "Public Safety": "police",
  "Wine and Spirits": "wine",
  "Farming": "farmer",
  "Animals": "wildlife",
  "Automation & Robotics": "robot",
  "Quotes & Texts": "books",
  "Politics": "parliament",
  "Activism & Social Causes": "activism",
  "Books and Movies": "movies",
  "Gambling & Casinos": "casino",
  "Recreational Facilities": "recreation",
  "Alternative Medicine": "herbs",
  "Tobacco": "tobacco",
  "Airlines Aviation": "airplane",
};

/* =========================================================
   AUTOMATIC INDUSTRY IMAGE
   ========================================================= */

const getIndustryImage = (industry, index) => {
  const keywords =
    industryImageKeywords[industry] ||
    `${industry} lifestyle`;

  return `https://loremflickr.com/900/600/${encodeURIComponent(
    keywords
  )}?lock=${index + 100}`;
};


const getDescription = (industry) => {
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
   const [theme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <main
      className={`all-industries-page ${
        theme === "dark"
          ? "industries-dark"
          : "industries-light"
      }`}
    >
  

      {/* HERO */}
      <section className="all-industries-hero">
        <div className="all-industries-hero-inner"
        >
<a href="/#industires" className="industries-back-button">
  <span className="industries-back-arrow">←</span>
  <span>Back to Website</span>
</a>
          <div className="all-industries-eyebrow">
            
            <p>INFLUNEXA INDUSTRY NETWORK</p>
           
          </div>
<div className="industry-heading">
          <h1 >
            Creator Campaigns Built for{" "}
            <span>Every Industry.</span>
          </h1>
</div>
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
              <strong>10000+</strong>
              <span>Verified Creators</span>
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