import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ThemeContext } from "../../../context/ThemeContext";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import "./AreaCharts.scss";

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize data with months from Jan to Dec
        const initialData = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2000, i).toLocaleString('default', { month: 'short' }),
          landlord: 0,
          user: 0
        }));

        const response = await axios.get('http://localhost:3000/api/user/user-role-monthly-counts');
        // Merge API data with initialized months
        response.data.forEach(dataPoint => {
          const index = initialData.findIndex(month => month.month === dataPoint.month);
          if (index !== -1) {
            initialData[index] = { ...initialData[index], ...dataPoint };
          }
        });

        setData(initialData);
      } catch (error) {
        console.error('Error fetching monthly user role counts:', error);
        // Even in case of an error, set initial data to show months on the X-axis
        setData(Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2000, i).toLocaleString('default', { month: 'short' }),
          landlord: 0,
          user: 0
        })));
      }
    };

    fetchData();
  }, []);

  const formatTooltipValue = (value, name) => {
    return `${value} ${name === 'landlord' ? 'landlords' : 'users'}`;
  };

  const formatYAxisLabel = (value) => `${value} users`;

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Monthly User Roles Distribution</h5>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="month"
              tick={{ fill: theme === LIGHT_THEME ? "#676767" : "#f3f3f3" }}
            />
            <YAxis
              tickFormatter={formatYAxisLabel}
              domain={[0, 'dataMax']}
              tick={{ fill: theme === LIGHT_THEME ? "#676767" : "#f3f3f3" }}
            />
            <Tooltip formatter={formatTooltipValue} />
            <Legend />
            <Bar
              dataKey="landlord"
              name="Landlords"
              fill="#8884d8"
              barSize={20}
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="user"
              name="Users"
              fill="#82ca9d"
              barSize={20}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart