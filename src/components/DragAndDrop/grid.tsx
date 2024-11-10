// components/GridSnappingImages.js

import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Constants
const GRID_SIZE = 100; // Size of each grid cell
const images = [
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/icon-512-maskable.png",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/groovy-dev.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/narkins.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/otherdev.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/wish-phones.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/groovy-layers.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/tinyfootprintcoffee.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/neubees.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/ekqadamaur.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/web-design.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/branding.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/web-developmet.webp",
  "https://cdn.jsdelivr.net/gh/kabeer11000/docs-hosted@redirector-content/theotherdev/new-web/ads.webp",
];

// Utility function to snap to grid
const snapToGrid = (x, y) => {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
  return [snappedX, snappedY];
};

// Draggable Image component
const DraggableImage = ({ src, id, position, moveImage }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: { id, position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const newX = item.position.x + delta.x;
      const newY = item.position.y + delta.y;
      const [snappedX, snappedY] = snapToGrid(newX, newY);
      moveImage(item.id, snappedX, snappedY);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))} className='border'
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        width: GRID_SIZE,
        height: GRID_SIZE,
        opacity: isDragging ? 0.5 : 1,
        background: isOver ? 'rgba(0, 150, 255, 0.3)' : 'transparent',
        transition: 'top 0.2s, left 0.2s',
        cursor: 'move',
      }}
    >
      <img src={src} alt="Grid Item" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// Main Grid Snapping Images component
const GridSnappingImages = () => {
  const initialPositions = images.map((_, index) => ({
    x: (index % 4) * GRID_SIZE,
    y: Math.floor(index / 4) * GRID_SIZE,
  }));
  const [positions, setPositions] = useState(initialPositions);

  const moveImage = (id, x, y) => {
    const updatedPositions = [...positions];
    updatedPositions[id] = { x, y };
    setPositions(updatedPositions);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{
        position: 'relative',
        width: '400px', // Adjust the width and height as needed
        height: '400px',
        border: '1px solid #ccc',
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, ${GRID_SIZE}px)`,
        gridAutoRows: `${GRID_SIZE}px`,
      }}>
        {images.map((src, index) => (
          <DraggableImage
            key={index}
            id={index}
            src={src}
            position={positions[index]}
            moveImage={moveImage}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default GridSnappingImages;
