import React, { useState } from "react";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";

function ProjectRequestForm() {
  const [formData, setFormData] = useState({
    faculty_id: "",
    faculty_name: "",
    department: "",
    project_name: "",
    project_description: "",
    design_tool: "",
    no_of_students: "",
    urgency_level: "",
    contact: "",
    design_file: null,
    status: "Pending",
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    history.push("/app/view-request");
  };

  const handleCancel = () => {
    history.push("/app/view-request");
  };

  return (
    <>
      <PageTitle>Create a New Project Request</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label>
          <span>Faculty ID</span>
          <Input
            placeholder="CS1335"
            className="block w-full mt-1"
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Faculty Name</span>
          <Input
            placeholder="John Doe"
            className="block w-full mt-1"
            name="faculty_name"
            value={formData.faculty_name}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Department</span>
          <Input
            placeholder="Computer Science"
            className="block w-full mt-1"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Project Name</span>
          <Input
            placeholder="Project Name"
            className="block w-full mt-1"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Project Description</span>
          <Input
            placeholder="Project Description"
            className="block w-full mt-1"
            name="project_description"
            value={formData.project_description}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Design Tool</span>
          <Input
            placeholder="Figma"
            className="block w-full mt-1"
            name="design_tool"
            value={formData.design_tool}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Number of Students</span>
          <Input
            placeholder="5"
            className="block w-full mt-1"
            type="number"
            name="no_of_students"
            value={formData.no_of_students}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Urgency Level</span>
          <Select
            className="block w-full mt-1"
            name="urgency_level"
            value={formData.urgency_level}
            onChange={handleChange}
          >
            <option value="">Select Urgency</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Label>

        <Label className="mt-4">
          <span>Contact</span>
          <Input
            placeholder="9876543210"
            className="block w-full mt-1"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </Label>

        <Label className="mt-4">
          <span>Design File</span>
          <Input
            className="block w-full mt-1"
            type="file"
            name="design_file"
            onChange={handleFileChange}
          />
        </Label>

        <div className="flex mt-4">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button className="ml-4" layout="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}

export default ProjectRequestForm;
