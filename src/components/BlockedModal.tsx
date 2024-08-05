import React, { useEffect } from "react";

const CustomModal: React.FC<{
  isOpen?: boolean;
  children?: any;
  mainScreenModal?: boolean | false;
}> = ({ isOpen, children, mainScreenModal }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <dialog
        className={`${mainScreenModal ? "absolute" : ""} modal`}
        open={isOpen}
      >
        <div
          className={`${
            mainScreenModal ? "absolute" : "fixed"
          } inset-0 bg-black opacity-50`}
          onClick={(e) => e.stopPropagation()}
        ></div>
        <div className="modal-box flex flex-col p-4 max-w-screen-md bg-white">
          {children}
        </div>
      </dialog>
    </>
  );
};

export default CustomModal;
