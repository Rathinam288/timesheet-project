import React from 'react';
import { useParams } from 'react-router-dom';
import { companies } from '../overallclient/Overallclient'; 

const ProjectPage = () => {
  const { status } = useParams(); 

  const normalizedStatus = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();

  const filteredProjects = companies.filter(
    (company) => company.status === normalizedStatus
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>{normalizedStatus} Projects</h2>
      {filteredProjects.length === 0 ? (
        <p>No projects found for this status.</p>
      ) : (
        filteredProjects.map((project) => (
          <div key={project.clientId} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
            <h3>{project.projectName}</h3>
            <p><strong>Client:</strong> {project.clientName}</p>
            <p><strong>Description:</strong> {project.projectDescription}</p>
            <p><strong>Status:</strong> {project.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectPage;
