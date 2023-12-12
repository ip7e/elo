"use client";

import { useState } from "react";
import Dialog from "../components/dialog/dialog";
import Button from "../components/button/button";

export default function NewGameDialog() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      {!isOpen && <Button onClick={openModal}>Open dialog</Button>}

      <Dialog
        headline="New game session"
        content={"Here u add new game session boy"}
        footer={
          <>
            <Button>Submit</Button>
            <Button>Cancel</Button>
          </>
        }
      />
    </>
  );
}
