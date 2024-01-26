import React from "react";
import './App.css';
import { createHashRouter, RouterProvider } from "react-router-dom";
import {HomeLayout,Landing, MondayCard , Main, UserContextProvider} from "./pages"
const router = createHashRouter([
  {
    path: "/",
    element: <HomeLayout />,
    // errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "mondaycard",
        element: <MondayCard />,
      },
      {
        path: "main",
        element: <Main />,
      },
     
    ],
  },
]);

function App() {
  
  return (
     
    <UserContextProvider>
    <RouterProvider router={router} />
    </UserContextProvider>
  
  );
};
export default App;
