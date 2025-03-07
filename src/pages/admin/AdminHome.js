import React, { useState, useEffect } from "react";
import InfoCard from "../../components/Cards/InfoCard";
import PageTitle from "../../components/Typography/PageTitle";
import SectionTitle from "../../components/Typography/SectionTitle";
import RoundIcon from "../../components/RoundIcon";
import { IoMdCodeWorking } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiProgress6Line } from "react-icons/ri";
import axios from "axios";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa6";
import { Button } from "@windmill/react-ui";

function Dashboard() {
  const [data, setData] = useState([]);
  const [requestdata, setrequestdata] = useState([]);
  const headers = [
    { label: "Request ID", key: "req_id" },
    { label: "Faculty ID", key: "faculty_id" },
    { label: "Faculty Name", key: "faculty_name" },
    { label: "Department", key: "department" },
    { label: "Project Name", key: "project_name" },
    { label: "Project Description", key: "project_description" },
    { label: "Design Tool", key: "design_tool" },
    { label: "No. of Students", key: "number_of_students" },
    { label: "Urgency Level", key: "urgency_level" },
    { label: "Contact", key: "contact" },
    { label: "Design File", key: "design_file" },
    { label: "Manufacturing Budget", key: "manufacturing_budget" },
    { label: "Status", key: "req_status" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/bulk-action-data",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if(response.data!==null){
          setrequestdata(response.data);
        }
        else{
          setrequestdata([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/getadmin-home-data",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

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

        <InfoCard title="Project In Progress" value={data.progress_project}>
          <RoundIcon
            icon={RiProgress6Line}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Completed Projects" value={data.completed_project}>
          <RoundIcon
            icon={FaRegCheckCircle}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
      <SectionTitle>Download Bulk Action Data</SectionTitle>
      <CSVLink
        data={requestdata.map((request) => ({
          ...request,
          status:
            request.req_status === "1"
              ? "Approved"
              : request.req_status === "2"
              ? "Rejected"
              : "Pending",
        }))}
        headers={headers}
        filename="Project-Data.csv"
        className="ml-4"
      >
        <Button size="large">
          <FaDownload size={20} className="mr-2" /> Export
        </Button>
      </CSVLink>
    </>
  );
}

export default Dashboard;
