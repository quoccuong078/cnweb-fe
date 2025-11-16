// components/Editor/SortableItem.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative",
  };

  // Attach drag listeners/attributes to a small visible drag-handle
  // so inner interactive controls (buttons, inputs) continue to receive clicks.
  return (
    <div ref={setNodeRef} style={style}>
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 z-50 cursor-move p-1 bg-white/80 rounded border border-gray-200 text-sm"
        aria-label="Drag handle"
      >
        ☰
      </div>
      {children}
    </div>
  );
};