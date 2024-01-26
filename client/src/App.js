import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { HomeLayout, Landing, MondayCard, Main, UserContextProvider } from "./pages";

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<HomeLayout />}
          >
            <Route index element={<Landing />} />
            <Route path="mondaycard" element={<MondayCard />} />
            <Route path="main" element={<Main />} />
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
