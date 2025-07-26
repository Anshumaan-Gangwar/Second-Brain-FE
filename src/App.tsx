import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage"
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";


const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/Signin", element: <Auth /> },
  { path: "/Signup", element: <Auth /> },
  { path: "/Dashboard", element: <Dashboard /> },
  { path: "/share/:hash", element: <Dashboard /> },
]);


function App() {
  return (
    <div className="text-red-500 bg-amber-300">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
