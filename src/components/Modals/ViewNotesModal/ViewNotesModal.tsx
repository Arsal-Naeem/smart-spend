"use client";
import React, { useState } from "react";
import { Button, Modal } from "antd";

interface NotesData {
  title: string;
  notes: string;
}

const ViewNotesButton: React.FC<NotesData> = ({ title, notes }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleView = () => {
    setModalVisible(true);
  };

  return (
    <>
      <p onClick={handleView}> View Notes </p>

      <Modal
        title={title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={500}
        centered
      >
        <div style={{ margin: "1rem 0" }}>
          <p style={{ whiteSpace: "pre-wrap" }}>{notes}</p>
        </div>
      </Modal>
    </>
  );
};

export default ViewNotesButton;
