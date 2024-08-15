import { HiLocationMarker } from "react-icons/hi";
import PropTypes from 'prop-types';

const SearchBar = ({ filter = '', setFilter }) => {
  return (
    <div className="flexCenter search-bar">
      <HiLocationMarker color="var(--blue)" size={25} />
      <input
        placeholder="Search by title/city/region/type..."
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button className="button">Search</button>
    </div>
  );
};

SearchBar.propTypes = {
  filter: PropTypes.string,
  setFilter: PropTypes.func,
};

export default SearchBar;
