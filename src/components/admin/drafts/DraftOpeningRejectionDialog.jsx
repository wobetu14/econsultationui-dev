import React from "react";
import axios from "../../../axios/AxiosGlobal";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { tokens } from "../../../theme";
import { useFormik } from "formik";

const DraftOpeningRejectionDialog = ({
  title,
  documentDetail,
  serverSuccessMsg,
  serverErrorMsg,
  setServerSuccessMsg,
  setServerErrorMsg,
  openRejectionDialog,
  setOpenRejectionDialog,
  showRejectionDialog,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const formikRejectionForm = useFormik({
    initialValues: {
      draft_id: documentDetail ? documentDetail.id : "",
      requestRejectionMessage: "",
    },

    onSubmit: (values) => {
      const requestData = {
        draft_id: values.draft_id,
        request_rejection_message: values.requestRejectionMessage,
      };
      rejectCommentOpening(requestData);
    },
  });

  const rejectCommentOpening = async (requestData) => {
    console.log(requestData);

    return await axios
      .post(`request-rejection`, requestData)
      .then((res) => {
        setServerSuccessMsg(res.data.message);
        setServerErrorMsg(null);
      })
      .catch((errors) => {
        setServerErrorMsg(errors.response.data.message);
        setServerSuccessMsg(null);
      });
  };

  return (
    <>
      <Dialog open={openRejectionDialog} fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="600">
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <form
              style={{ marginBottom: "30px" }}
              onSubmit={formikRejectionForm.handleSubmit}
            >
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight="600">
                  Reason to reject this request?
                </Typography>
                <TextField
                  label="Please write your reason to reject this request..."
                  variant="outlined"
                  size="small"
                  multiline
                  fullWidth
                  rows={4}
                  sx={{ paddingBottom: "10px" }}
                  color="info"
                  name="requestRejectionMessage"
                  value={formikRejectionForm.values.requestRejectionMessage}
                  onBlur={formikRejectionForm.handleBlur}
                  onChange={formikRejectionForm.handleChange}
                  // helperText={formikRejectionForm.touched.reasonForRejection && formikRejectionForm.errors.reasonForRejection ? <span style={helperTextStyle}>{formikRejectionForm.errors.reasonForRejection}</span>:null}
                />

                <Box>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    type="submit"
                    sx={{
                      textTransform: "none",
                      marginRight: "5px",
                      backgroundColor: colors.dangerColor[200],
                      color: colors.grey[300],
                    }}
                  >
                    <Typography variant="body2">Reject this Request</Typography>
                  </Button>
                </Box>
              </Stack>
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRejectionDialog(false)}
            variant="outlined"
            size="small"
            color="info"
            sx={{ textTransform: "none" }}
          >
            <Typography variant="body2">Cancel</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DraftOpeningRejectionDialog;