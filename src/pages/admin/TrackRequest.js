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
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa6";
import { IoMdEye } from "react-icons/io";
import { EditIcon, TrashIcon } from "../../icons";
import PageTitle from "../../components/Typography/PageTitle";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
} from "@windmill/react-ui";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Label } from "@windmill/react-ui";

function ProjectRequest() {
  const [facultyRequests, setFacultyRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);
  const [editedData, setEditedData] = useState({});
  const history = useHistory();
  const resultsPerPage = 8;
  const totalResults = facultyRequests?.length || 0;
  const headers = [
    { label: "Project ID", key: "project_id" },
    { label: "Project Name", key: "project_name" },
    { label: "Project Description", key: "project_description" },
    { label: "Faculty ID", key: "faculty_id" },
    { label: "Faculty Name", key: "faculty_name" },
    { label: "Department", key: "department" },
    { label: "Design Tool", key: "design_tool" },
    { label: "No of Students", key: "no_of_students" },
    { label: "Urgency Level", key: "urgency_level" },
    { label: "Contact", key: "contact" },
    { label: "Design File", key: "design_file" },
    { label: "Technician ID", key: "techician_id" },
    { label: "Technician Name", key: "techician_name" },
    { label: "Manufacturing Budget", key: "manufacturing_budget" },
    { label: "Status", key: "status" },
  ];
  const [page, setPage] = useState(1);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/get-projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
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
    fetchData();
  }, []);

  function openEditModal(rowData) {
    setRowDataToEdit(rowData);
    setIsEditModalOpen(true);
  }

  function openViewModal(rowData) {
    setRowDataToEdit(rowData);
    setIsViewModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openDeleteModal(rowData) {
    setRowDataToEdit(rowData);
    setIsDeleteModalOpen(true);
  }
  const handleAddnew = () => {
    history.push("/app/add-new-mapping");
  };
  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  async function handleUpdate() {
    if (!rowDataToEdit) return;

    const updatedData = {
      project_id: rowDataToEdit.project_id,
      manufacturing_budget: parseInt( editedData.manufacturing_budget || rowDataToEdit.manufacturing_budget),
      status: editedData.status,
    };

    try {
      const response = await axios.put(
        "http://localhost:8080/protected/update-manufacturing-request",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedRequests = facultyRequests.map((request) =>
          request.project_id === rowDataToEdit.project_id
            ? { ...request, ...updatedData }
            : request
        );
        setFacultyRequests(updatedRequests);
        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }
  
  useEffect(() => {
    setFilteredData(
      facultyRequests.filter((request) =>
        [
          request.project_id,
          request.project_name,
          request.project_description,
          request.faculty_id,
          request.faculty_name,
          request.department,
          request.design_tool,
          request.urgency_level,
          request.contact,
          request.design_file,
          request.techician_id,
          request.techician_name,
          request.status,
        ]
          .concat(
            // Convert numerical values to strings before searching
            [
              request.no_of_students,
              request.manufacturing_budget,
            ].map((val) => String(val))
          )
          .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, facultyRequests]);
  
  function handleDelete() {
    const updatedRequests = facultyRequests.filter(
      (request) => request.project_id !== rowDataToEdit.project_id
    );
    setFacultyRequests(updatedRequests);
    closeDeleteModal();
  }

  function handlePageChange(p) {
    setPage(p);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  
  return (
    <>
      <PageTitle>Track Project Manufacturing </PageTitle>

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
           {role==="1"&&(
            <Button onClick={handleAddnew} className="mr-4">
              <CiCirclePlus size={24} className="mr-4 font-bold" />
              Add New
            </Button>
            
           )}
           {role==="1"&&(
            <CSVLink
              data={filteredData.map((request) => ({
                ...request,
                status:
                  request.status === "1"
                    ? "On Progress"
                    : request.status === "12"
                    ? "Completed"
                    : request.status === "2"
                    ? "Material Preparation"
                    : request.status === "3"
                    ? "Inner Layer Processing"
                    : request.status === "4"
                    ? "Layer Lamination"
                    : request.status === "5"
                    ? "Drilling & Plating"
                    : request.status === "6"
                    ? "Outer Layer Processing"
                    : request.status === "7"
                    ? "Solder Mask & Silkscreen Application"
                    : request.status === "8"
                    ? "Surface Finishing"
                    : request.status === "9"
                    ? "Electrical Testing & Inspection"
                    : request.status === "10"
                    ? "PCB Cutting & Routing"
                    : request.status === "11"
                    ? "Final Inspection & Packaging"
                    : "Pending",
              }))}
              headers={headers}
              filename={"Project_Manufacturing_Status.csv"}
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
              <TableCell>Project ID</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Description</TableCell>
              <TableCell>Faculty ID</TableCell>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Design Tool</TableCell>
              <TableCell>No. of Students</TableCell>
              <TableCell>Urgency Level</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Design</TableCell>
              <TableCell>Technician ID</TableCell>
              <TableCell>Technician Name</TableCell>
              <TableCell>Manufacturing Budget</TableCell>
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
                  <TableCell>{request.project_id}</TableCell>
                  <TableCell>{request.project_name}</TableCell>
                  <TableCell>{request.project_description}</TableCell>
                  <TableCell>{request.faculty_id}</TableCell>
                  <TableCell>{request.faculty_name}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.design_tool}</TableCell>
                  <TableCell>{request.no_of_students}</TableCell>
                  <TableCell>{request.urgency_level}</TableCell>
                  <TableCell>{request.contact}</TableCell>
                  <TableCell>{request.design_file}</TableCell>
                  <TableCell>{request.techician_id}</TableCell>
                  <TableCell>{request.techician_name}</TableCell>
                  <TableCell>{request.manufacturing_budget}</TableCell>
                  <TableCell>
                    {request.status === "1" ? (
                      <Badge type="warning">On Progress</Badge>
                    ) : request.status === "12" ? (
                      <Badge type="success">Completed</Badge>
                    ) : request.status === "2" ? (
                      <Badge type="warning">Material Preparation</Badge>
                    ) : request.status === "3" ? (
                      <Badge type="warning">Inner Layer Processing</Badge>
                    ) : request.status === "4" ? (
                      <Badge type="warning">Layer Lamination</Badge>
                    ) : request.status === "5" ? (
                      <Badge type="warning">Drilling & Plating</Badge>
                    ) : request.status === "6" ? (
                      <Badge type="warning">Outer Layer Processing</Badge>
                    ) : request.status === "7" ? (
                      <Badge type="warning">Solder Mask & Silkscreen Application</Badge>
                    ) : request.status === "8" ? (
                      <Badge type="warning">Surface Finishing</Badge>
                    ) : request.status === "9" ? (
                      <Badge type="warning">Electrical Testing & Inspection</Badge>
                    ) : request.status === "10" ? (
                      <Badge type="warning">PCB Cutting & Routing</Badge>
                    ) : request.status === "11" ? (
                      <Badge type="warning">Final Inspection & Packaging</Badge>
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
                        {role==="2"&&(
                          <Button
                          layout="link"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => openEditModal(request)}
                        >
                          <EditIcon className="w-5 h-5" />
                        </Button>
                        )}
                        {role==="1"&&(
                          <Button
                          layout="link"
                          size="icon"
                          aria-label="Delete"
                          onClick={() => openDeleteModal(request)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </Button>
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

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Request</ModalHeader>
        <ModalBody>
          <Label> Budget</Label>
          <Input
            className="mt-1"
            placeholder="Enter Budget"
            value={
              editedData.manufacturing_budget ||
              rowDataToEdit?.manufacturing_budget
            }
            onChange={(e) =>
              setEditedData({
                ...editedData,
                manufacturing_budget: e.target.value,
              })
            }
          />
          <Label> Status</Label>
          <Select
            className="mt-1"
            value={editedData.status || rowDataToEdit?.status}
            onChange={(e) =>
              setEditedData({ ...editedData, status: e.target.value })
            }
          >
            <option value="1">On Progress</option>
            <option value="2">Material Preparation</option>
            <option value="3">Inner Layer Processing</option>
            <option value="4">Layer Lamination</option>
            <option value="5">Drilling & Plating</option>
            <option value="6">Outer Layer Processing</option>
            <option value="7">Solder Mask & Silkscreen Application</option>
            <option value="8">Surface Finishing</option>
            <option value="9">Electrical Testing & Inspection</option>
            <option value="10">PCB Cutting & Routing</option>
            <option value="11">Final Inspection & Packaging</option>
            <option value="12">Completed</option>
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
      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <ModalHeader>View Request Details</ModalHeader>
        <ModalBody>
          {/* Display request details */}
          <div className="flex flex-row">
            <p className="text-sm font-medium">Project ID: </p>
            <p className="ml-2">{rowDataToEdit?.project_id}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Project Name: </p>
            <p className="ml-2">{rowDataToEdit?.project_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Project Description: </p>
            <p className="ml-2">{rowDataToEdit?.project_description}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Faculty ID: </p>
            <p className="ml-2">{rowDataToEdit?.faculty_id}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Faculty Name: </p>
            <p className="ml-2">{rowDataToEdit?.faculty_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Department Name: </p>
            <p className="ml-2">{rowDataToEdit?.department}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Design Tool: </p>
            <p className="ml-2">{rowDataToEdit?.design_tool}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">No of Students: </p>
            <p className="ml-2">{rowDataToEdit?.no_of_students}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium mr-2">Urgency Level: </p>
            <p className="ml-2">{rowDataToEdit?.urgency_level}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Contact: </p>
            <p className="ml-2">{rowDataToEdit?.contact}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Design File: </p>
            <p className="ml-2">{rowDataToEdit?.design_file}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Technician ID: </p>
            <p className="ml-2">{rowDataToEdit?.techician_id}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Technician Name: </p>
            <p className="ml-2">{rowDataToEdit?.techician_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Manufacturing Budget: </p>
            <p className="ml-2">{rowDataToEdit?.manufacturing_budget}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Manufacturing Status: </p>
            <p className="ml-2">
              {rowDataToEdit?.status === "12" ? (
                <Badge type="success">Completed</Badge>
              ) : rowDataToEdit?.status === "1" ? (
                <Badge type="warning">On Progress</Badge>
              ) : rowDataToEdit?.status === "2" ? (
                <Badge type="warning">Material Preparation</Badge>
              ) : rowDataToEdit?.status === "3" ? (
                <Badge type="warning">Inner Layer Processing</Badge>
              ) : rowDataToEdit?.status === "4" ? (
                <Badge type="warning">Layer Lamination</Badge>
              ) : rowDataToEdit?.status === "5" ? (
                <Badge type="warning">Drilling & Plating</Badge>
              ) : rowDataToEdit?.status === "6" ? (
                <Badge type="warning">Outer Layer Processing</Badge>
              ) : rowDataToEdit?.status === "7" ? (
                <Badge type="warning">Solder Mask & Silkscreen Application</Badge>
              ) : rowDataToEdit?.status === "8" ? (
                <Badge type="warning">Surface Finishing</Badge>
              ) : rowDataToEdit?.status === "9" ? (
                <Badge type="warning">Electrical Testing & Inspection</Badge>
              ) : rowDataToEdit?.status === "10" ? (
                <Badge type="warning">PCB Cutting & Routing</Badge>
              ) : rowDataToEdit?.status === "11" ? (
                <Badge type="warning">Final Inspection & Packaging</Badge>
              ) : (
                <Badge type="warning">Pending</Badge>
              )}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            layout="link"
            className="bg-gray-600 text-white hover:bg-gray-700"
            onClick={() => setIsViewModalOpen(false)}
          >
            <p className="text-white">Close</p>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ProjectRequest;
