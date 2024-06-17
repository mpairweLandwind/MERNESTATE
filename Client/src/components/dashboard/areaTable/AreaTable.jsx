import  { useState, useEffect } from 'react';
import axios from 'axios';
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Property Name",
  "City",
  "Address",
  "Listing Status",
  "Regular Price",
  "Discount Price",
  "Client Name",
  "Client Email", 
  "Client Status",
  "Approval status",
  "Action",
];

const fetchData = async (setter) => {
  try {
    const response = await axios.get('/api/listing/get');
    setter(response.data);
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    setter([]);
  }
};

const AreaTable = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchData(setListings);
  }, []);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Listings Management</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.name}</td>
                <td>{listing.city || "Not specified"}</td>
                <td>{listing.address}</td>
                <td>
                  <div className="dt-status">
                    <span className={`dt-status-dot dot-${listing.status.toLowerCase()}`}></span>
                    <span className="dt-status-text">{listing.status}</span>
                  </div>
                </td>
                <td>${listing.regularPrice.toFixed(2)}</td>
                <td>${listing.discountPrice.toFixed(2)}</td>
                <td>{listing.user?.username}</td>
                <td>{listing.user?.email}</td>
                <td>{listing.user?.status}</td>
                <td>{ listing?.approvalStatus}</td>
                <td className="dt-cell-action">
                  <AreaTableAction listingId={listing.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;