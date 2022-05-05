import React from "react";
import ReactDOM from "react-dom";

type Props = {
  children: React.ReactNode;
};

const Portal: React.FC<Props> = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.getElementById("root") as HTMLElement
  );
};

export default Portal;
