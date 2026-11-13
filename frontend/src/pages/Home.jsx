import roseBouquetImage from "../assets/rose-bouquet.png";
import birthdayPhoto from "../assets/birthday-photo.jpg";
import christmasPhoto from "../assets/christmas-photo.jpg";
import graduationPhoto from "../assets/Graduation-photo.jpg";
import homeHeroImage from "../assets/home-hero.png";
import mothersDayPhoto from "../assets/mothersday-photo.jpg";
import "./Shop.css";

const occasionCards = [
 {
  occasionName: "Birthdays",
  occasionKey: "birthday",
  image: birthdayPhoto,
  imageAlt: "A birthday gift",
},
{
  occasionName: "Anniversaries",
  occasionKey: "anniversary",
  image: roseBouquetImage,
  imageAlt: "An anniversary gift",
},
{
  occasionName: "Graduations",
  occasionKey: "graduation",
  image: graduationPhoto,
  imageAlt: "A graduation gift",
},
{
  occasionName: "Mother’s Day",
  occasionKey: "mothers-day",
  image: mothersDayPhoto,
  imageAlt: "A Mother’s Day gift",
},
{
  occasionName: "Christmas",
  occasionKey: "christmas",
  image: christmasPhoto,
  imageAlt: "A Christmas gift",
},
];

function Home() {
  return (
    <>
      <main className="shop-home">
        <img
          className="shop-home-image"
          src={homeHeroImage}
          alt="A beautifully wrapped gift with flowers"
        />

        <section className="shop-home-content">
          <p className="shop-home-label">DON’T JUST BUY A GIFT...</p>
          <h1 className="shop-home-title">
            Create a gift
            <br />
            that tells a story
          </h1>
          <span className="shop-home-accent" aria-hidden="true"></span>
          <p className="shop-home-description">
            Personalised gifts for every occasion.
          </p>
          <a className="shop-home-button" href="/shop">
            Shop now →
          </a>
        </section>
      </main>

      <section className="shop-occasion-section">
        <div className="shop-occasion-header">
          <h2 className="shop-occasion-title">Shop by Occasion</h2>
          <a className="shop-occasion-view-all" href="/shop">
            View all →
          </a>
        </div>

        <div className="shop-occasion-grid">
          {occasionCards.map((occasion) => (
            <a
              className="shop-occasion-card"
              href={`/shop?occasion=${occasion.occasionKey}`}
              key={occasion.occasionName}
            >
              <img
                className="shop-occasion-image"
                src={occasion.image}
                alt={occasion.imageAlt}
              />
              <span className="shop-occasion-name">
                {occasion.occasionName}
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;