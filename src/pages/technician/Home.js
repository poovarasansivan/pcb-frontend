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
      <PageTitle>Recently Assigned Projects</PageTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>S No</TableCell>
              <TableCell>Project ID</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Description</TableCell>
              <TableCell>Urgency Level</TableCell>
              <TableCell>Contact</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{user.projectid}</TableCell>
                <TableCell>{user.projectname}</TableCell>
                <TableCell>{user.projectdescription}</TableCell>
                <TableCell>
                  {user.urgencylevel === "High" ? (
                    <Badge type="danger">High</Badge>
                  ) : user.urgencylevel === "Medium" ? (
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
