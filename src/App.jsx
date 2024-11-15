import { createBrowserRouter, RouterProvider} from "react-router-dom";
import { enrutadorApp } from "./components/routes/enrutadorApp";

let router = createBrowserRouter(enrutadorApp);
const App = () =>{
  return <RouterProvider router={router} />;
}
export default App;



