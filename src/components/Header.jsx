import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useFinnHub } from "../customhooks/useFinnHub";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { AiOutlineMinus } from "react-icons/ai";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { useThemeContext } from "../context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const { isDark, toggleTheme } = useThemeContext();
  const { tickers, loading, lastUpdate } = useFinnHub();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formatted);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      component={"div"}
      className={`w-full transition-all duration-300 ${
        isDark ? "text-[#e6edf3]" : " text-black"
      }`}
    >
      {/* TOP SECTION */}
      <Box className="flex items-center justify-between max-w-[1400px] mx-auto pt-1.5">
        <Box
          component={"div"}
          className="mobile-sm:flex mobile-sm:flex-col mobile-sm:gap-[2px]"
        >
          <Typography
            component={"p"}
            fontWeight={"bold"}
            className={`font-semibold mobile-sm:!text-[16px] tablet-sm:!text-[18px] mobile-sm:pl-2 tablet-sm:pl-4 laptop-lg:pl-0 ${
              isDark ? "text-[#e6edf3]" : "text-black"
            }`}
          >
            Mindorigin Portfolio
          </Typography>
          <Typography
            component={"p"}
            className={`mobile-sm:text-[15px] tablet-sm:text-[18px] px-2 mobile-sm:visible tablet-sm:hidden ${
              isDark ? "text-[#b3b2b3]" : "text-gray-600"
            }`}
          >
            ({currentTime})
          </Typography>
        </Box>

        <Box className="flex items-center gap-4 mobile-sm:pl-2 tablet-sm:pr-4 laptop-lg:pr-0">
          <div className="mobile-sm:hidden tablet-sm:block">
            <Typography
              component="p"
              className={`flex items-center gap-2 text-sm ${
                isDark ? "text-[#b3b2b3]" : "text-gray-600"
              }`}
            >
              <span>Live Market</span>

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>

              <span>{currentTime}</span>
            </Typography>
          </div>

          <IconButton
            onClick={toggleTheme}
            sx={{
              padding: "8px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              color: isDark ? "#e6edf3" : "#111",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isDark ? (
                <motion.div
                  key="dark"
                  initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
                  transition={{ duration: 0.25 }}
                >
                  <DarkModeOutlinedIcon fontSize="medium" />
                </motion.div>
              ) : (
                <motion.div
                  key="light"
                  initial={{ opacity: 0, scale: 0.6, rotate: 90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: -90 }}
                  transition={{ duration: 0.25 }}
                >
                  <LightModeIcon fontSize="medium" />
                </motion.div>
              )}
            </AnimatePresence>
          </IconButton>
        </Box>
      </Box>

      <Box
        className={`mt-2 py-1 mobile-sm:px-2 tablet-sm:px-4 laptop-lg:px-0 border-t ${
          isDark
            ? "border-[rgba(255,255,255,0.15)] bg-[#232427] transition duration-300"
            : "border-gray-200"
        }`}
      >
        <Box className="w-full flex overflow-x-auto whitespace-nowrap gap-5 tablet-sm:gap-8 max-w-[1400px] mx-auto scrollbar-hide">
          {Object.entries(tickers).map(([key, value]) => {
            const status = value?.status || "neutral";
            return (
              <Box
                key={key}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <span className={isDark ? "text-[#e6edf3]" : "text-gray-700"}>
                  {key}
                </span>

                <span
                  className={`flex items-center ${
                    status === "red"
                      ? "text-red-500"
                      : status === "green"
                      ? "text-green-500"
                      : isDark
                      ? "text-[#9ba1a6]"
                      : "text-gray-500"
                  }`}
                >
                  {status === "green" ? (
                    <HiArrowNarrowUp className="text-[15px]" />
                  ) : status === "red" ? (
                    <HiArrowNarrowDown className="text-[15px]" />
                  ) : (
                    <AiOutlineMinus className="text-[15px]" />
                  )}
                  <span>{value?.price?.toFixed(2) ?? 0}</span>
                </span>

                <span
                  className={
                    status === "red"
                      ? "text-red-500"
                      : status === "green"
                      ? "text-green-500"
                      : isDark
                      ? "text-[#9ba1a6]"
                      : "text-gray-500"
                  }
                >
                  ({value?.percentVariant})
                </span>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
