// import React from "react";
// import { useContext } from "react";
// import { Context } from "../../main";
// import { Navigate } from "react-router-dom";
// import HeroSection from "./HeroSection";
// import Analysis from "../Analysis/Analysis";

// const Home = () => {
//   const { isAuthorized } = useContext(Context);
//   if (!isAuthorized) {
//     return <Navigate to={"/login"} />;
//   }
//   return (
//     <>
//       <section className="homePage page">
//         <HeroSection />
//         <Analysis />
//       </section>
//     </>
//   );
// };

// export default Home;



import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import HeroSection from "./HeroSection";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const { isAuthorized } = useContext(Context);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        console.log("Fetching role distribution...");
        const response = await axios.get("http://localhost:4000/api/v1/analysis/role-distribution");
        console.log("Role Distribution Response:", response.data);
        setRoleDistribution(response.data.roles);
        console.log("Updated Role Distribution State:", response.data.roles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching role distribution:", error);
        setLoading(false);
      }
    };
  
    fetchAnalysis();
  }, []);
  

  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const roleData = {
    labels: roleDistribution.map((role) => role._id || "Unknown"),
    datasets: [
      {
        data: roleDistribution.map((role) => role.count || 0),
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  console.log("Mapped Role Data for Chart:", roleData);

  return (
    <section className="homePage page">
      <HeroSection />
      <div className="charts">
        <div className="chart-container">
          <h2>Role Distribution</h2>
          <Pie data={roleData} />
        </div>
      </div>
    </section>
  );
};

export default Home;
