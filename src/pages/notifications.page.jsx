import React, { useState } from 'react';

const Notifications = () => {
    const [filter, setFilter] = useState("all");

    const filters = ['all', 'like', 'comment', 'reply'];

    const handleFunctionClick = (e) => {
        setFilter(e.target.textContent);
    };

    return (
        <div>
            <h1 className='max-md:hidden'>Recent Notifications</h1>

            <div className='my-8 flex gap-6'>
                {
                    filters.map((filterName, index) => (
                        <button
                            key={index}
                            className={`py-2 ${filter === filterName ? "btn-dark" : "btn-light"}`}
                            onClick={handleFunctionClick}
                            type="button"
                        >
                            {filterName}
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default Notifications;
