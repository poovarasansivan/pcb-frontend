import React, { useState } from "react";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import { FaUser } from "react-icons/fa";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Addnewusers() {
  const [formData, setFormData] = useState({
    projectid: "",
    projectname: "",
    technicianid: "",
    technicianname: "",
    issues: "",
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
          "http://localhost:8080/protected/add-issues",
          {
            project_id: formData.projectid,
            project_name: formData.projectname,
            technician_id: formData.technicianid,
            technician_name: formData.technicianname,
            issues: formData.issues,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        history.push("/app/view-issues");
    } catch (error) {
      console.log("Error adding new issue:", error);
    }
  };

  const handleCancel = () => {
    history.push("/app/view-issues");
  };

  return (
    <>
      <PageTitle>Create a New Issue</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Project ID</span>
          <Input
            className="block w-full mt-1"
            placeholder="P001"
            name="projectid"
            value={formData.projectid}
            onChange={handleChange}
          />
        </Label>

        {/* Faculty Name */}
        <Label className="mt-4">
          <span>Project Name</span>
          <Input
            className="block w-full mt-1"
            placeholder="Project Name"
            name="projectname"
            value={formData.projectname}
            onChange={handleChange}
            icon={FaUser}
          />
        </Label>

        {/* Department */}
        <Label className="mt-4">
          <span>Technician ID</span>
          <Input
            className="block w-full mt-1"
            placeholder="T001"
            name="technicianid"
            value={formData.technicianid}
            onChange={handleChange}
          />
        </Label>
        <Label className="mt-4">
          <span>Technician Name</span>
          <Input
            className="block w-full mt-1"
            placeholder="Technician Name"
            name="technicianname"
            value={formData.technicianname}
            onChange={handleChange}
          />
        </Label>
        <Label className="mt-4">
          <span>Issue</span>
          <Input
            className="block w-full mt-1"
            placeholder="Manufacturing Issues"
            name="issues"
            value={formData.issues}
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
