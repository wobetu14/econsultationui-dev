import {
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import * as YUP from "yup";
import "yup-phone";
import { useContext, useEffect, useState } from "react";
import Header from "../AdminHeader";
import axios from "../../../axios/AxiosGlobal";
import { motion } from "framer-motion";
import { UsersDataContext } from "../../../contexts/UsersDataContext";
import { UserContext } from "../../../contexts/UserContext";

const CreateUser = () => {
  const [institutions, setInstitutions] = useState(null);
  const [regions, setRegions] = useState(null);
  const [userRoles, setUserRoles] = useState(null);

  // User context
  const { userInfo, userRole } = useContext(UserContext);

  // UsersDataContext
  const { fetchUsers, setServerErrorMsg, setServerSuccessMsg, setLoading } =
    useContext(UsersDataContext);

  const helperTextStyle = {
    color: "red",
    fontWeight: "400",
    fontSize: "15px",
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    return await axios
      .get("public/regions")
      .then((res) => res.data.data)
      .then((res) => {
        setRegions(res.data);
      })
      .catch((error) => {
        console.log(error.response.message);
      });
  };

  const fetchInstitutions = async () => {
    return await axios
      .get("public/institutions")
      .then((res) => res.data.data)
      .then((res) => {
        setInstitutions(res.data);
      })
      .catch((error) => {
        console.log(error.response.message);
      });
  };

  const fetchUserRoles = async () => {
    return await axios
      .get("roles")
      .then((res) => res.data.data)
      .then((res) => {
        console.log(res);
        setUserRoles(res);
      })
      .catch((error) => {
        console.log(error.response.message);
      });
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleID: "",
      regionID: userInfo ? userInfo.user.region_id : "",
      institutionID: "",
      createdBy: userInfo ? userInfo.user.id : "",
      updatedBy: userInfo ? userInfo.user.id : "",
    },

    validationSchema: YUP.object({
      firstName: YUP.string().required(
        "This field is required. Please enter the first name."
      ),
      middleName: YUP.string().required(
        "This field is required. Please enter father name."
      ),
      lastName: YUP.string().required(
        "This field is required. Please enter grandfather name."
      ),
      mobileNumber: YUP.string()
        .required("This field is required. Please enter mobile number.")
        .phone(
          "ET",
          true,
          "Invalid phone number. Use +251, or 251 or 09... etc. Note: phone numbers starting with 07 are invalid for the time being."
        ),
      email: YUP.string()
        .required("This field is required. Please enter email address.")
        .email("Invalid email address"),
      roleID: YUP.string().required(
        "This field is required. Please select user role."
      ),
      // institutionID:YUP.string().required("This field is required. Please select Institution.")
    }),

    onSubmit: (values) => {
      const userData = {
        first_name: values.firstName,
        middle_name: values.middleName,
        last_name: values.lastName,
        mobile_number: values.mobileNumber,
        password: (
          values.firstName +
          "." +
          values.lastName
        ).toLocaleLowerCase(),
        confirm_password: (
          values.firstName +
          "." +
          values.lastName
        ).toLocaleLowerCase(),
        email: values.email,
        roles: values.roleID,
        created_by: values.createdBy,
        updated_by: values.updatedBy,
        region_id: values.regionID,
        institution_id: values.institutionID,
      };

      createUser(userData);
      fetchUsers();
    },
  });

  const createUser = async (userData) => {
    //  console.log(companyData)
    setLoading(true);
    return await axios
      .post("users", userData)
      .then((res) => {
        console.log(res);
        setServerSuccessMsg(res.data.message);
        setServerErrorMsg(null);
        formik.resetForm();
        fetchUsers();
        setLoading(false);
      })
      .catch((errors) => {
        setServerErrorMsg(errors.response.data.message);
        setServerSuccessMsg(null);
      });
  };

  return (
    <Box m="0" width={"95%"}>
      <Header title="Create New User" subtitle="Manage users" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="First Name *"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="firstName"
                value={formik.values.firstName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.firstName && formik.errors.firstName ? (
                    <span style={helperTextStyle}>
                      {formik.errors.firstName}
                    </span>
                  ) : null
                }
              />
              <TextField
                label="Mobile Number *"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                    <span style={helperTextStyle}>
                      {formik.errors.mobileNumber}
                    </span>
                  ) : null
                }
              />
              {userInfo ? (
                userInfo.user.roles[0].name === "Super Admin" &&
                formik.values.roleID === 4 ? (
                  <FormControl sx={{ minWidth: "100%", paddingBottom: "5px" }}>
                    <InputLabel>Select Region *</InputLabel>
                    <Select
                      labelId="region_id"
                      id="region_id"
                      size="small"
                      color="info"
                      name="regionID"
                      value={formik.values.regionID}
                      onChange={formik.handleChange}
                      helperText={
                        formik.touched.regionID && formik.errors.regionID ? (
                          <span style={helperTextStyle}>
                            {formik.errors.regionID}
                          </span>
                        ) : null
                      }
                    >
                      <MenuItem value="">
                        <em>Not applicable</em>
                      </MenuItem>
                      {regions
                        ? regions.map((region) => (
                            <MenuItem value={region.id} key={region.id}>
                              {region.name}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                    <FormHelperText>
                      {formik.touched.regionID && formik.errors.regionID ? (
                        <span style={helperTextStyle}>
                          {formik.errors.regionID}
                        </span>
                      ) : null}
                    </FormHelperText>
                  </FormControl>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {userRole &&
              (userRole === "Regional Institutions Admin" ||
                userRole === "Federal Institutions Admin" ||
                userRole === "Super Admin") ? (
                ""
              ) : (
                <FormControl sx={{ minWidth: "100%", paddingBottom: "5px" }}>
                  <InputLabel>Select Institution</InputLabel>
                  <Select
                    labelId="institution_id"
                    id="institution_id"
                    size="small"
                    color="info"
                    name="institutionID"
                    value={formik.values.institutionID}
                    onChange={formik.handleChange}
                    helperText={
                      formik.touched.institutionID &&
                      formik.errors.institutionID ? (
                        <span style={helperTextStyle}>
                          {formik.errors.institutionID}
                        </span>
                      ) : null
                    }
                  >
                    {institutions
                      ? institutions.map((institution) => (
                          <MenuItem value={institution.id} key={institution.id}>
                            {institution.name}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                  <FormHelperText>
                    {formik.touched.institutionID &&
                    formik.errors.institutionID ? (
                      <span style={helperTextStyle}>
                        {formik.errors.institutionID}
                      </span>
                    ) : null}
                  </FormHelperText>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Middle Name *"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="middleName"
                value={formik.values.middleName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.middleName && formik.errors.middleName ? (
                    <span style={helperTextStyle}>
                      {formik.errors.middleName}
                    </span>
                  ) : null
                }
              />
              <TextField
                label="Email Address *"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.email && formik.errors.email ? (
                    <span style={helperTextStyle}>{formik.errors.email}</span>
                  ) : null
                }
              />

              {/* <Typography variant='body1' sx={{ paddingBottom:'10px' }}>User Role</Typography> */}
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Last Name *"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="lastName"
                value={formik.values.lastName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.lastName && formik.errors.lastName ? (
                    <span style={helperTextStyle}>
                      {formik.errors.lastName}
                    </span>
                  ) : null
                }
              />

              <FormControl sx={{ minWidth: "100%", paddingBottom: "30px" }}>
                <InputLabel>Select User Role *</InputLabel>
                <Select
                  labelId="user_role"
                  size="small"
                  id="user_role"
                  color="info"
                  name="roleID"
                  value={formik.values.roleID}
                  onChange={formik.handleChange}
                  helperText={
                    formik.touched.roleID && formik.errors.roleID ? (
                      <span style={helperTextStyle}>
                        {formik.errors.roleID}
                      </span>
                    ) : null
                  }
                >
                  {userRoles
                    ? userRoles.map((userRole) => (
                        <MenuItem value={userRole.role.id} key={userRole.id}>
                          {userRole.role.name}{" "}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                <FormHelperText>
                  {formik.touched.roleID && formik.errors.roleID ? (
                    <span style={helperTextStyle}>{formik.errors.roleID}</span>
                  ) : null}
                </FormHelperText>
              </FormControl>

              <Grid sx={{ paddingBottom: "20px" }} align="right">
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{ align: "right", textTransform: "none" }}
                  color="info"
                >
                  Save{" "}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </motion.span>
    </Box>
  );
};

export default CreateUser;