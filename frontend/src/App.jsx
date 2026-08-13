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

            </Routes>

        </BrowserRouter>
    );
}

export default App;