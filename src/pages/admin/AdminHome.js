import React, { useState, useEffect } from "react";
import InfoCard from "../../components/Cards/InfoCard";
import ChartCard from "../../components/Chart/ChartCard";
import {Bar } from "react-chartjs-2";
import ChartLegend from "../../components/Chart/ChartLegend";
import PageTitle from "../../components/Typography/PageTitle";
import RoundIcon from "../../components/RoundIcon";
import { IoMdCodeWorking } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiProgress6Line } from "react-icons/ri";

export const totalprojectslegends = [
    { title: 'Total Request', color: 'bg-teal-600' },
    { title: 'Completed Request', color: 'bg-purple-600' },
  ]
  export const costestimationlegends = [
    { title: 'Budget Requested', color: 'bg-teal-600' },
    { title: 'Utilized Budget', color: 'bg-purple-600' },
  ]
function Dashboard() {
  const [data, setData] = useState([]);
  const [costestimation, setCostEstimation] = useState([]);
  const [totalprojectsdata, setTotalProjects] = useState([]);
  const costestimationdata = {
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Total Budget Request',
          backgroundColor: '#0694a2',
          // borderColor: window.chartColors.red,
          borderWidth: 1,
          data: [12000, 20000, 25000, 36000, 33000, 40000, 20000],
        },
        {
          label: 'Utilized Budget',
          backgroundColor: '#7e3af2',
          // borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: [12000, 20000, 12000, 30000, 25000, 30000, 14000],
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  }
  const totalprojects = {
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Total Request',
          backgroundColor: '#0694a2',
          // borderColor: window.chartColors.red,
          borderWidth: 1,
          data: [25, 20, 12, 36, 33, 40, 20],
        },
        {
          label: 'Completed Request',
          backgroundColor: '#7e3af2',
          // borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: [25, 20, 1, 12, 25, 30, 14],
        },
      ],
    },
    options: {
      responsive: true,
    },
    legend: {
      display: false,
    },
  }
  return (
    <>
      <PageTitle>Home Page</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Projects" value="63">
          <RoundIcon
            icon={IoMdCodeWorking}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Projects" value="46">
          <RoundIcon
            icon={MdOutlinePendingActions}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Project In Progress" value="37">
          <RoundIcon
            icon={RiProgress6Line}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Completed Projects" value="35">
          <RoundIcon
            icon={FaRegCheckCircle}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <PageTitle>Analytics</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Cost Estimation">
            <Bar {...costestimationdata} />
          <ChartLegend legends={costestimationlegends} />
        </ChartCard>
        <ChartCard title="Total Projects">
            <Bar {...totalprojects} />
          <ChartLegend legends={totalprojectslegends} />
        </ChartCard>
      </div>
    </>
  );
}

export default Dashboard;
