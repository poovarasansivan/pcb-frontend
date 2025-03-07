import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Input,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../../icons";
import PageTitle from "../../components/Typography/PageTitle";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
} from "@windmill/react-ui";
import { Label } from "@windmill/react-ui";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { IoMdEye } from "react-icons/io";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa6";

function IssuesTracking() {
  const [facultyRequests, setFacultyRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);
  const [editedData, setEditedData] = useState({});
  const history = useHistory();

  const resultsPerPage = 8;
  const totalResults = facultyRequests.length || 0;

  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchissues = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/get-issues",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data ) {
          setFacultyRequests(response.data);
          setFilteredData(response.data);
        } else {
          setFacultyRequests([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchissues();
  }, []);

  useEffect(() => {
    setFilteredData(
      facultyRequests.filter(
        (request) =>
          (request.project_id &&
            request.project_id
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.project_name &&
            request.project_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.technician_id &&
            request.technician_id
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.technician_name &&
            request.technician_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.issues &&
            request.issues.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.solution &&
            request.solution.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, facultyRequests]);

  function openEditModal(rowData) {
    setRowDataToEdit(rowData);
    setEditedData({ ...rowData }); // Initialize editedData with existing rowData values
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openDeleteModal(rowData) {
    setRowDataToEdit(rowData);
    setIsDeleteModalOpen(true);
  }
  const handleAddnew = () => {
    history.push("/app/add-new-issues");
  };

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function openViewModal(rowData) {
    setRowDataToEdit(rowData);
    setIsViewModalOpen(true);
  }
  function handleDelete() {
    const updatedRequests = facultyRequests.filter(
      (request) => request.project_id !== rowDataToEdit.project_id
    );
    setFacultyRequests(updatedRequests);
    closeDeleteModal();
  }

  const handleUpdate = async () => {
    if (!rowDataToEdit) return;
    const UpdatedData = {
      issue_id: rowDataToEdit.issue_id,
      solution: editedData.solution,
      status: editedData.issue_status, // Use selected status
    };
    try {
      const response = await axios.put(
        "http://localhost:8080/protected/update-issues",
        UpdatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const updatedRequests = facultyRequests.map((request) =>
          request.issue_id === rowDataToEdit.issue_id
            ? {
                ...request,
                solution: editedData.solution,
                status: editedData.issue_status,
              }
            : request
        );
        setFacultyRequests(updatedRequests);
        closeEditModal();
      }
    } catch (error) {
      console.log("Error updating issue:", error);
    }
    setIsEditModalOpen(false);
  };

  function handlePageChange(p) {
    setPage(p);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  const headers = [
    { label: "Issue ID", key: "issue_id" },
    { label: "Project ID", key: "project_id" },
    { label: "Project Name", key: "project_name" },
    { label: "Technician ID", key: "technician_id" },
    { label: "Technician Name", key: "technician_name" },
    { label: "Issues", key: "issues" },
    { label: "Solution", key: "solution" },
    { label: "Status", key: "status" },
  ];
  const role = localStorage.getItem("role");
  return (
    <>
      <PageTitle>Issues Management </PageTitle>
      <TableContainer className="mb-8">
        <div className="m-4 flex justify-between items-center">
          <div className="flex justify-start items-center">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
          <div className="flex flex-row">
            {role === "2" && (
              <Button onClick={handleAddnew} className="mr-4">
                <CiCirclePlus size={24} className="mr-2 font-bold" />
                Add New
              </Button>
            )}
            {role === "1" && (
              <CSVLink
                data={filteredData.map((request) => ({
                  ...request,
                  status: request.status === "1" ? "Closed" : "Pending",
                }))}
                headers={headers}
                filename="issues_data.csv"
              >
                <Button size="large">
                  <FaDownload size={20} className="mr-2" /> Export
                </Button>
              </CSVLink>
            )}
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S No</TableCell>
              <TableCell>Issue ID</TableCell>
              <TableCell>Project ID</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Technician ID</TableCell>
              <TableCell>Technician Name</TableCell>
              <TableCell>Issues</TableCell>
              <TableCell>Solution</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredData
              .slice((page - 1) * resultsPerPage, page * resultsPerPage)
              .map((request, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.issue_id}</TableCell>
                  <TableCell>{request.project_id}</TableCell>
                  <TableCell>{request.project_name}</TableCell>
                  <TableCell>{request.technician_id}</TableCell>
                  <TableCell>{request.technician_name}</TableCell>
                  <TableCell>{request.issues}</TableCell>
                  <TableCell>{request.solution}</TableCell>
                  <TableCell>
                    {request.status === "1" ? (
                      <Badge type="success">Closed</Badge>
                    ) : (
                      <Badge type="warning">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button
                        layout="link"
                        size="icon"
                        aria-label="View"
                        onClick={() => openViewModal(request)}
                      >
                        <IoMdEye className="w-5 h-5" />
                      </Button>
                      {role === "1" && (
                        <>
                          <Button
                            layout="link"
                            size="icon"
                            aria-label="Edit"
                            onClick={() => openEditModal(request)}
                          >
                            <EditIcon className="w-5 h-5" />
                          </Button>
                          <Button
                            layout="link"
                            size="icon"
                            aria-label="Delete"
                            onClick={() => openDeleteModal(request)}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={handlePageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Request</ModalHeader>
        <ModalBody>
          <Label className="mb-2">Issue Solution</Label>
          <Input
            name="solution"
            placeholder="Enter issue solution..."
            value={editedData.solution || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, solution: e.target.value })
            }
            className="mb-4"
          />

          <Label className="mb-2">Issue Status</Label>
          <Select
            name="issue_status"
            value={editedData.issue_status || "0"}
            onChange={(e) =>
              setEditedData({ ...editedData, issue_status: e.target.value })
            }
          >
            <option value="1">Closed</option>
            <option value="0">Pending</option>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button layout="link" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>Are you sure you want to delete this request?</ModalBody>
        <ModalFooter>
          <Button layout="link" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <ModalHeader>View Issues Details</ModalHeader>
        <ModalBody>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Project ID: </p>
            <p className="ml-2">{rowDataToEdit?.project_id}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Project Name: </p>
            <p className="ml-2">{rowDataToEdit?.project_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Technician ID: </p>
            <p className="ml-2">{rowDataToEdit?.technician_id}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Technician Name: </p>
            <p className="ml-2">{rowDataToEdit?.technician_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Issues: </p>
            <p className="ml-2">{rowDataToEdit?.issues}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button layout="link" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default IssuesTracking;
