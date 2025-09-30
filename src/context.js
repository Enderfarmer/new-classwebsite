import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext("light");
/**
 *
 * @returns {[string, function]}
 */
export const useCurrentTheme = () => {
    const theme = useContext(ThemeContext);
    const [themeState, setThemeState] = useState(theme);
    const setTheme = (new_theme) => {
        localStorage.setItem("theme", new_theme);
        setThemeState(new_theme);
    };
    return [themeState, setTheme];
};
