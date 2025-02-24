import React, { useState } from "react";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import { FaUser } from "react-icons/fa";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";

function Addnewmapping() {
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    technician_id: "",
    technician_name: "",
  });
  const history = useHistory();

  const projectids = ["P1001", "P1002", "P1003", "P1004"];
  const projectnames = ["Project 1", "Project 2", "Project 3", "Project 4"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    history.push("/app/track-request");
  };

  const handleCancel = () => {
    history.push("/app/track-request");
  };

  return (
    <>
      <PageTitle>Map Project to Technician for Manufacturing</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Project ID Selection */}
        <Label>
          <span>Project ID</span>
          <Select
            className="block w-full mt-1"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
          >
            <option value="">Select Project ID</option>
            {projectids.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </Select>
        </Label>

        {/* Project Name Selection */}
        <Label className="mt-4">
          <span>Project Name</span>
          <Select
            className="block w-full mt-1"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
          >
            <option value="">Select Project Name</option>
            {projectnames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Label>

        {/* Technician ID */}
        <Label className="mt-4">
          <span>Technician ID</span>
          <Input
            className="block w-full mt-1"
            placeholder="TECh124"
            name="technician_id"
            value={formData.technician_id}
            onChange={handleChange}
          />
        </Label>

        {/* Technician Name */}
        <Label className="mt-4">
          <span>Technician Name</span>
          <Input
            className="block w-full mt-1"
            placeholder="Rajesh"
            name="technician_name"
            value={formData.technician_name}
            onChange={handleChange}
          />
        </Label>

        {/* Buttons */}
        <div className="mt-4 flex">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button className="ml-4" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}

export default Addnewmapping;
