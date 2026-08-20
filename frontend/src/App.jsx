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
import Customers from "./pages/Customers";
import Profile from "./pages/Profile";
import Users from "./pages/Users";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Route */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Dashboard - Sirf Super Admin ke liye */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Orders - Sirf Super Admin ke liye */}
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                {/* Menu Items - Super Admin aur Data Entry dono ke liye */}
                <Route
                    path="/menu-items"
                    element={
                        <ProtectedRoute adminOnly={false}>
                            <MenuItems />
                        </ProtectedRoute>
                    }
                />

                {/* Categories - Super Admin aur Data Entry dono ke liye */}
                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute adminOnly={false}>
                            <Categories />
                        </ProtectedRoute>
                    }
                />

                {/* Customers - Sirf Super Admin ke liye */}
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Customers />
                        </ProtectedRoute>
                    }
                />

                {/* Profile - Dono access kar sakte hain */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute adminOnly={false}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <Users />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;