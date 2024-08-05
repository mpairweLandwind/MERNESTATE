
import AreaCards from "../../components/dashboard/areaCards/AreaCards";
import AreaTop from "../../components/dashboard/areaTop/AreaTop";
import AreaTable from "../../components/dashboard/areaTable/AreaTable";
import AreaCharts from "../../components/dashboard/areaCharts/AreaCharts";
import './dashboard.scss'
const Dashboard = () => {
  return (
    <div className="content-area">
      <AreaTop />
      <AreaCards />
      <AreaCharts />
      <AreaTable />
    </div>
  );
};

export default Dashboard;
