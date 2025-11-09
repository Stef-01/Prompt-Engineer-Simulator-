export type AABB = {
  min: [number, number, number];
  max: [number, number, number];
};

export const createAABB = (center: [number, number, number], halfSize: [number, number, number]): AABB => {
  const [cx, cy, cz] = center;
  const [hx, hy, hz] = halfSize;
  return {
    min: [cx - hx, cy - hy, cz - hz],
    max: [cx + hx, cy + hy, cz + hz],
  };
};

export const isPointInsideAABB = (point: [number, number, number], box: AABB): boolean => {
  return (
    point[0] >= box.min[0] &&
    point[0] <= box.max[0] &&
    point[1] >= box.min[1] &&
    point[1] <= box.max[1] &&
    point[2] >= box.min[2] &&
    point[2] <= box.max[2]
  );
};

export const aabbOverlap = (a: AABB, b: AABB): boolean => {
  return (
    a.min[0] <= b.max[0] &&
    a.max[0] >= b.min[0] &&
    a.min[1] <= b.max[1] &&
    a.max[1] >= b.min[1] &&
    a.min[2] <= b.max[2] &&
    a.max[2] >= b.min[2]
  );
};

export const clampToBounds = (
  position: [number, number, number],
  bounds: AABB
): [number, number, number] => {
  const [x, y, z] = position;
  return [
    Math.min(bounds.max[0], Math.max(bounds.min[0], x)),
    Math.min(bounds.max[1], Math.max(bounds.min[1], y)),
    Math.min(bounds.max[2], Math.max(bounds.min[2], z)),
  ];
};
