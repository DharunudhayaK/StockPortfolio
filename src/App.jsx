import { AppBar, Toolbar, Container, Box } from "@mui/material";
import Header from "./components/Header";
import PortfolioDashboard from "./components/PortfolioDashboard";
import { useEffect, useState } from "react";
import { useThemeContext } from "./context/ThemeContext";

function App() {
  const [elevated, setElevated] = useState(false);
  const { isDark } = useThemeContext();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setElevated(true);
      } else {
        setElevated(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#171617" : "#f5f6fa",
        color: isDark ? "#e6edf3" : "#111",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
      component={"div"}
    >
      {/* 🔵 HEADER SECTION */}
      <AppBar
        position={elevated ? "sticky" : "static"}
        elevation={0}
        sx={{
          bgcolor: elevated
            ? isDark
              ? "rgba(23, 22, 23, 0.7) !important"
              : "rgba(255,255,255,0.35) !important"
            : isDark
            ? "#171617 !important"
            : "#ffffff !important",
          borderBottom: elevated
            ? isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(200,200,200,0.4)"
            : "none",
          backdropFilter: elevated ? "blur(8px)" : "none",
          transition: "all 0.3s ease",
          zIndex: 1200,
        }}
      >
        <Toolbar disableGutters>
          <Header />
        </Toolbar>
      </AppBar>

      {/* 🟢 MAIN BODY */}
      <Container
        maxWidth="xl"
        className="
        py-4 !px-2 tablet-sm:!px-[16px]
        
      "
        sx={{
          color: isDark ? "#e6edf3" : "#111",
          transition: "all 0.3s ease",
        }}
      >
        <PortfolioDashboard />
      </Container>
    </Box>
  );
}

export default App;
