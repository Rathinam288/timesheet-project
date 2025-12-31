import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "../../Jira/Column/Column";
import TaskModal from "../../Jira/TaskModel/TaskModel";
import { initialData } from "../../Jira/Data/Data";
import "./Board.css";

const Board = () => {
  const [data, setData] = useState(initialData);
  const [activeTask, setActiveTask] = useState(null);

  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const items = Array.from(start.taskIds);
      items.splice(source.index, 1);
      items.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        columns: {
          ...data.columns,
          [start.id]: { ...start, taskIds: items },
        },
      });
      return;
    }

    const startIds = Array.from(start.taskIds);
    startIds.splice(source.index, 1);

    const finishIds = Array.from(finish.taskIds);
    finishIds.splice(destination.index, 0, draggableId);

    setData({
      ...data,
      columns: {
        ...data.columns,
        [start.id]: { ...start, taskIds: startIds },
        [finish.id]: { ...finish, taskIds: finishIds },
      },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="jira-board">
        {data.columnOrder.map((colId) => {
          const column = data.columns[colId];
          const tasks = column.taskIds.map((id) => data.tasks[id]);

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              onTaskClick={(task) => setActiveTask(task)}
            />
          );
        })}
      </div>

      {activeTask && (
        <TaskModal task={activeTask} onClose={() => setActiveTask(null)} />
      )}
    </DragDropContext>
  );
};

export default Board;
