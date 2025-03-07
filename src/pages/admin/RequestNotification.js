import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
} from "@windmill/react-ui";
import axios from "axios";

function NotificationModal({ isOpen, onClose, rowData }) {
  const [reason, setReason] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:8080/protected/send-rejection-mail",
        {
          project_id: rowData.req_id,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Notification sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Enter Notification Reason</ModalHeader>
      <ModalBody>
        <Label>
          <span>Reason</span>
          <Input
            className="mt-1"
            placeholder="Enter reason here..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Label>
      </ModalBody>
      <ModalFooter>
        <Button layout="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </ModalFooter>
    </Modal>
  );
}

export default NotificationModal;
