import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const endpoint = user && user.role === "Employer"
          ? "http://localhost:4000/api/v1/application/employer/getall"
          : "http://localhost:4000/api/v1/application/jobseeker/getall";
        
        const { data } = await axios.get(endpoint, {
          withCredentials: true,
        });

        setApplications(data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    };

    fetchApplications();
  }, [isAuthorized, user]);

  if (!isAuthorized) {
    navigateTo("/");
    return null;
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <center>
            <h1>My Applications</h1>
          </center>
          {applications.length <= 0 ? (
            <center><h4>No Applications Found</h4></center>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                key={element._id}
                element={element}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <center>
            <h1>Applications From Job Seekers</h1>
          </center>
          {applications.length <= 0 ? (
            <center><h4>No Applications Found</h4></center>
          ) : (
            applications.map((element) => (
              <EmployerCard
                key={element._id}
                element={element}
                openModal={openModal}
              />
            ))
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>
      <div className="resume">
        {element.resume && element.resume.url ? (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        ) : (
          <p>No resume available</p>
        )}
      </div>
      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>
      <div className="resume">
        {element.resume && element.resume.url ? (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        ) : (
          <p>No resume available</p>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
