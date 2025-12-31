// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import "./JiraKanban.css";

// const initialData = {
//   columns: {
//     "todo": {
//       name: "TO DO",
//       items: [
//         { id: "1", title: "Task 1", key: "KAN-1", assignee: "Unassigned", date: "Jan 3, 2026" },
//       ]
//     },
//     "inprogress": {
//       name: "IN PROGRESS",
//       items: [
//         { id: "2", title: "Task 2", key: "KAN-2", assignee: "John Doe", date: "Jan 8, 2026" },
//       ]
//     },
//     "inreview": {
//       name: "IN REVIEW",
//       items: []
//     },
//     "done": {
//       name: "DONE",
//       items: []
//     }
//   }
// };

// const JiraKanban = () => {
//   const [columns, setColumns] = useState(initialData.columns);

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceColumn = columns[source.droppableId];
//     const destColumn = columns[destination.droppableId];
//     const sourceItems = [...sourceColumn.items];
//     const [removed] = sourceItems.splice(source.index, 1);

//     if (source.droppableId === destination.droppableId) {
//       sourceItems.splice(destination.index, 0, removed);
//       setColumns({
//         ...columns,
//         [source.droppableId]: { ...sourceColumn, items: sourceItems },
//       });
//     } else {
//       const destItems = [...destColumn.items];
//       destItems.splice(destination.index, 0, removed);
//       setColumns({
//         ...columns,
//         [source.droppableId]: { ...sourceColumn, items: sourceItems },
//         [destination.droppableId]: { ...destColumn, items: destItems },
//       });
//     }
//   };

//   const addCard = (columnId) => {
//     const title = window.prompt("Task title:");
//     if (!title) return;
//     const newItem = { id: Date.now().toString(), title, key: `KAN-${Math.floor(100 + Math.random() * 900)}`, assignee: "Unassigned", date: new Date().toDateString() };
//     setColumns({
//       ...columns,
//       [columnId]: {
//         ...columns[columnId],
//         items: [...columns[columnId].items, newItem],
//       }
//     });
//   };

//   return (
//     <div className="kanban-container">
//       <DragDropContext onDragEnd={onDragEnd}>
//         {Object.entries(columns).map(([id, column]) => (
//           <div key={id} className="kanban-column">
//             <div className="kanban-column-header">
//               {column.name} {column.items.length > 0 && <span className="count">{column.items.length}</span>}
//             </div>
//             <Droppable droppableId={id}>
//               {(provided) => (
//                 <div className="kanban-column-body" ref={provided.innerRef} {...provided.droppableProps}>
//                   {column.items.map((item, index) => (
//                     <Draggable key={item.id} draggableId={item.id} index={index}>
//                       {(provided, snapshot) => (
//                         <div
//                           className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                         >
//                           <div className="card-title">{item.title}</div>
//                           <div className="card-sub">{item.date}</div>
//                           <div className="card-key">{item.key}</div>
//                           <div className="card-assignee">{item.assignee}</div>
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//             <button className="add-card" onClick={() => addCard(id)}>+ Create</button>
//           </div>
//         ))}
//       </DragDropContext>
//     </div>
//   );
// };

// export default JiraKanban;


import React from 'react';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import Board from './Board/Board';
import './Jira.css';

function Jira() {
  return (
    <div className="jira-app">
      <Header />
      <div className="jira-main">
        <Sidebar />
        <Board />
      </div>
    </div>
  );
}

export default Jira;