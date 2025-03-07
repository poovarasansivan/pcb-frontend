import React, { useState,useEffect } from "react";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import { FaUser } from "react-icons/fa";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Addnewusers() {
  const [formData, setFormData] = useState({
    facultyid: "",
    facultyname: "",
    department: "",
    email: "",
    role: "",
  });
  const history = useHistory();

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
    try{
      const response = await axios.post("http://localhost:8080/protected/add-new-users", {
        user_id: formData.facultyid,
        user_name: formData.facultyname,
        email: formData.email,
        department: formData.department,
        role: formData.user_role,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      history.push("/app/manage-users");
    } catch(error){
      console.log("Error", error);
    }
  };


  const handleCancel = () => {
    history.push("/app/manage-users");
  };

  
  return (
    <>
      <PageTitle>Create a New User</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>User ID</span>
          <Input
            className="block w-full mt-1"
            placeholder="User ID"
            name="facultyid"
            value={formData.facultyid}
            onChange={handleChange}
            icon={FaUser}
          />
        </Label>

        {/* Faculty Name */}
        <Label className="mt-4">
          <span>User Name</span>
          <Input
            className="block w-full mt-1"
            placeholder="User Name"
            name="facultyname"
            value={formData.facultyname}
            onChange={handleChange}
            icon={FaUser}
          />
        </Label>

        <Label className="mt-4">
          <span>Email</span>
          <Input
            className="block w-full mt-1"
            placeholder="abc@gmail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Label>
        <Label className="mt-4">
          <span>Department</span>
          <Input
            className="block w-full mt-1"
            placeholder="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </Label>
        <Label className="mt-4">
          <span>Role</span>
          <Select
            className="block w-full mt-1"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="1">Admin</option>
            <option value="2">Faculty</option>
            <option value="3">Technician</option>
          </Select>
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
