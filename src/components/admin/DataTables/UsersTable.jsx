import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import DataTable from "react-data-table-component";
import { Stack } from "@mui/system";
import { tokens } from "../../../theme";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Header from "../AdminHeader";
import CreateUser from "../users/CreateUser";
import EditUser from "../users/EditUser";
import { UsersDataContext } from "../../../contexts/UsersDataContext";
import { motion } from "framer-motion";
import DeleteUserDialog from "../../../partials/DeleteUserDialog";

const UsersTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    user,
    setUser,
    filteredUsers,
    searchUser,
    setSearchUser,
    showUserAddForm,
    setShowUserAddForm,
    showUserEditForm,
    setShowUserEditForm,
    serverErrorMsg,
    serverSuccessMsg,
    openDialog,
    setOpenDialog,
    loading,
  } = useContext(UsersDataContext);

  const errorStyle = {
    color: "red",
    fontWeight: "400",
    fontSize: "18px",
  };

  const successStyle = {
    color: "green",
    fontWeight: "400",
    fontSize: "18px",
  };

  // Show / Hide Add User Form
  const showAddUserForm = (msg) => {
    setShowUserAddForm(!showUserAddForm);
    setShowUserEditForm(false);
  };

  const showEditUserForm = (userRow) => {
    setUser(userRow);
    setShowUserEditForm(true);
    setShowUserAddForm(false);
  };

  const hideForm = () => {
    setShowUserEditForm(false);
    setShowUserAddForm(false);
  };

  const deleteUserDialog = (userRow) => {
    setUser(userRow);
    setOpenDialog(true);
  };

  const columns = [
    {
      name: (
        <Typography variant="h5" fontWeight="600">
          Full Name
        </Typography>
      ),
      selector: (row) => (
        <Typography variant="body1">{`${row.first_name} ${row.middle_name}`}</Typography>
      ),
      sortable: true,
    },

    {
      name: (
        <Typography variant="h5" fontWeight="600">
          Mobile
        </Typography>
      ),
      selector: (row) => (
        <Typography variant="body1">{row.mobile_number}</Typography>
      ),
      sortable: true,
    },
    {
      name: (
        <Typography variant="h5" fontWeight="600">
          Institution
        </Typography>
      ),
      selector: (row) => (
        <Typography variant="body1">{row.institution}</Typography>
      ),
      sortable: true,
    },
    {
      name: (
        <Typography variant="h5" fontWeight="600">
          Region
        </Typography>
      ),
      selector: (row) => <Typography variant="body1">{row.region}</Typography>,
      sortable: true,
    },
    {
      name: (
        <Typography variant="h5" fontWeight="600">
          Created By
        </Typography>
      ),
      selector: (row) => (
        <Typography variant="body1">{row.created_by}</Typography>
      ),
      sortable: true,
    },

    {
      name: (
        <Typography variant="h5" fontWeight="600">
          Role
        </Typography>
      ),
      selector: (row) =>
        row.roles.map((role) => (
          <li style={{ listStyleType: "none" }}>
            <Typography variant="body1">{role.name}</Typography>
          </li>
        )),
    },
    {
      name: (
        <Typography variant="h5" fontWeight="600">
          Actions
        </Typography>
      ),
      selector: (row) => {
        return (
          <Stack spacing={0} direction="row">
            <Button
              variant="Link"
              size="small"
              color="secondary"
              sx={{ textTransform: "none" }}
              key={row.id}
              onClick={() => showEditUserForm(row)}
            >
              <ModeEditIcon fontSize="small" color="secondary" />
            </Button>
            <Button
              variant="Link"
              size="small"
              sx={{ textTransform: "none" }}
              onClick={() => deleteUserDialog(row)}
            >
              <DeleteIcon
                fontSize="small"
                sx={{ color: colors.dangerColor[200] }}
              />
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box m="0 20px" width={"95%"}>
      <Header title="Users" subtitle="Manage Users" />

      <Grid align="center" sx={{ paddingBottom: "5px", paddingTop: "5px" }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h1">
            {serverSuccessMsg ? (
              <Alert severity="success" style={successStyle}>
                {serverSuccessMsg}
              </Alert>
            ) : null}
          </Typography>

          <Typography variant="h1">
            {serverErrorMsg ? (
              <Alert severity="error" style={errorStyle}>
                {serverErrorMsg}
              </Alert>
            ) : null}
          </Typography>

          {loading ? <LinearProgress size="small" color="info" /> : null}
        </motion.span>
      </Grid>
      {openDialog && (
        <DeleteUserDialog
          title="Deleting User..."
          text={`You are about to delete user ${
            user ? user.first_name + " " + user.middle_name : ""
          }. Are you sure?`}
        />
      )}

      {showUserAddForm && <CreateUser />}
      {showUserEditForm && <EditUser />}

      <Paper elevation={1} sx={{ marginTop: "10px", marginBottom: "350px" }}>
        <DataTable
          columns={columns}
          data={filteredUsers}
          progressPending={filteredUsers.length <= 0}
          progressComponent={
            <Box mb="20px">
              <CircularProgress color="info" />
            </Box>
          }
          pagination
          selectableRowsHighlight
          subHeader
          subHeaderComponent={
            <Box
              width="100%"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                direction: "row",
              }}
            >
              <Box width="30%">
                <TextField
                  label="Search..."
                  variant="outlined"
                  size="small"
                  color="info"
                  fullWidth
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </Box>
              <Box>
                {showUserAddForm ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    sx={{ textTransform: "none" }}
                    onClick={hideForm}
                  >
                    <VisibilityOffIcon /> Hide Form
                  </Button>
                ) : showUserEditForm ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    sx={{ textTransform: "none" }}
                    onClick={hideForm}
                  >
                    <VisibilityOffIcon /> Hide Form
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    sx={{ textTransform: "none" }}
                    onClick={showAddUserForm}
                  >
                    <AddIcon /> Add New User
                  </Button>
                )}
              </Box>
            </Box>
          }
        />
      </Paper>
    </Box>
  );
};

export default UsersTable;