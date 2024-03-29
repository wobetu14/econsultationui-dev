import { Button, TextField, Grid, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useContext } from "react";
import { tokens } from "../../../theme";
import Header from "../AdminHeader";
import axios from "../../../axios/AxiosGlobal";
import { motion } from "framer-motion";
import { RegionsDataContext } from "../../../contexts/RegionsDataContext";
import { UserContext } from "../../../contexts/UserContext";

const EditRegion = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // User context
  const { userInfo } = useContext(UserContext);
  
  const { region, setServerErrorMsg, setServerSuccessMsg, setLoading } =
    useContext(RegionsDataContext);

  const helperTextStyle = {
    color: "red",
    fontWeight: "400",
    fontSize: "15px",
  };

  const formik = useFormik({
    initialValues: {
      regionName: region ? region.name : "",
      updatedBy: userInfo ? userInfo.user.id : "",
    },

    onSubmit: (values) => {
      const regionData = {
        name: values.regionName,
        updated_by: values.updatedBy,
        _method: "put",
      };

      registerRegion(regionData);
    },
  });

  const registerRegion = async (regionData) => {
    setLoading(true);
    return await axios
      .post(`regions/${region.id}`, regionData)
      .then((res) => {
        setServerSuccessMsg(res.data.message);
        setServerErrorMsg(null);
        formik.resetForm();
        setLoading(false);
      })
      .catch((errors) => {
        setServerErrorMsg(errors.response.data.message);
        setServerSuccessMsg(null);
        setLoading(false);
      });
  };

  return (
    <Box width={"95%"}>
      <Header title="Create New Region" subtitle="" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Region Name"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingBottom: "10px" }}
                color="info"
                name="regionName"
                value={formik.values.regionName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.regionName && formik.errors.regionName ? (
                    <span style={helperTextStyle}>
                      {formik.errors.regionName}
                    </span>
                  ) : null
                }
              />

              <Grid sx={{ paddingBottom: "20px" }} align="right">
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{
                    align: "right",
                    textTransform: "none",
                    backgroundColor: colors.successColor[200],
                    color: colors.grey[300],
                  }}
                  color="info"
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </motion.span>
    </Box>
  );
};

export default EditRegion;