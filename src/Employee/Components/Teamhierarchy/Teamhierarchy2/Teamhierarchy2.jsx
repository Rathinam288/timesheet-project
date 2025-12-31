import React from 'react';
import ReactFlow, {
  Background,
  ReactFlowProvider,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: (props) => {
    const { data } = props;
    return (
      <div style={{
        borderRadius: '16px',
        padding: '10px 15px',
        backgroundColor: data.bg || '#888',
        color: 'white',
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'default'
      }}>
        <img
          src={data.img}
          alt="profile"
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            marginRight: 12,
            objectFit: 'cover',
            cursor: 'default'
          }}
        />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 13 }}>{data.role}</div>
          <div style={{ fontSize: 12 }}>{data.name}</div>
        </div>
        <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
        <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      </div>
    );
  }
};

const nodes = [
  { id: '1', type: 'custom', position: { x: 265, y: 0 }, data: { role: 'CEO', name: 'Sorim', img: 'https://randomuser.me/api/portraits/men/10.jpg', bg: '#007bff' } },
  { id: '2', type: 'custom', position: { x: 100, y: 130 }, data: { role: 'Manager 1', name: 'Rama', img: 'https://randomuser.me/api/portraits/men/11.jpg', bg: '#17a2b8' } },
  { id: '3', type: 'custom', position: { x: 400, y: 130 }, data: { role: 'Manager 2', name: 'Senthil Palani', img: 'https://randomuser.me/api/portraits/men/13.jpg', bg: '#17a2b8' } },
  { id: '4', type: 'custom', position: { x: 245, y: 260 }, data: { role: 'HR Manager', name: 'Abinaya', img: 'https://randomuser.me/api/portraits/men/14.jpg', bg: '#fd7e14' } },
  { id: '5', type: 'custom', position: { x: -7, y: 390 }, data: { role: 'Front End Developer', name: 'Hareesh', img: 'https://randomuser.me/api/portraits/men/17.jpg', bg: '#dc3545' } },
  { id: '6', type: 'custom', position: { x: 221, y: 390 }, data: { role: 'Back End Developer', name: 'Kaviarasi', img: 'https://randomuser.me/api/portraits/men/18.jpg', bg: '#dc3545' } },
  { id: '7', type: 'custom', position: { x: 446, y: 390 }, data: { role: 'Full Stack Developer', name: 'Ponnusamy', img: 'https://randomuser.me/api/portraits/men/19.jpg', bg: '#dc3545' } }
];

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e4-6', source: '4', target: '6' },
  { id: 'e4-7', source: '4', target: '7' }
];

function Teamhierarchy2() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#f3f4f6' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={true}
          panOnScroll={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          defaultViewport={{ x: 200, y: 0, zoom: 1 }}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e0e0e0" gap={12} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default Teamhierarchy2;