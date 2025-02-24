import React, { useState, useEffect } from "react";
import InfoCard from "../../components/Cards/InfoCard";
import PageTitle from "../../components/Typography/PageTitle";
import RoundIcon from "../../components/RoundIcon";
import { IoMdCodeWorking } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiProgress6Line } from "react-icons/ri";

const RecentTasks = [
  {
    projectid: "P1001",
    projectname: "Project 1",
    projectdescription: "Project 1 Description",
    urgencylevel: "High",
    contact: "John Doe",
  },
];
function Dashboard() {
  const [data, setData] = useState(RecentTasks);
  const [page, setPage] = useState(1);

  const resultsPerPage = 5;
  const totalResults = RecentTasks.length;

  function onPageChange(p) {
    setPage(p);
  }
  useEffect(() => {
    setData(
      RecentTasks.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [page]);
  return (
    <>
      <PageTitle>Home Page</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Projects" value="6">
          <RoundIcon
            icon={IoMdCodeWorking}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Projects" value="4">
          <RoundIcon
            icon={MdOutlinePendingActions}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Project In Progress" value="2">
          <RoundIcon
            icon={RiProgress6Line}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Completed Projects" value="3">
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
