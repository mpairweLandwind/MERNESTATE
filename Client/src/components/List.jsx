import PropTypes from 'prop-types';
import Card from './Card/Card';

function List({ listing }) {
    // Ensure that listing is always treated as an array
    if (!Array.isArray(listing) || listing.length === 0) {
        return <p></p>;
    }

    return (
        <div className='flex flex-col gap-10'>
            {listing.map(item => (
                <Card key={item.id} listing={item} />
            ))}
        </div>
    );
}

List.propTypes = {
    listing: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        // Add other required prop types for listing here
    }))
};

export default List;
