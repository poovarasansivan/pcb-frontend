import React, { useEffect, useState } from "react";
import { Input, Label, Button, Select } from "@windmill/react-ui";
import PageTitle from "../../components/Typography/PageTitle";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Addnewmapping() {
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    technician_id: "",
    technician_name: "",
  });
  const history = useHistory();
  const [projectids, setProjectIds] = useState([]);
  const [projectnames, setProjectNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjectIds = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/get-project-ids",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjectIds(response.data.req_id || []); // Fallback to empty array if undefined
      } catch (error) {
        console.error("Error fetching project IDs:", error);
        setError("Failed to load project IDs.");
      }
    };

    const fetchProjectNames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/protected/get-project-names",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjectNames(response.data.project_name ); // Fallback to empty array if undefined
      } catch (error) {
        console.error("Error fetching project names:", error);
        setError("Failed to load project names.");
      }
    };

    Promise.all([fetchProjectIds(), fetchProjectNames()]).finally(() =>
      setLoading(false)
    );
  }, []);

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

    try {
      await axios.post(
        "http://localhost:8080/protected/add-new-manufacturing-request",
        {
          project_id: formData.project_id,
          project_name: formData.project_name,
          technician_id: formData.technician_id,
          technician_name: formData.technician_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      history.push("/app/track-request");
    } catch (error) {
      console.log("Error submitting data:", error);
      setError("Failed to submit the form.");
    }
  };

  const handleCancel = () => {
    history.push("/app/track-request");
  };

  return (
    <>
      <PageTitle>Map Project to Technician for Manufacturing</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
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
                {projectids.length > 0 ? (
                  projectids.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))
                ) : (
                  <option disabled>No Projects Available</option>
                )}
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
                {projectnames.length > 0 ? (
                  projectnames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Project Names Available</option>
                )}
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
          </>
        )}
      </div>
    </>
  );
}

export default Addnewmapping;
