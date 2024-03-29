import React, { useState } from "react";
import axios from "../../../../axios/AxiosGlobal";
import { motion } from "framer-motion";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
  Box,
  DialogActions,
  Grid,
  Alert,
  LinearProgress,
} from "@mui/material";

import { useFormik } from "formik";
import { tokens } from "../../../../theme";

const AcceptExternalRequestDialog = ({
  requestDetail,
  serverSuccessMsg,
  serverErrorMsg,
  setServerSuccessMsg,
  setServerErrorMsg,
  openExternalAcceptanceDialog,
  setOpenExternalAcceptanceDialog,
  title = "Accept draft and assign expert to comment",
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [repliersEmail, setRepliersEmail] = useState([]);
  const [myUsers, setMyUsers] = useState([]);
  const [repliersID, setRepliersID] = useState([]);
  const [loading, setLoading] = useState(false);

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

  React.useEffect(() => {
    getMyUsersID();
    fetchMyUsers();
  }, [repliersEmail]);

  const getMyUsersID = () => {
    if (repliersEmail.length > 0) {
      repliersEmail.map((replier) =>
        setRepliersID([...repliersID, replier.id])
      );
    }
  };

  const fetchMyUsers = async () => {
    try {
      const res = await axios.get(`commenters-per-institution`);
      console.log("My users");
      console.log(res.data.data);
      setMyUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formikAcceptanceForm = useFormik({
    initialValues: {
      commentRequestID: requestDetail.id,
      acceptanceMessage: "Dear Sir / Madam, We have just accept these request.",
      commenters: [],
    },

    onSubmit: (values) => {
      const acceptanceData = {
        comment_request_id: values.commentRequestID,
        message: values.acceptanceMessage,
        commenters:
          repliersID.length > 0 ? repliersID.map((replierID) => replierID) : [],
      };

      assignRepliers(acceptanceData);
    },
  });

  const assignRepliers = async (acceptanceData) => {
    return await axios
      .post(`assign-commenters`, acceptanceData)
      .then((res) => {
        setServerSuccessMsg(res.data.message);
        setServerErrorMsg(null);
        setLoading(false);
        setOpenExternalAcceptanceDialog(false);
      })
      .catch((errors) => {
        setServerErrorMsg(errors.response.data.message);
        setServerSuccessMsg(null);
        setLoading(false);
      });
  };

  return (
    <Dialog open={openExternalAcceptanceDialog} fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="600">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
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
              {loading ? <LinearProgress size="small" color="info" /> : ""}
            </motion.span>
          </Grid>

          <form
            style={{ marginBottom: "30px" }}
            onSubmit={formikAcceptanceForm.handleSubmit}
          >
            <TextField
              label="Write acceptance message (not mandatory)"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={4}
              sx={{ paddingBottom: "10px" }}
              color="info"
              name="acceptanceMessage"
              value={formikAcceptanceForm.values.acceptanceMessage}
              onBlur={formikAcceptanceForm.handleBlur}
              onChange={formikAcceptanceForm.handleChange}
            />

            <Typography variant="subtitle1" fontWeight="600">
              Assign Commenters
            </Typography>
            <Autocomplete
              multiple
              id="tags-standard"
              freeSolo
              autoSelect
              color="info"
              sx={{ paddingBottom: "10px" }}
              options={myUsers}
              getOptionLabel={(option) =>
                option.first_name + " " + option.middle_name
              }
              onChange={(e, value) => setRepliersEmail(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Commenters"
                  color="info"
                  value={(option) => option}
                />
              )}
            />

            <Box>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                type="submit"
                sx={{
                  textTransform: "none",
                  marginRight: "5px",
                  backgroundColor: colors.successColor[200],
                  color: colors[300],
                }}
              >
                <Typography variant="body2">accept and close</Typography>
              </Button>
            </Box>
          </form>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={() => setOpenExternalAcceptanceDialog(false)}
            variant="outlined"
            size="small"
            color="secondary"
            sx={{ textTransform: "none" }}
          >
            <Typography variant="body2">Cancel</Typography>
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptExternalRequestDialog;