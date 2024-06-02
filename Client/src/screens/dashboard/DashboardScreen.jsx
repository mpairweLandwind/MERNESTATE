
import AreaCards from "../../components/dashboard/areaCards/AreaCard";
import AreaTop from "../../components/dashboard/areaTop/AreaTop";
import AreaTable from "../../components/dashboard/areaTable/AreaTable";
import AreaCharts from "../../components/dashboard/areaCharts/AreaCharts";

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
