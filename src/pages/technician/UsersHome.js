import React, { useState, useEffect } from "react";
import InfoCard from "../../components/Cards/InfoCard";
import PageTitle from "../../components/Typography/PageTitle";
import RoundIcon from "../../components/RoundIcon";
import { IoMdCodeWorking } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiProgress6Line } from "react-icons/ri";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:8080/protected/get-users-homedata",{
          faculty_id: localStorage.getItem("facultyID"),
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  console.log(data);
  return (
    <>
      <PageTitle>Home Page</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Projects" value={data.total_projects}>
          <RoundIcon
            icon={IoMdCodeWorking}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Projects" value={data.pending_projects}>
          <RoundIcon
            icon={MdOutlinePendingActions}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Project In Progress" value={data.project_in_progress}>
          <RoundIcon
            icon={RiProgress6Line}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Completed Projects" value={data.completed_projects}>
          <RoundIcon
            icon={FaRegCheckCircle}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
    </>
  );
}

export default Dashboard;
