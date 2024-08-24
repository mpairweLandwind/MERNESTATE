// data.js (or accordion.js)
import { HiShieldCheck } from "react-icons/hi";
import { MdCancel, MdAnalytics } from "react-icons/md";

const getData = (t) => [
  {
    icon: <HiShieldCheck />,
    heading: t("home.value.best_interest_rates"),
    detail: t("home.value.best_interest_rates_detail"),
  },
  {
    icon: <MdCancel />,
    heading: t("home.value.prevent_unstable_prices"),
    detail: t("home.value.prevent_unstable_prices_detail"),
  },
  {
    icon: <MdAnalytics />,
    heading: t("home.value.best_price"),
    detail: t("home.value.best_price_detail"),
  },
];

export default getData;
