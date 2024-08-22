import Hero from '../components/Hero/Hero';
import Companies from '../components/Companies/Companies';
import Residencies from '../components/Residencies/Residencies';
import Value from '../components/Value/Value';
import Contact from '../components/Contact/Contact';
import GetStarted from '../components/GetStarted/GetStarted';
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation(["home"]);

  return (
    <div className="App">
      <div>
        <div className="white-gradient" />
        <Hero t={t} />
      </div>  

      <Companies t={t} />
      <Residencies t={t} />
      <Value t={t} />
      <Contact t={t} />
      <GetStarted t={t} />
    </div>
  );
};

export default Home;
