import { Box, Card, CardContent, Typography } from "@mui/material";
import { useFinnHub } from "../customhooks/useFinnHub";
import PortfolioTable from "../features/PortfolioTable";
import { useMemo, useState } from "react";
import { CardText } from "../features/cardcomponent";
import PortfolioLineChart from "../features/linechart";
import { useThemeContext } from "../context/ThemeContext";

export default function PortfolioDashboard() {
  const { tickers, loading, lastUpdate } = useFinnHub();
  const [search, setSearch] = useState("");
  const { isDark } = useThemeContext();

  const stats = useMemo(() => {
    let totalInvested = 0;
    let currentValue = 0;
    let totalPL = 0;
    let todayChange = 0;

    Object.entries(tickers).forEach(([key, item], ind) => {
      const invested = item.quantity * item.avgPrice;
      const currentVal = item.quantity * item.price;

      totalInvested += invested;
      currentValue += currentVal;
      totalPL += currentVal - invested;

      // If API gives daily change
      if (item.change) {
        todayChange += item.change * item.quantity;
      }
    });

    const plPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

    const todayPercent =
      currentValue > 0 ? (todayChange / (currentValue - todayChange)) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      totalPL,
      plPercent,
      todayChange,
      todayPercent,
    };
  }, [tickers]);

  const searchEvent = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const filterRows = useMemo(() => {
    if (!search) return tickers;
    const filterResponse = Object.entries(tickers).filter(([key, item]) =>
      item?.company.toLowerCase().startsWith(search)
    );
    return filterResponse.reduce((acc, curr) => {
      acc[curr[0]] = { ...curr[1] };
      return acc;
    }, {});
  }, [search]);

  const formatData = useMemo(() => {
    return Object.entries(tickers).map(([key, item]) => ({
      time: item?.timeStamp,
      value: parseFloat((item?.price * item?.quantity).toFixed(1)),
    }));
  }, [tickers]);

  return (
    <Box
      className="w-full flex flex-col gap-4 mx-auto max-w-[1400px]"
      component={"div"}
    >
      <Box
        component={"div"}
        className="grid grid-cols-1 mobile-lg:grid-cols-2 laptop-sm:grid-cols-4 !gap-[10px] tablet-sm:!gap-4"
      >
        <Card
          sx={{
            borderRadius: "7px",
            border: isDark ? "1px solid #444444" : "1px solid #dedede",
          }}
          elevation={0}
        >
          <CardText
            title={"Total Invested"}
            value={stats.totalInvested.toLocaleString()}
            isDark={isDark}
          />
        </Card>

        <Card
          sx={{
            borderRadius: "7px",
            border: isDark ? "1px solid #444444" : "1px solid #dedede",
          }}
          elevation={0}
        >
          <CardText
            title={"Current Value"}
            isDark={isDark}
            value={stats.currentValue.toLocaleString()}
          />
        </Card>

        <Card
          sx={{
            borderRadius: "7px",
            border: isDark ? "1px solid #444444" : "1px solid #dedede",
            bgcolor: isDark ? "#282828" : "#fff",
          }}
          elevation={0}
        >
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            className="!p-3 tablet-sm:!p-[16px]"
          >
            <Typography
              variant="subtitle2"
              color={isDark ? "#A0A0A0" : "text.secondary"}
            >
              Profit / Loss
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              className={`${
                stats.totalPL >= 0 ? "text-green-600" : "text-red-600"
              } !text-[18px] tablet-sm:!text-[24px]`}
            >
              {stats.totalPL >= 0 ? "+" : ""}${stats.totalPL.toFixed(2)} (
              {stats.plPercent.toFixed(2)}%)
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: "7px",
            border: isDark ? "1px solid #444444" : "1px solid #dedede",
            bgcolor: isDark ? "#282828" : "#fff",
          }}
          elevation={0}
        >
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            className="!p-3 tablet-sm:!p-[16px]"
          >
            <Typography
              variant="subtitle2"
              color={isDark ? "#A0A0A0" : "text.secondary"}
              component={"p"}
              className="!text-[13px] tablet-sm:!text-[14px]"
            >
              Today's Change
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              component={"p"}
              className={`
                  ${
                    stats.todayChange >= 0 ? "text-green-600" : "text-red-600"
                  } !text-[18px] tablet-sm:!text-[24px]`}
            >
              {stats.todayChange >= 0 ? "+" : ""}${stats.todayChange.toFixed(2)}
              ({stats.todayPercent.toFixed(2)}
              %)
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        component={"div"}
        className="!flex !flex-col-reverse laptop-sm:!flex-row !gap-4"
      >
        <Box component={"div"} className="!w-[100%] laptop-sm:!w-[65%]">
          <PortfolioTable
            data={filterRows}
            searchEvent={searchEvent}
            value={search}
            clearSearch={() => setSearch("")}
            isDark={isDark}
          />
        </Box>
        <Box component={"div"} className="!w-[100%] laptop-sm:!w-[35%]">
          <PortfolioLineChart data={formatData} isDark={isDark} />
        </Box>
      </Box>
    </Box>
  );
}
