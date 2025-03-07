import React, { useState } from "react";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import { FaUser } from "react-icons/fa";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Addnewusers() {
  const [formData, setFormData] = useState({
    stock_name: "",
    category: "",
    initial_stock: "",
  });
  const history = useHistory();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const token = localStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/protected/add-new-stock",
        {
          stock_name: formData.stock_name,
          category: formData.category,
          initial_stocks: formData.initial_stock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      history.push("/app/manage-stocks");
    } catch (error) {
      console.log("Error adding new issue:", error);
    }
  };

  const handleCancel = () => {
    history.push("/app/manage-stocks");
  };

  return (
    <>
      <PageTitle>Create a New Stock</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Stock Name</span>
          <Input
            className="block w-full mt-1"
            placeholder="PCB"
            name="stock_name"
            value={formData.stock_name}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Category</span>
          <Input
            className="block w-full mt-1"
            placeholder="Fiber"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Quantity</span>
          <Input
            className="block w-full mt-1"
            type="number"
            placeholder="10"
            name="initial_stock"
            value={formData.initial_stock}
            onChange={handleChange}
          />
        </Label>
        <Button className="mt-4" onClick={handleSubmit}>
          Submit
        </Button>
        <Button className="ml-4" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export default Addnewusers;
