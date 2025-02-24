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

const users = [
  {
    faculty_id: "F1001",
    faculty_name: "Dr. John Doe",
    department: "CSE",
    email: "poovarasan.cs@bitsathy.ac.in",
    role: "1",
  },
];

function FacultyRequestTable() {
  const [facultyRequests, setFacultyRequests] = useState(users);
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
          (request.faculty_id &&
            request.faculty_id
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.faculty_name &&
            request.faculty_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.email &&
            request.email
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))  ||
          (request.role &&
            request.role.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, facultyRequests]);

  function openEditModal(rowData) {
    setRowDataToEdit(rowData);
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
    history.push("/app/add-users");
  };
  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function handleDelete() {
    const updatedRequests = facultyRequests.filter(
      (request) => request.faculty_id !== rowDataToEdit.faculty_id
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
      <PageTitle>Users Management </PageTitle>

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
              <TableCell>Faculty ID</TableCell>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredData
              .slice((page - 1) * resultsPerPage, page * resultsPerPage)
              .map((request, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.faculty_id}</TableCell>
                  <TableCell>{request.faculty_name}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>
                    {request.role === "1" ? (
                      <span>Admin</span>
                    ) : request.role === "2" ? (
                      <span>Faculty</span>
                    ) : (
                      <span>User</span>
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
          <Label>Role</Label>
          <Select
            name="role"
            value={editedData.role || rowDataToEdit?.role}
            onChange={(e) =>
              setEditedData({ ...editedData, role: e.target.value })
            }
          >
            <option value="1">Admin</option>
            <option value="2">Faculty</option>
            <option value="3">User</option>
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

export default FacultyRequestTable;