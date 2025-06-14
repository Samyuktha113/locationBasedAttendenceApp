import { getFirestore, doc, getDoc } from "firebase/firestore";

/**
 * Fetches approved leave dates for a given employee ID.
 * @param {string} employeeId - The ID of the employee.
 * @returns {Promise<string[]>} - List of approved leave dates in YYYY-MM-DD format.
 */
export const fetchApprovedLeaveDates = async (employeeId) => {
  const db = getFirestore();
  const docRef = doc(db, "leaveRequests", employeeId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const leaves = docSnap.data().leaves || [];
    const approvedLeaves = leaves
      .filter((leave) => leave.status === "Approved")
      .flatMap((leave) => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        const dates = [];
        let currentDate = startDate;

        while (currentDate <= endDate) {
          dates.push(currentDate.toISOString().split("T")[0]);
          currentDate.setDate(currentDate.getDate() + 1); // Increment day by day
        }

        return dates;
      });

    return approvedLeaves;
  } else {
    console.error("No such document for employee:", employeeId);
    return [];
  }
};
