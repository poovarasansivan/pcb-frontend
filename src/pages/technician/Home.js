import React, { useState, useEffect } from "react";
import InfoCard from "../../components/Cards/InfoCard";
import PageTitle from "../../components/Typography/PageTitle";
import RoundIcon from "../../components/RoundIcon";
import { IoMdCodeWorking } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiProgress6Line } from "react-icons/ri";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from "@windmill/react-ui";
import axios from "axios";


function Dashboard() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [cardData, setCardData] = useState([]);
  const resultsPerPage = 5;
  const totalResults = data.length||0;
  const faculty_id = localStorage.getItem("facultyID");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:8080/protected/get-technician-recentdata",{
          technician_id: faculty_id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        if(response.data!==null){
          setData(response.data);
        }
        else{
          setData([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  function onPageChange(p) {
    setPage(p);
  }
  useEffect(() => {
    setData(
      data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    );
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/protected/get-technician-homedata",{
            technician_id: localStorage.getItem("facultyID"),
          },{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        setCardData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <PageTitle>Home Page</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Projects" value={cardData.total_projects}>
          <RoundIcon
            icon={IoMdCodeWorking}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Projects" value={cardData.pending_projects}>
          <RoundIcon
            icon={MdOutlinePendingActions}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard title="Projects On Progress" value={cardData.project_progress}>
          <RoundIcon
            icon={RiProgress6Line}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
        <InfoCard title="Completed Projects" value={cardData.completed_projects}>
          <RoundIcon
            icon={FaRegCheckCircle}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
      <PageTitle>Recently Assigned Projects</PageTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>S No</TableCell>
              <TableCell>Project ID</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Urgency Level</TableCell>
              <TableCell>Contact</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{user.project_id}</TableCell>
                <TableCell>{user.project_name}</TableCell>
                <TableCell>
                  {user.urgency_level === "High" ? (
                    <Badge type="danger">High</Badge>
                  ) : user.urgency_level === "Medium" ? (
                    <Badge type="success">Medium</Badge>
                  ) : (
                    <Badge type="warning">Low</Badge>
                  )}
                </TableCell>
                <TableCell>{user.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default Dashboard;
