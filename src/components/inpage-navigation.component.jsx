import React, { useEffect, useRef, useState } from 'react';

export let activeTabLineRef;
export let activeTabRefs;

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    activeTabLineRef = useRef(null);
    activeTabRefs = useRef([]);

    const handleChangeTab = (btn, i) => {
        const { offsetWidth, offsetLeft } = btn;

        if (activeTabLineRef.current) {
            activeTabLineRef.current.style.width = `${offsetWidth}px`;
            activeTabLineRef.current.style.left = `${offsetLeft}px`;
        }

        setInPageNavIndex(i);
    };

    useEffect(() => {
        if (activeTabRefs.current[defaultActiveIndex]) {
            handleChangeTab(activeTabRefs.current[defaultActiveIndex], defaultActiveIndex);
        }
    }, [defaultActiveIndex]);

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {routes.map((item, i) => (
                    <button
                        ref={(el) => (activeTabRefs.current[i] = el)}
                        key={i}
                        className={`p-4 px-5 capitalize ${inPageNavIndex === i ? 'text-black' : 'text-dark-grey'} ${defaultHidden.includes(item) ? 'md:hidden' : ''}`}
                        onClick={(e) => handleChangeTab(e.target, i)}
                    >
                        {item}
                    </button>
                ))}
                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
            </div>

            {/* Render the content corresponding to the active tab */}
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
};

export default InPageNavigation;
