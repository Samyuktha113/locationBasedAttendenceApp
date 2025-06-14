// context/EmployeeContext.js
// import React, { createContext, useState, useContext } from 'react';

// const EmployeeContext = createContext();

// export const useEmployee = () => useContext(EmployeeContext);

// export const EmployeeProvider = ({ children }) => {
//     const [employeeData, setEmployeeData] = useState(null);

//     return (
//         <EmployeeContext.Provider value={{ employeeData, setEmployeeData }}>
//             {children}
//         </EmployeeContext.Provider>
//     );
// };


/* import React, { createContext, useState } from 'react';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employee, setEmployee] = useState({ eid: '12345' }); // Sample or actual logic to fetch employee ID

  return (
    <EmployeeContext.Provider value={employee}>
      {children}
    </EmployeeContext.Provider>
  );
};
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../services/firebaseAuth'; // Import Firebase configuration
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';


const EmployeeContext = createContext();

export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'locations'), orderBy('timestamp', 'desc')); // Order by timestamp to get the latest location first
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const locations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployeeData(locations); // Update the employee data with new real-time updates
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  return (
    <EmployeeContext.Provider value={{ employeeData, setEmployeeData }}>
      {children}
    </EmployeeContext.Provider>
  );
};
