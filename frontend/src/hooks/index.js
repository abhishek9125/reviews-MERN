import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { NotificationContext } from "../context/NotificationProvider";
import { SearchContext } from "../context/SearchProvider";
import { ThemeContext } from "../context/ThemeProvider";

export const useTheme = () => {
    return useContext(ThemeContext);
}

export const useNotification = () => {
    return useContext(NotificationContext);
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export const useSearch = () => {
    return useContext(SearchContext);
}