import React, { SyntheticEvent, useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Modal,
  Typography,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  AppBar,
  Box,
  SnackbarCloseReason,
  SelectChangeEvent,
} from "@mui/material";

const MyApp: React.FC = () => {
  // State for setting 1
  const [selectedToggle, setSelectedToggle] = useState("A");

  // State for setting 2
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState<{ id: number; input: string }[]>(
    []
  );
  const [selectedRow, setSelectedRow] = useState<{
    id: number;
    input: string;
  } | null>(null);

  // State for Mini Modal
  const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);
  const [editedInput, setEditedInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State for Top Page Modal
  const [isTopPageModalOpen, setIsTopPageModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleToggleChange = (event: SelectChangeEvent<string>) => {
    setSelectedToggle(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = () => {
    if (inputValue.trim() !== "") {
      setTableData((prevData) => [
        ...prevData,
        { id: prevData.length + 1, input: inputValue.trim() },
      ]);
      setInputValue("");
    }
  };

  const handleRowClick = (rowData: { id: number; input: string }) => {
    setSelectedRow(rowData);
    setIsMiniModalOpen(true);
    setIsEditing(false); // ミニモーダルが開かれるときは常に編集不可にリセット
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedInput(selectedRow ? selectedRow.input : "");
  };

  const handleSaveClick = () => {
    if (selectedRow) {
      const updatedData = tableData.map((row) =>
        row.id === selectedRow.id ? { ...row, input: editedInput.trim() } : row
      );
      setTableData(updatedData);
      setIsMiniModalOpen(false);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClick = () => {
    setAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRow) {
      const updatedData = tableData.filter((row) => row.id !== selectedRow.id);
      setTableData(updatedData);
      setIsMiniModalOpen(false);
      setAlertOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setAlertOpen(false);
  };

  const handleCloseMiniModal = () => {
    setIsMiniModalOpen(false);
  };

  const handleSnackbarClose = (
    event: Event | SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenTopPageModal = () => {
    setIsTopPageModalOpen(true);
  };

  const handleCloseTopPageModal = () => {
    setIsTopPageModalOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      {/* Top Page */}
      <Button onClick={handleOpenTopPageModal}>展開ボタン</Button>

      {/* Top Page Modal */}
      <Modal open={isTopPageModalOpen} onClose={handleCloseTopPageModal}>
        <div>
          <AppBar position="static">
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="設定１" />
              <Tab label="設定２" />
            </Tabs>
          </AppBar>
          <Box bgcolor="white" p={3}>
            {selectedTab === 0 && (
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>名称</TableCell>
                        <TableCell>
                          <Select
                            value={selectedToggle}
                            onChange={handleToggleChange}
                          >
                            <MenuItem value="A">A</MenuItem>
                            <MenuItem value="B">B</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {selectedTab === 1 && (
              <Paper>
                <TextField
                  label="入力欄"
                  variant="outlined"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <Button variant="contained" onClick={handleAddClick}>
                  追加
                </Button>
                <TableContainer style={{ maxHeight: 300 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>入力済み</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row) => (
                        <TableRow
                          key={row.id}
                          onClick={() => handleRowClick(row)}
                        >
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.input}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Box>
        </div>
      </Modal>

      {/* Mini Modal */}
      <Modal open={isMiniModalOpen} onClose={handleCloseMiniModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <TextField
            variant="outlined"
            value={isEditing ? editedInput : selectedRow?.input}
            onChange={(e) => setEditedInput(e.target.value)}
            disabled={!isEditing} // 編集中のみテキストボックスを入力可能に
          />
          <Button
            variant="contained"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            {isEditing ? "保存" : "編集"}
          </Button>
          <Button variant="contained" onClick={handleDeleteClick}>
            削除
          </Button>
          <Dialog open={alertOpen} onClose={handleCancelDelete}>
            <DialogTitle>削除しますか？</DialogTitle>
            <DialogActions>
              <Button onClick={handleConfirmDelete}>はい</Button>
              <Button onClick={handleCancelDelete}>いいえ</Button>
            </DialogActions>
          </Dialog>
        </div>
      </Modal>

      {/* Snackbar for save notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="保存しました"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <span>×</span>
          </IconButton>
        }
      />
    </div>
  );
};

export default MyApp;
