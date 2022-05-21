import { nanoid } from "nanoid";
import { NextPage } from "next";
import { useState } from "react";

type Item = {
  text: string;
  id: string;
};

const Test: NextPage = () => {
  const [list, setList] = useState<Item[]>([
    { text: "A", id: nanoid() },
    { text: "B", id: nanoid() },
    { text: "C", id: nanoid() },
    { text: "D", id: nanoid() },
    { text: "E", id: nanoid() },
  ]);
  const [itemBeingDragged, setItemBeingDragged] = useState<Item | null>(null);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        {list.map((item, index) => (
          <div
            draggable={true}
            onDragStart={(e) => {
              const draggedItemString = JSON.stringify(item);
              e.dataTransfer.setData("item", draggedItemString);
              setItemBeingDragged(item);
            }}
            onDragOver={(e) => {
              if (itemBeingDragged && itemBeingDragged.id !== item.id) {
                e.preventDefault();
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              const draggedItemString = e.dataTransfer.getData("item");
              const draggedItem: Item = JSON.parse(draggedItemString);
              const prevIndex = list.findIndex((i) => i.id === draggedItem.id);
              console.log("previndex", prevIndex);
              let listWithoutPrev = list.slice();
              listWithoutPrev.splice(prevIndex, 1);
              console.log("listwithoutprev", listWithoutPrev);
              const newIndex = index;
              console.log("newindex", newIndex);
              const firstHalf = listWithoutPrev.slice(0, newIndex);
              const secondHalf = listWithoutPrev.slice(newIndex, listWithoutPrev.length);
              console.log("halves", firstHalf, secondHalf);
              const finalList = [...firstHalf, draggedItem, ...secondHalf];
              console.log("final", finalList);
              setList(finalList);
            }}
            style={{ padding: "1rem", backgroundColor: "gray" }}
            key={item.id}
          >
            {item.text}
          </div>
        ))}
      </div>
    </>
  );
};

export default Test;
