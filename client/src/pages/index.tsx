import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Monitor } from "./monitor";

export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Monitor />} />
      </Routes>
    </BrowserRouter>
  );
};
