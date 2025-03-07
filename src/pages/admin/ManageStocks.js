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

function ManageStocks() {
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
  const totalResults = facultyRequests.length||0;

  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchissues = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/get-stocks",
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
    fetchissues();
  }, []);

  useEffect(() => {
    setFilteredData(
      facultyRequests.filter(
        (request) =>
          (request.stock_id &&
            request.stock_id
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.stock_name &&
            request.stock_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.category &&
            request.category
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.initial_stocks &&
            request.initial_stocks
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.current_stocks &&
            request.current_stocks.toLowerCase().includes(searchTerm.toLowerCase())) 
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
    history.push("/app/add-new-stock");
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
      (request) => request.stock_id !== rowDataToEdit.stock_id
    );
    setFacultyRequests(updatedRequests);
    closeDeleteModal();
  }

  const handleUpdate = async () => {
    if (!rowDataToEdit) return;
    const UpdatedData = {
      stock_id: rowDataToEdit.stock_id,
      initial_stocks: parseInt(editedData.initial_stocks),
    };
    console.log(UpdatedData);
    try {
      const response = await axios.put(
        "http://localhost:8080/protected/update-stock",
        UpdatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
        closeEditModal();
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
    { label: "Stock ID", key: "stock_id" },
    { label: "Stock Name", key: "stock_name" },
    { label: "Category", key: "category" },
    { label: "Initial Stocks", key: "initial_stocks" },
    { label: "Balance Stocks", key: "current_stocks" },
  ]

  return (
    <>
      <PageTitle>Stock Management </PageTitle>
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
            <Button onClick={handleAddnew} className="mr-4">
              <CiCirclePlus size={24} className="mr-2 font-bold" />
              Add New
            </Button>
            <CSVLink
            data={filteredData}
            headers={headers}
            filename="Stocks_Data.csv"
            >
            <Button size="large">
                <FaDownload size={20} className="mr-2" /> Export
              </Button>
            </CSVLink>
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S No</TableCell>
              <TableCell>Stock ID</TableCell>
              <TableCell>Stock Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Initial Stock</TableCell>
              <TableCell>Balance Stock</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredData
              .slice((page - 1) * resultsPerPage, page * resultsPerPage)
              .map((request, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.stock_id}</TableCell>
                  <TableCell>{request.stock_name}</TableCell>
                  <TableCell>{request.category}</TableCell>
                  <TableCell>{request.initial_stocks}</TableCell>
                  <TableCell>{request.current_stocks}</TableCell>
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
        <ModalHeader>Update Stock</ModalHeader>
        <ModalBody>
          <Label className="mb-2">No of Quantity</Label>
          <Input
            name="initial_stocks"
            placeholder="10"
            value={editedData.initial_stocks || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, initial_stocks: e.target.value })
            }
            className="mb-4"
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
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>Are you sure you want to delete this stock?</ModalBody>
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
            <p className="text-sm font-medium">Stock ID: </p>
            <p className="ml-2">{rowDataToEdit?.stock_id}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Stock Name: </p>
            <p className="ml-2">{rowDataToEdit?.stock_name}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Category: </p>
            <p className="ml-2">{rowDataToEdit?.category}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Initial Stock: </p>
            <p className="ml-2">{rowDataToEdit?.initial_stocks}</p>
          </div>
          <div className="flex flex-row">
            <p className="text-sm font-medium">Balance Stock: </p>
            <p className="ml-2">{rowDataToEdit?.current_stocks}</p>
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

export default ManageStocks;
