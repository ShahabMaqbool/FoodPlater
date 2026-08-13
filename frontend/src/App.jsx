import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./pages/Orders";
import MenuItems from "./pages/MenuItems";
import Categories from "./pages/Categories";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={<Orders />} />


                <Route path="/menu-items" element={<MenuItems />} />

                <Route path="/categories" element={<Categories />} />

                

            </Routes>

        </BrowserRouter>
    );
}

export default App;