import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type Density = "default" | "compact";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    defaultDensity?: Density;
    storageKeyTheme?: string;
    storageKeyDensity?: string;
};

type ThemeProviderState = {
    theme: Theme;
    density: Density;
    setTheme: (theme: Theme) => void;
    setDensity: (density: Density) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    density: "default",
    setTheme: () => null,
    setDensity: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    defaultDensity = "default",
    storageKeyTheme = "vite-ui-theme",
    storageKeyDensity = "vite-ui-density",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKeyTheme) as Theme) || defaultTheme
    );

    const [density, setDensity] = useState<Density>(
        () => (localStorage.getItem(storageKeyDensity) as Density) || defaultDensity
    );

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old theme classes
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute("data-density", density);
    }, [density]);

    const value = {
        theme,
        density,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKeyTheme, theme);
            setTheme(theme);
        },
        setDensity: (density: Density) => {
            localStorage.setItem(storageKeyDensity, density);
            setDensity(density);
        },
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
}
