// import React from 'react';
// import Lottie from 'lottie-react';
// import animationData from './Animation - 1741438664465.json';

// const Winner = () => {
//     return <Lottie animationData={animationData} loop={true} />;
// };

// export default Winner;

import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1741439711907.json';

const Aww = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1850); // Hides animation after 5 seconds

        return () => clearTimeout(timer); // Cleanup function
    }, []);

    return isVisible ? <Lottie animationData={animationData} loop={true} /> : null;
};

export default Aww;
