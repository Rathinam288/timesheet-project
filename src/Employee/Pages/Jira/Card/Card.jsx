import React from "react";
import { Draggable } from "react-beautiful-dnd";
import "./Card.css";

const Card = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="jira-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
        >
          <div className="jira-card-title">{task.title}</div>

          <div className="jira-card-meta">
            <span className="jira-pill">📅 {task.date}</span>
            <span className="jira-pill">👤 {task.assignee}</span>
          </div>

          <div className="jira-card-key">{task.id}</div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
