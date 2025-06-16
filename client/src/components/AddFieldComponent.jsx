import React from "react";
import { IoIosCloseCircle } from "react-icons/io";

const AddFieldComponent = ({ close, value, onChange,submit }) => {
  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-slate-700 bg-opacity-55 z-50 flex justify-center items-center">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <div className="flex justify-between items-center gap-4">
          <h1 className="font-semibold">Add Field</h1>
          <button>
            <IoIosCloseCircle size={30} onClick={close} />
          </button>
        </div>
        <input
          className="bg-blue-50 border outline-none p-1 w-full mt-2"
          placeholder="enter field Name"
          value={value}
          onChange={onChange}
        />
        <button
        onClick={submit}
        className="bg-blue-200 m-2 mt-5 p-2 rounded text-sm hover:bg-blue-500 hover:text-white">
          Add Field
        </button>
      </div>
    </section>
  );
};

export default AddFieldComponent;
