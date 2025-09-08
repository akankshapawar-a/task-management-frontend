"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Styled components for dark theme
const StyledTableContainer = styled(TableContainer)(() => ({
  backgroundColor: "#1e1e1e",
  borderRadius: 8,
}));

const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: "#2d2d2d",
}));

const StyledTableCell = styled(TableCell)(() => ({
  color: "#ffffff",
  borderBottom: "1px solid #404040",
  fontSize: "14px",
  padding: "16px",
}));

const StyledHeaderCell = styled(TableCell)(() => ({
  color: "#b0b0b0",
  borderBottom: "1px solid #404040",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  padding: "12px 16px",
  backgroundColor: "#2d2d2d",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "#2a2a2a",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// New styled row for cards without hover effect
const CardTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Types
interface Label {
  labelColor: string;
  labelTitle: string;
  _id?: string;
}

interface Card {
  _id: string;
  title: string;
  color: string;
  label: Label[];
  attachments: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface Column {
  _id: string;
  title: string;
  cards: Card[];
  userId: string;
  __v: number;
}

interface ApiResponse {
  status: string;
  message: string;
  columns: Column[];
}

const TableComponent: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openColumnIds, setOpenColumnIds] = useState<string[]>([]);

  // API call
  useEffect(() => {
    const handleTabledata = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/api/board", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: ApiResponse = await response.json();
        console.log("data", data);
        if (response.status === 200 && data.columns) {
          setColumns(data.columns);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        console.log("Error while fetching the data");
        setLoading(false);
      }
    };
    handleTabledata();
  }, []);

  const toggleColumn = (colId: string) => {
    setOpenColumnIds((prev) =>
      prev.includes(colId)
        ? prev.filter((id) => id !== colId)
        : [...prev, colId]
    );
  };

  const renderLabels = (labels: Label[]): React.ReactNode => {
    if (!labels || labels.length === 0) {
      return (
        <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
          •
        </Typography>
      );
    }
    return (
      <Box display="flex" gap={0.5} flexWrap="wrap">
        {labels.map((label: Label, index: number) => (
          <Chip
            key={label._id || index}
            label={label.labelTitle}
            size="small"
            sx={{
              backgroundColor: label.labelColor || "#666",
              color: "white",
              fontSize: "10px",
              height: "20px",
            }}
          />
        ))}
      </Box>
    );
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "•";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "•";
    }
  };

  // Function to get background color for card title cell
  const getCardTitleBackgroundColor = (cardColor: string): string => {
    switch (cardColor) {
      case "blue":
        return "#bbdefb"; // faint blue
      case "red":
        return "#ffcdd2"; // medium red
      default:
        return "transparent";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          backgroundColor: "#1e1e1e",
          width: "100%",
        }}
      >
        <CircularProgress sx={{ color: "#ffffff" }} />
      </Box>
    );
  }

  if (columns.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          backgroundColor: "#1e1e1e",
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ color: "#b0b0b0" }}>
          No columns found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#1e1e1e",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <StyledTableContainer>
        <Paper sx={{ backgroundColor: "#1e1e1e", borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="task table">
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell />
                <StyledHeaderCell>Task Title</StyledHeaderCell>
                <StyledHeaderCell>Card Description</StyledHeaderCell>
                <StyledHeaderCell>Labels</StyledHeaderCell>
                <StyledHeaderCell>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    Created Date
                    <IconButton size="small" sx={{ color: "#b0b0b0", ml: 1 }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </StyledHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {columns.map((col) => (
                <React.Fragment key={col._id}>
                  {/* Column row */}
                  <StyledTableRow>
                    <StyledTableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleColumn(col._id)}
                        sx={{ color: "#fff" }}
                      >
                        {openColumnIds.includes(col._id) ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell colSpan={5}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#ffffff", fontWeight: "bold" }}
                      >
                        {col.title}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>

                  {/* Expandable cards */}
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openColumnIds.includes(col._id)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Table size="small">
                            <TableBody>
                              {col.cards.map((card) => (
                                <CardTableRow key={card._id}>
                                  <StyledTableCell />
                                  <StyledTableCell />
                                  <StyledTableCell
                                    sx={{
                                      backgroundColor: getCardTitleBackgroundColor(card.color),
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#ffffff" }}
                                    >
                                      {card.title}
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {renderLabels(card.label)}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#b0b0b0" }}
                                    >
                                      {formatDate(card.createdAt)}
                                    </Typography>
                                  </StyledTableCell>
                                </CardTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </StyledTableContainer>
    </Box>
  );
};

export default TableComponent;