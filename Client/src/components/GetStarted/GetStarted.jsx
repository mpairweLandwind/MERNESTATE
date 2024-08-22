import "./GetStarted.css";
import PropTypes from "prop-types";

const GetStarted = ({t}) => {
 

  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">{t('home.get_started.get_started_title')}</span>
          <span className="secondaryText">
            {t('home.get_started.subscribe_text')}<br />
            {t('home.get_started.find_residence_soon')}
          </span>
          <a href="mailto:alienyuyen@gmail.com" className="button">
            {t('home.get_started.get_started_button')}
          </a>
        </div>
      </div>
    </div>
  );
};
GetStarted.propTypes = {
  t: PropTypes.func.isRequired,
};


export default GetStarted;
