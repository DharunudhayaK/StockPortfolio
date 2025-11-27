import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  CardHeader,
  Avatar,
  CardContent,
  Card,
  Box,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { AiOutlineMinus } from "react-icons/ai";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useWindowDimensions } from "../utils/componentUtility";
import { FiFilter } from "react-icons/fi";

const SORTABLEFIELDS = [
  { key: "company", label: "Company" },
  { key: "quantity", label: "Quantity" },
  { key: "avgPrice", label: "Avg Buy" },
  { key: "current", label: "Current" },
  { key: "pl", label: "P/L" },
];

function PortfolioTable({ data, searchEvent, value, clearSearch, isDark }) {
  const { width, height } = useWindowDimensions();
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);

  const rows = useMemo(() => {
    return Object.entries(data).map(([ticker, item]) => {
      const current = item.price ?? 0;
      const pl =
        current && item.avgPrice
          ? (current - item.avgPrice) * item.quantity
          : 0;

      return {
        company: item.company,
        ticker: ticker,
        quantity: item.quantity,
        avgPrice: item.avgPrice,
        current: current.toFixed(2),
        pl: pl,
        status: item?.status,
      };
    });
  }, [data]);

  const handleSort = useCallback(
    (column) => {
      if (orderBy === column) {
        setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setOrder("desc");
        setOrderBy(column);
      }
    },
    [orderBy]
  );

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];

      if (typeof aVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return order === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [rows, order, orderBy]);

  const paginatedRows = useMemo(() => {
    return sortedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedRows, page, rowsPerPage]);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleDropdownSort = (key) => {
    handleSort(key);
    handleCloseMenu();
  };

  return (
    <Paper
      className="shadow-none px-3.5 py-5 "
      elevation={0}
      sx={{
        border: isDark ? "1px solid #333333" : "1px solid #dedede",
        bgcolor: isDark ? "#1A1A1A" : "#fff",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* TEXT FIELD (SEARCH) */}
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          size="small"
          placeholder="Search..."
          value={value}
          onChange={searchEvent}
          fullWidth
          sx={{
            mb: 2,
            maxWidth:
              width < 500
                ? width < 390
                  ? width < 350
                    ? 230
                    : 270
                  : 300
                : 400,
            transition: "all 0.3s ease",
            "& .MuiInputBase-root": {
              transition: "all 0.3s ease",
              backgroundColor: isDark ? "#282828" : "#fff",
              color: isDark ? "#FFFFFF" : "text.primary",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#444444 !important" : "#dedede !important",
            },
            "& .MuiInputBase-root.Mui-focused": {
              maxWidth: 750, // expand smoothly
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: isDark ? "#A0A0A0" : "#6b7280" }} />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} edge="end">
                  <CloseIcon
                    style={{ color: isDark ? "#A0A0A0" : "#6b7280" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box
          component={"p"}
          alignItems={"center"}
          className="block tablet-md:hidden"
        >
          <IconButton size="medium" onClick={handleOpenMenu}>
            <Tooltip placement="top" title="Sort List">
              <FiFilter
                className={isDark ? "!text-[#dedede]" : "!text-[#505050]"}
              />
            </Tooltip>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            sx={{
              "& .MuiPaper-root": {
                bgcolor: isDark ? "#1A1A1A" : "#fff",
                color: isDark ? "#dedede" : "#000000",
              },
            }}
          >
            {SORTABLEFIELDS.map((field) => (
              <MenuItem
                key={field.key}
                onClick={() => handleDropdownSort(field.key)}
                sx={{
                  bgcolor: isDark ? "#1A1A1A" : "#fff",
                  color: isDark ? "#dedede" : "#000000",
                  "&:hover": {
                    bgcolor: isDark ? "#333333" : "#f0f0f0",
                  },
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <ListItemText>{field.label}</ListItemText>
                {orderBy === field.key && (
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    {order === "asc" ? (
                      <HiArrowNarrowUp
                        className={
                          isDark ? "!text-[#dedede]" : "!text-[#505050]"
                        }
                      />
                    ) : (
                      <HiArrowNarrowDown
                        className={
                          isDark ? "!text-[#dedede]" : "!text-[#505050]"
                        }
                      />
                    )}
                  </ListItemIcon>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* MOBILE CARDS VIEW */}
      <Box
        component={"div"}
        className="tablet-md:hidden flex flex-col gap-4 tablet-sm:grid tablet-sm:grid-cols-2"
      >
        {paginatedRows.length ? (
          paginatedRows.map((row) => (
            <Card
              key={row.ticker}
              sx={{
                border: isDark ? "1px solid #333333" : "1px solid #e5e7eb",
                borderRadius: "10px",
                boxShadow: "none",
                backgroundColor: isDark ? "#121212" : "#fff",
                color: isDark ? "#FFFFFF" : "text.primary",
              }}
            >
              {/* CARD HEADER */}
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: isDark ? "#3333A0" : "#4f46e5" }}>
                    {row.company?.charAt(0)?.toUpperCase()}
                  </Avatar>
                }
                title={row.company}
                subheader={row.ticker}
                titleTypographyProps={{
                  fontWeight: 600,
                  color: isDark ? "#FFFFFF" : "text.primary",
                }}
                subheaderTypographyProps={{
                  color: isDark ? "#A0A0A0" : "text.secondary",
                }}
              />

              {/* CARD CONTENT */}
              <CardContent sx={{ pt: 0 }}>
                <Box className="grid grid-cols-2 gap-y-3 gap-x-4 text-[15px]">
                  {[
                    { label: "Ticker", value: row.ticker, key: "ticker" },
                    { label: "Quantity", value: row.quantity, key: "quantity" },
                    {
                      label: "Avg Buy",
                      value: `$${row.avgPrice}`,
                      key: "avgPrice",
                    },
                    {
                      label: "Current",
                      value: row.current ? `$${row.current}` : "—",
                      key: "current",
                    },
                  ].map(({ label, value: val, key }) => (
                    <Box className="flex flex-col" key={key}>
                      <span
                        className={`text-[13px] ${
                          isDark ? "text-[#A0A0A0]" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </span>
                      <span
                        className={`font-semibold ${
                          key === "current" &&
                          (row.status === "green" || row.status === "red")
                            ? ""
                            : isDark
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {key === "current" ? (
                          <span
                            className={`font-semibold ${
                              row.status === "green"
                                ? "text-green-500"
                                : row.status === "red"
                                ? "text-red-500"
                                : isDark
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            {val}
                          </span>
                        ) : (
                          val
                        )}
                      </span>
                    </Box>
                  ))}

                  {/* P/L BLOCK */}
                  <Box className="flex flex-col col-span-2">
                    <span
                      className={`text-[13px] ${
                        isDark ? "text-[#A0A0A0]" : "text-gray-500"
                      }`}
                    >
                      Profit/Loss
                    </span>
                    <span
                      className={`
                    mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold
                    ${
                      row.status === "green"
                        ? isDark
                          ? "bg-green-800/50 text-green-400"
                          : "bg-green-100 text-green-700"
                        : row.status === "red"
                        ? isDark
                          ? "bg-red-800/50 text-red-400"
                          : "bg-red-100 text-red-700"
                        : isDark
                        ? "bg-gray-700/50 text-gray-400"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                    >
                      {row.status === "green" ? (
                        <HiArrowNarrowUp className="text-[16px]" />
                      ) : row.status === "red" ? (
                        <HiArrowNarrowDown className="text-[16px]" />
                      ) : null}
                      {row.current ? row.pl.toFixed(2) : "—"}
                    </span>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <p
            className={`text-center py-10 text-lg ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No Data
          </p>
        )}
      </Box>

      <TableContainer
        sx={{
          maxHeight: 600,
          overflowY: "auto",
          backgroundColor: isDark ? "#1A1A1A" : "inherit",
        }}
        className="hidden tablet-md:block"
      >
        <Table stickyHeader>
          {/* TABLE HEAD */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDark
                  ? "#282828 !important"
                  : "#f3f4f6 !important",
                "& th": {
                  fontWeight: 600,
                  py: 1.5,
                  borderBottom: "none",
                  color: isDark ? "#FFFFFF" : "text.primary",
                  backgroundColor: isDark
                    ? "#282828 !important"
                    : "#f3f4f6 !important",
                },
                "& th:hover .MuiTableSortLabel-root": {
                  color: isDark ? "#FFFFFF" : "text.primary",
                },
                "& th .Mui-active": {
                  color: isDark ? "#FFFFFF !important" : "text.primary",
                },
              }}
            >
              {[
                { id: "company", label: "Company", sortable: true },
                { id: "ticker", label: "Ticker" },
                { id: "quantity", label: "Quantity", sortable: true },
                { id: "avgPrice", label: "Avg Buy", sortable: true },
                { id: "current", label: "Current", sortable: true },
                { id: "pl", label: "Profit/Loss", sortable: true },
              ].map(({ id, label, sortable }) => (
                <TableCell
                  key={id}
                  sortDirection={sortable && orderBy === id ? order : false}
                  sx={{
                    backgroundColor: isDark
                      ? "#121212 !important"
                      : "#f3f4f6 !important",
                    fontWeight: 600,
                    py: 1.5,
                    borderBottom: "none",
                    color: isDark ? "#FFFFFF" : "text.primary",
                    ...(id === "company" && { borderTopLeftRadius: "8px" }),
                    ...(id === "pl" && { borderTopRightRadius: "8px" }),
                  }}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={orderBy === id}
                      direction={orderBy === id ? order : "asc"}
                      onClick={() => handleSort(id)}
                      hideSortIcon={false}
                      sx={{
                        "& .MuiTableSortLabel-icon": {
                          color: isDark
                            ? "#A0A0A0 !important"
                            : "text.primary !important",
                        },
                      }}
                    >
                      {label}
                    </TableSortLabel>
                  ) : (
                    label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* TABLE BODY (Scrollable) */}
          <TableBody>
            {paginatedRows.length ? (
              paginatedRows.map((row) => {
                return (
                  <TableRow
                    key={row.ticker}
                    sx={{
                      "&:hover": {
                        backgroundColor: isDark
                          ? "#212121 !important"
                          : "#f5f5f5 !important",
                      },
                      "& .MuiTableCell-root": {
                        borderColor: isDark
                          ? "#444444"
                          : "rgba(224, 224, 224, 1)",
                      },
                    }}
                    className={
                      isDark ? "hover:!bg-[#212121]" : "hover:!bg-gray-50"
                    }
                  >
                    {/* Regular Table Cells */}
                    <TableCell
                      sx={{
                        py: 2.2,
                        color: isDark ? "#d9d9da" : "text.primary",
                      }}
                    >
                      {row.company}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2.2,
                        color: isDark ? "#d9d9da" : "text.primary",
                      }}
                    >
                      {row.ticker}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2.2,
                        color: isDark ? "#d9d9da" : "text.primary",
                      }}
                    >
                      {row.quantity}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2.2,
                        color: isDark ? "#d9d9da" : "text.primary",
                      }}
                    >
                      ${row.avgPrice}
                    </TableCell>

                    <TableCell
                      sx={{
                        py: 2.2,
                        color:
                          row?.status === "red"
                            ? "#EF4444"
                            : row?.status === "green"
                            ? "#10B981"
                            : isDark
                            ? "#d9d9da"
                            : "#000000DE",
                      }}
                    >
                      <span className="flex items-center">
                        {row?.status === "green" ? (
                          <HiArrowNarrowUp className="text-[15px]" />
                        ) : row?.status === "red" ? (
                          <HiArrowNarrowDown className="text-[15px]" />
                        ) : (
                          <AiOutlineMinus className="text-[15px]" />
                        )}
                        {row.current ? `$${row.current}` : "—"}
                      </span>
                    </TableCell>

                    <TableCell
                      sx={{
                        py: 2.2,
                        color:
                          row?.status === "red"
                            ? "#EF4444"
                            : row?.status === "green"
                            ? "#10B981"
                            : isDark
                            ? "#d9d9da"
                            : "#000000DE",
                      }}
                    >
                      <span className="flex items-center">
                        {row?.status === "green" ? (
                          <HiArrowNarrowUp className="text-[15px]" />
                        ) : row?.status === "red" ? (
                          <HiArrowNarrowDown className="text-[15px]" />
                        ) : null}
                        {row.current ? row.pl.toFixed(2) : "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 13,
                    color: isDark ? "#A0A0A0" : "#6b7280",
                    fontSize: "22px",
                    fontWeight: 500,

                    backgroundColor: isDark ? "#1A1A1A" : "white",
                  }}
                >
                  No Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination
        component="div"
        className="hidden tablet-md:block"
        rowsPerPageOptions={[10, 30, 50]}
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          color: isDark ? "#A0A0A0" : "text.secondary",
          backgroundColor: isDark ? "#1A1A1A" : "inherit",
          "& .MuiSelect-icon": {
            color: isDark ? "#A0A0A0" : "text.secondary",
          },

          "& .MuiTablePagination-actions .MuiSvgIcon-root": {
            color: isDark ? "#A0A0A0" : "text.secondary",
          },
        }}
      />
    </Paper>
  );
}

export default React.memo(PortfolioTable);
