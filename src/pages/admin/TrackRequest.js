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
import { IoMdEye } from "react-icons/io";
import { EditIcon, TrashIcon } from "../../icons";
import PageTitle from "../../components/Typography/PageTitle";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useHistory } from "react-router-dom";

const manufacturingrequest = [
  {
    project_id: "PCBR-001",
    project_name: "Automated Attendance System",
    project_description:
      "This project aims to automate the attendance system of the university",
    faculty_id: "FAC-001",
    faculty_name: "Dr. John Doe",
    department: "Computer Science",
    design_tool: "Arduino",
    no_of_students: "5",
    urgency_level: "High",
    contact: "faculty@gmail.com",
    design_file: "file.pdf",
    technician_id: "TECH-001",
    technician_name: "Mr. Technician",
    manufacturing_status: "0",
  },
];

function ProjectRequest() {
  const [facultyRequests, setFacultyRequests] = useState(manufacturingrequest);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);
  const [editedData, setEditedData] = useState({});
  const history = useHistory();
  const resultsPerPage = 8;
  const totalResults = facultyRequests.length;

  const [page, setPage] = useState(1);

  useEffect(() => {
    setFilteredData(
      facultyRequests.filter((request) => {
        const statusText =
          request.status === "1"
            ? "On Progress"
            : request.status === "2"
            ? "Completed"
            : "Pending";
        return facultyRequests.filter(
          (request) =>
            (request.project_id &&
              request.project_id
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.project_description &&
              request.project_description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.faculty_id &&
              request.faculty_id
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.faculty_name &&
              request.faculty_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.department &&
              request.department
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.project_name &&
              request.project_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.design_file &&
              request.design_file
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.urgency_level &&
              request.urgency_level
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.contact &&
              request.contact
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (request.design_tool &&
              request.design_tool
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
            statusText.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [searchTerm, facultyRequests]);

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

  function handleUpdate() {
    const updatedRequests = facultyRequests.map((request) =>
      request.project_id === rowDataToEdit.project_id
        ? { ...request, ...editedData }
        : request
    );
    setFacultyRequests(updatedRequests);
    closeEditModal();
  }

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

  const handleRequestApproval = async (project_id, manufacturing_status) => {
    console.log(project_id, manufacturing_status);
  };

  return (
    <>
      <PageTitle>Track Project Manufacturing  </PageTitle>

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
            <Button onClick={handleAddnew}>
              <CiCirclePlus size={24} className="mr-2 font-bold" />
              Add New
            </Button>
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
                  <TableCell>{request.technician_id}</TableCell>
                  <TableCell>{request.technician_name}</TableCell>
                  <TableCell>
                    {request.manufacturing_status === "1" ? (
                      <Badge type="danger">On Progress</Badge>
                    ) : request.status === "2" ? (
                      <Badge type="success">Completed</Badge>
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
            <p className="ml-2">{rowDataToEdit?.technician_id}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Technician Name: </p>
            <p className="ml-2">{rowDataToEdit?.technician_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Manufacturing Status: </p>
            <p className="ml-2">
              {rowDataToEdit?.manufacturing_status === "2" ? (
                <Badge type="success">Completed</Badge>
              ) : rowDataToEdit?.manufacturing_status === "1" ? (
                <Badge type="danger">On Progress</Badge>
              ) : (
                <Badge type="warning">Pending</Badge>
              )}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <>
            <Button
              layout="link"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() =>
                handleRequestApproval(rowDataToEdit.project_id, "1")
              }
            >
              <p className="text-white">Approve</p>
            </Button>
            <Button
              layout="link"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() =>
                handleRequestApproval(rowDataToEdit.project_id, "2")
              }
            >
              <p className="text-white">Reject</p>
            </Button>
          </>

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
