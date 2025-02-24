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

const issues = [
  {
    project_id: "P1001",
    project_name: "Project 1",
    technician_id: "T1001",
    technician_name: "John Doe",
    issues: "Issues",
    solution: "Solution",
    issue_status: "0",
  },
  {
    project_id: "P1002",
    project_name: "Project 2",
    technician_id: "T1002",
    technician_name: "John Doe",
    issues: "Issues 2",
    solution: "Solution 2",
    issue_status: "0",
  },
];

function IssuesTracking() {
  const [facultyRequests, setFacultyRequests] = useState(issues);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);
  const [editedData, setEditedData] = useState({});
  const history = useHistory();

  const resultsPerPage = 8;
  const totalResults = facultyRequests.length;

  const [page, setPage] = useState(1);

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

  function handleDelete() {
    const updatedRequests = facultyRequests.filter(
      (request) => request.project_id !== rowDataToEdit.project_id
    );
    setFacultyRequests(updatedRequests);
    closeDeleteModal();
  }

  const handleUpdate = async () => {
    console.log("Updated");
    setIsEditModalOpen(false);
  };

  function handlePageChange(p) {
    setPage(p);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

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
                  <TableCell>{request.project_id}</TableCell>
                  <TableCell>{request.project_name}</TableCell>
                  <TableCell>{request.technician_id}</TableCell>
                  <TableCell>{request.technician_name}</TableCell>
                  <TableCell>{request.issues}</TableCell>
                  <TableCell>{request.solution}</TableCell>
                  <TableCell>
                    {request.issue_status === "1" ? (
                      <Badge type="danger">On Progress</Badge>
                    ) : request.issue_status === "2" ? (
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
            value={editedData.issue_status || rowDataToEdit?.issue_status}
            onChange={(e) =>
              setEditedData({ ...editedData, issue_status: e.target.value })
            }
          >
            <option value="1">Closed</option>
            <option value="2">Not Closed</option>
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
    </>
  );
}

export default IssuesTracking;
