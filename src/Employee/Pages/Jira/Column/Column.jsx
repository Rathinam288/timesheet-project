import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Card from "../../Jira/Card/Card";
import "./Column.css";

const Column = ({ column, tasks, onTaskClick }) => {
  return (
    <div className="jira-column">
      <div className="jira-column-header">
        <span>{column.title}</span>
        <span className="jira-count">{tasks.length}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="jira-column-body"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Card
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}

            {column.id === "todo" && (
              <button className="jira-create">+ Create</button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
