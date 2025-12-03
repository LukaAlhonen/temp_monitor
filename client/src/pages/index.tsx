import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Locations } from "./Locations";
import { Location } from "./Location";

export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Locations />} />
        <Route path="/location/:locationId" element={<Location />} />
        <Route
          path="/location/:locationId/sensor/:sensorId"
          element={<div>hello</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};
