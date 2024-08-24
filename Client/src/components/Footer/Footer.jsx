
import "./Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("footer");

  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */}
        <div className="flexColStart f-left">
          <img src="./logo2.png" alt={t("footer.logo_alt")} width={120} />
          <span className="secondaryText">
            {t("footer.vision_line1")} <br />
            {t("footer.vision_line2")}
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">{t("footer.information_title")}</span>
          <span className="secondaryText">{t("footer.address")}</span>
          <div className="flexCenter f-menu">
            <span>{t("footer.menu.property")}</span>
            <span>{t("footer.menu.services")}</span>
            <span>{t("footer.menu.product")}</span>
            <span>{t("footer.menu.about_us")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
