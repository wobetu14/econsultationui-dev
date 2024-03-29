import React, { useContext, useState } from "react";
import axios from "../../../../axios/AxiosGlobal";
import { motion } from "framer-motion";
import {
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
import { UserContext } from "../../../../contexts/UserContext";

const RejectExternalRequest = ({
  requestDetail,
  serverSuccessMsg,
  serverErrorMsg,
  setServerSuccessMsg,
  setServerErrorMsg,
  openExternalRejectionDialog,
  setOpenExternalRejectionDialog,
  title = "Accept draft and assign expert to comment",
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);


  const [instIDs, setInsIDs] = useState([]);
  const [repliersEmail, setRepliersEmail] = useState([]);
  const [myUsers, setMyUsers] = useState([]);
  const [repliersID, setRepliersID] = useState([]);
  const [loading, setLoading] = useState(false);

  // User Context info
  const { userInfo } =
    useContext(UserContext);

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
    fetchInstitutions();
    getInstitutionsID();
    getMyUsersID();
    fetchMyUsers();
  }, [selectedInstitutions, repliersEmail]);

  const getMyUsersID = () => {
    if (repliersEmail.length > 0) {
      repliersEmail.map((replier) =>
        setRepliersID([...repliersID, replier.id])
      );
    }
  };

  const getInstitutionsID = () => {
    if (selectedInstitutions.length > 0) {
      selectedInstitutions.map((selectedInstitution) =>
        setInsIDs([...instIDs, selectedInstitution.id])
      );
    }
  };

  const fetchInstitutions = async () => {
    try {
      const res = await axios.get("public/institutions");
      setInstitutions(res.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyUsers = async () => {
    try {
      const res = await axios.get(
        `users?institution_id=${userInfo.user.institution_id}`
      );
      console.log("My users");
      console.log(res.data.data);
      setMyUsers(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formikRejectForm = useFormik({
    initialValues: {
      commentRequestID: requestDetail.id,
      rejectionMessage:
        "We are sorry but we have rejected this document. Please review your request and re-send it again.",
    },

    onSubmit: (values) => {
      const rejectionData = {
        comment_request_id: values.commentRequestID,
        message: values.rejectionMessage,
      };

      rejectIncomingCommentRequest(rejectionData);
    },
  });

  const rejectIncomingCommentRequest = async (rejectionData) => {
    setLoading(true);
    return await axios
      .post(`reject-comment-request`, rejectionData)
      .then((res) => {
        setServerSuccessMsg(res.data.message);
        setServerErrorMsg(null);
        setLoading(false);
        setOpenExternalRejectionDialog(false);
      })
      .catch((errors) => {
        setServerErrorMsg(errors.response.data.message);
        setServerSuccessMsg(null);
        setLoading(false);
      });
  };

  return (
    <Dialog open={openExternalRejectionDialog} fullWidth>
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
            onSubmit={formikRejectForm.handleSubmit}
          >
            <TextField
              label="Write rejection message (not mandatory)"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={4}
              sx={{ paddingBottom: "10px" }}
              color="info"
              name="rejectionMessage"
              value={formikRejectForm.values.rejectionMessage}
              onBlur={formikRejectForm.handleBlur}
              onChange={formikRejectForm.handleChange}
            />

            <Box>
              <Button
                size="small"
                variant="contained"
                type="submit"
                sx={{
                  textTransform: "none",
                  marginRight: "5px",
                  backgroundColor: colors.dangerColor[200],
                  color: colors.grey[300],
                }}
              >
                <Typography variant="body2">Reject this request</Typography>
              </Button>
            </Box>
          </form>
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={() => setOpenExternalRejectionDialog(false)}
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

export default RejectExternalRequest;