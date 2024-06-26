import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const RestoreScreen = () => {
  const [optionList, setOptionList] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedItem, setSelectedItem] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoader, setListLoader] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("https://firestore-backend.up.railway.app/files", {
        params: { token },
      })
      .then((res) => {
        setListLoader(false);

        const array = [];
        for (let elem of res.data.files.reverse()) {
          const obj = {
            label: `${elem.fileName}`,
            value: `${elem.fileName}`,
            restoreFileName: elem.fileUrlPart,
          };
          array.push(obj);
        }
        setOptionList(array);
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        alert("Authentication Error");
        navigate("/");
      });
  }, []);
  const handleRestore = () => {
    if (selectedItem) {
      const name = selectedItem.restoreFileName;
      console.log(selectedItem);
      // const name = selectedItem.value.slice(0, -4);
      axios
        .post("https://firestore-backend.up.railway.app/restore", {
          token,
          name,
        })
        .then((res) => {
          setLoading(false);
          setModalVisibility(true);
          setSelectedItem("");
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
          alert("Authentication Error");
          navigate("/");
        });
    }
  };

  return (
    <div className="container-fluid h-100">
      <div className="outer-box row h-100">
        <Sidebar />
        <div className=" d-flex flex-column align-items-center col-9">
          <div className="d-flex w-100 h-25 justify-content-center align-items-center mt-5 gap-3 ">
            <label style={{ color: "black", fontSize: "18px" }}>
              Choose a backup:
            </label>
            <Select
              className="w-50"
              options={listLoader ? [{ label: "Loading..." }] : optionList}
              placeholder="Select Backup"
              onChange={(item) => setSelectedItem(item)}
              value={selectedItem}
              isSearchable={true}
            />
          </div>
          <button
            className="button"
            onClick={handleRestore}
            disabled={loading ? true : false}
          >
            {loading ? "Loading..." : "Restore"}
          </button>
        </div>
        <Modal show={modalVisibility} onHide={() => setModalVisibility(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "green" }}>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Backup restored Successfully</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalVisibility(false)}
            >
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default RestoreScreen;
