import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WebsiteDetails from "./pages/WebsiteDetails";

function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

    useEffect(() => {
        document.documentElement.classList.toggle("light", theme === "light");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Dashboard onToggleTheme={toggleTheme} theme={theme} />}
                />
                <Route
                    path="/website/:id"
                    element={<WebsiteDetails onToggleTheme={toggleTheme} theme={theme} />}
                />
            </Routes>
        </BrowserRouter>
    );

}

export default App;
