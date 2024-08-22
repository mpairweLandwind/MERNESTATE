import "./Hero.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import PropTypes from "prop-types";


const Hero = ({t}) => {

  return (
    <section className="hero-wrapper">
      <div className="paddings innerWidth flexCenter hero-container">
        {/* left side */}
        <div className="flexColStart hero-left">
          <div className="hero-title">
            <div className="orange-circle" />
            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 2,
                type: "ease-in",
              }}
            >
              {t('home.hero.discover')} <br />
              {t('home.hero.most_suitable')}
              <br /> {t('home.hero.property')}
            </motion.h1>
          </div>
          <div className="flexColStart secondaryText flexhero-des">
            <span>{t('home.hero.find_variety')}</span>
            <span>{t('home.hero.forget_difficulties')}</span>
          </div>

          <SearchBar />

          <div className="flexCenter stats">
            <div className="flexColCenter stat">
              <span>
                <CountUp start={8800} end={9000} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">{t('home.hero.premium_product')}</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp start={1950} end={2000} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">{t('home.hero.happy_customer')}</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp end={28} /> <span>+</span>
              </span>
              <span className="secondaryText">{t('home.hero.awards_winning')}</span>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flexCenter hero-right">
          <motion.div
            initial={{ x: "7rem", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 2,
              type: "ease-in",
            }}
            className="image-container"
          >
            <img src="./hero-image.png" alt={t('home.hero.houses_alt')} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  t: PropTypes.func.isRequired,
};

export default Hero;
