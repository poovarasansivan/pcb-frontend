import React, { useState } from "react";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";
import axios from "axios";

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



  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        "http://localhost:8080/protected/add-new-project-request",
        {
          faculty_id: formData.faculty_id,
          faculty_name: formData.faculty_name,
          department: formData.department,
          project_name: formData.project_name,
          project_description: formData.project_description,
          design_tool: formData.design_tool,
          no_of_students: parseInt(formData.no_of_students),
          urgency_level: formData.urgency_level,
          contact: formData.contact,
          design_file: formData.design_file,  // This should be the uploaded filename
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Response:", response.data);
      history.push("/app/view-request");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
    }
  };
  

  const handleCancel = () => {
    history.push("/app/view-request");
  };

  const handlegerberFileChange = async (e) => {
    const { files } = e.target;
    const file = files[0];
    const token = localStorage.getItem("token");
  
    if (file) {
      const fileData = new FormData();
      fileData.append("UploadGerberFile", file);
  
      try {
        const uploadResponse = await axios.post(
          "http://localhost:8080/protected/upload-gerber-file",
          fileData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (uploadResponse.status !== 200) {
          throw new Error("Failed to upload file");
        }
  
        const { filename } = uploadResponse.data; // Expecting backend to return { filename: "uploaded_file_name" }
        console.log("Uploaded filename:", filename);
  
        setFormData((prevData) => ({
          ...prevData,
          design_file: filename, // Store only filename, not the full file object
        }));
      } catch (error) {
        console.error("File upload error:", error);
      }
    }
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
            onChange={handlegerberFileChange}
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
