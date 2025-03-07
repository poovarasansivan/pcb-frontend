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
import { Label } from "@windmill/react-ui";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { IoNotificationsOutline } from "react-icons/io5";
import NotificationModal from "./RequestNotification";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa6";

function ProjectRequest() {
  const [facultyRequests, setFacultyRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotificationModalOpen, setisNotificationModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);
  const [editedData, setEditedData] = useState({});
  const history = useHistory();
  const resultsPerPage = 8;
  const totalResults = facultyRequests.length||0;
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
    { label: "Status", key: "status" },
  ];
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/get-project-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data !== null) {
          setFacultyRequests(response.data);
          setFilteredData(response.data);
        } else {
          setFacultyRequests([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setFacultyRequests([]);
        setFilteredData([]);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    setFilteredData(
      facultyRequests.filter((request) => {
        const statusText =
          request.status === "1"
            ? "Approved"
            : request.status === "2"
            ? "Rejected"
            : "Pending";
        return facultyRequests.filter(
          (request) =>
            (request.req_id &&
              request.req_id
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
            (request.project_description &&
              request.project_description
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

  function openNotificationModal(rowData) {
    setRowDataToEdit(rowData);
    setisNotificationModalOpen(true);
  }
  const handleAddnew = () => {
    history.push("/app/add-new-request");
  };
  function closeDeleteModal() {
    setisNotificationModalOpen(false);
  }

  function handleUpdate() {
    const updatedRequests = facultyRequests.map((request) =>
      request.req_id === rowDataToEdit.req_id
        ? { ...request, ...editedData }
        : request
    );
    setFacultyRequests(updatedRequests);
    closeEditModal();
  }
  const handleFileUpload = async (event, req_id) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("UploadGerberFile", file);

    try {
      // Step 1: Upload file to server
      const uploadResponse = await axios.post(
        "http://localhost:8080/protected/upload-gerber-file",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 200) {
        const filename = uploadResponse.data.filename; // Get filename from response

        // Step 2: Update project with new filename
        await axios.put(
          "http://localhost:8080/protected/update-project-data",
          {
            req_id: req_id,
            design_file: filename,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update UI with new file
        const updatedRequests = facultyRequests.map((request) =>
          request.req_id === req_id
            ? { ...request, design_file: filename }
            : request
        );
        setFacultyRequests(updatedRequests);
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };


  function handlePageChange(p) {
    setPage(p);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  const handleRequestApproval = async (req_id, status) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/protected/update-project-request",
        {
          req_id: req_id,
          req_status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedRequests = facultyRequests.map((request) =>
          request.req_id === req_id ? { ...request, status: status } : request
        );
        setFacultyRequests(updatedRequests);
        setIsViewModalOpen(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const role = localStorage.getItem("role");

  return (
    <>
      <PageTitle>Project Request Details </PageTitle>

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
            {role==="3" && (
              <Button onClick={handleAddnew}>
              <CiCirclePlus size={24} className="mr-2 font-bold" />
              Add New
            </Button>
            )}
            {(role === "1" || role === "2") && (
              <CSVLink
                data={filteredData.map((request) => ({
                  ...request,
                  status:
                    request.status === "1"
                      ? "Approved"
                      : request.status === "2"
                      ? "Rejected"
                      : "Pending",
                }))}
                headers={headers}
                filename="Project-Requests.csv"
                className="ml-4"
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
              <TableCell>Request ID</TableCell>
              <TableCell>Faculty ID</TableCell>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Description</TableCell>
              <TableCell>Design Tool</TableCell>
              <TableCell>No. of Students</TableCell>
              <TableCell>Urgency Level</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Design</TableCell>
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
                  <TableCell>{request.req_id}</TableCell>
                  <TableCell>{request.faculty_id}</TableCell>
                  <TableCell>{request.faculty_name}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.project_name}</TableCell>
                  <TableCell>{request.project_description}</TableCell>
                  <TableCell>{request.design_tool}</TableCell>
                  <TableCell>{request.number_of_students}</TableCell>
                  <TableCell>{request.urgency_level}</TableCell>
                  <TableCell>{request.contact}</TableCell>
                  <TableCell>{request.design_file}</TableCell>
                  <TableCell>
                    {request.req_status === "1" ? (
                      <Badge type="success">Approved</Badge>
                    ) : request.req_status === "2" ? (
                      <Badge type="danger">Rejected</Badge>
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
                      {(request.req_status === "2" && role==="3") && (
                        <Button
                          layout="link"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => openEditModal(request)}
                        >
                          <EditIcon className="w-5 h-5" />
                        </Button>
                      )}
                      {role === "1" && (
                        <>
                          <Button
                            layout="link"
                            size="icon"
                            aria-label="Delete"
                            onClick={() => openNotificationModal(request)}
                          >
                            <IoNotificationsOutline className="w-5 h-5" />
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
          {/* Form Fields for Edit */}
          <Label>Design File</Label>
          <Input
            type="file"
            name="design_file"
            onChange={(e) => handleFileUpload(e, rowDataToEdit.req_id)}
          />
        </ModalBody>
        <ModalFooter>
          <Button layout="link" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      {isNotificationModalOpen && (
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={closeDeleteModal}
          rowData={rowDataToEdit}
        />
      )}

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <ModalHeader>View Request Details</ModalHeader>
        <ModalBody>
          {/* Display request details */}
          <div className="flex flex-row">
            <p className="text-sm font-medium">Project ID: </p>
            <p className="ml-2">{rowDataToEdit?.req_id}</p>
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
            <p className="text-sm font-medium">Project Name: </p>
            <p className="ml-2">{rowDataToEdit?.project_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Project Description: </p>
            <p className="ml-2">{rowDataToEdit?.project_description}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Design Tool: </p>
            <p className="ml-2">{rowDataToEdit?.design_tool}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">No of Students: </p>
            <p className="ml-2">{rowDataToEdit?.number_of_students}</p>
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

            {rowDataToEdit?.design_file && (
              <a
                href={`http://localhost:8080/serve-gerber-file/${rowDataToEdit.design_file}`}
                target="_blank"
                className="ml-2 text-blue-500 underline"
              >
                View Gerber
              </a>
            )}
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Status: </p>
            <p className="ml-2">
              {rowDataToEdit?.req_status === "1" ? (
                <Badge type="success">Approved</Badge>
              ) : rowDataToEdit?.req_status === "2" ? (
                <Badge type="danger">Rejected</Badge>
              ) : (
                <Badge type="warning">Pending</Badge>
              )}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          {role === "1" && (
            <>
              <Button
                layout="link"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => handleRequestApproval(rowDataToEdit.req_id, "1")}
              >
                <p className="text-white">Approve</p>
              </Button>
              <Button
                layout="link"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleRequestApproval(rowDataToEdit.req_id, "2")}
              >
                <p className="text-white">Reject</p>
              </Button>
            </>
          )}

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
