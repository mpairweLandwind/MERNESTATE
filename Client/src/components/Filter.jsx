import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';

function Filter() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className='bg-gray-100 p-5 rounded-lg'>
            <h1 className='text-xl font-semibold mb-3'>
                Search results for <b>{searchTerm || "Bujumbura"}</b>
            </h1>
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col">
                    <label htmlFor="city" className='font-medium'>Locations</label>
                    <input
                        type="text"
                        id='city'
                        name='city'
                        placeholder='city location'
                        className='mt-1 p-2 border border-gray-300 rounded'
                        onChange={handleChange}
                        value={searchTerm}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="type" className='font-medium'>Type</label>
                    <select name="type" id="type" className='mt-1 p-2 border border-gray-300 rounded'>
                        <option value="">any</option>
                        <option value="buy">Buy</option>
                        <option value="rent">Rent</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="property" className='font-medium'>Property</label>
                    <select name="property" id="property" className='mt-1 p-2 border border-gray-300 rounded'>
                        <option value="">any</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="land">Land</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="minPrice" className='font-medium'>Min Price</label>
                    <input
                        type="number"
                        id='minPrice'
                        name='minPrice'
                        placeholder='any'
                        className='mt-1 p-2 border border-gray-300 rounded'
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="maxPrice" className='font-medium'>Max Price</label>
                    <input
                        type="number"
                        id='maxPrice'
                        name='maxPrice'
                        placeholder='any'
                        className='mt-1 p-2 border border-gray-300 rounded'
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="bedroom" className='font-medium'>Bedroom</label>
                    <input
                        type="number"
                        id='bedroom'
                        name='bedroom'
                        placeholder='any'
                        className='mt-1 p-2 border border-gray-300 rounded'
                    />
                </div>
            </div>
            <button className='bg-yellow-400 p-2 rounded hover:bg-yellow-300 transition duration-200'>
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
}

export default Filter;
