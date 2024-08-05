import  { useState, useEffect } from 'react';
import axios from 'axios';

const AreaProgressChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/listing/property-status-percentages');
        setData(response.data);
      } catch (error) {
        console.error("Error loading property statuses:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Property Status</h4>
      </div>
      <div className="progress-bar-list">
        {data.map((progressbar, index) => (
          <div className="progress-bar-item" key={index}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{progressbar.name}</p>
              <p className="bar-item-info-value">
                {Math.round(progressbar.percentValues)}%
              </p>
            </div>
            <div className="bar-item-full">
              <div
                className="bar-item-filled"
                style={{ width: `${progressbar.percentValues}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default  AreaProgressChart; // Adjust the export if using different file naming