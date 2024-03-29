import {
  Typography,
  Button,
  FormControlLabel,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  FormHelperText,
  MenuItem,
  RadioGroup,
  Radio,
  Autocomplete,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useState, useEffect, useContext } from "react";
import { tokens } from "../../../theme";
import Header from "../AdminHeader";
import axios from "../../../axios/AxiosGlobal";
import { motion } from "framer-motion";
import { UserContext } from "../../../contexts/UserContext";
import { DraftsDataContext } from "../../../contexts/DraftsDataContext";

const EditDraft = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [institutions, setInstitutions] = useState(null);
  const [lawCategories, setLawCategories] = useState(null);
  const [sectors, setSectors] = useState(null);

  // User context
  const { userInfo} =
    useContext(UserContext);

  const {
    drafts,
    draft,
    fetchDrafts,
    setShowDraftEditForm,
    setServerErrorMsg,
    setServerSuccessMsg,
    setLoading,
  } = useContext(DraftsDataContext);

  const [tagLists, setTagLists] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);

  const helperTextStyle = {
    color: "red",
    fontWeight: "400",
    fontSize: "15px",
  };

  useEffect(() => {
    fetchInstitutions();
  }, [institutions]);

  useEffect(() => {
    fetchLawCategories();
    console.log("Hello from edit draft form");
    console.log(draft);
  }, [lawCategories]);

  useEffect(() => {
    fetchSectors();
  }, [sectors]);

  useEffect(() => {
    fetchDrafts();
  }, [drafts]);

  const fetchInstitutions = async () => {
    return await axios
      .get("institutions")
      .then((res) => res.data.data)
      .then((res) => {
        setInstitutions(res.data);
      })
      .catch((error) => {
        console.log(error.response.message);
      });
  };

  const fetchLawCategories = async () => {
    return await axios
      .get("law-categories")
      .then((res) => res.data.data)
      .then((res) => {
        setLawCategories(res.data);
      })
      .catch((error) => {
        console.log(error.response.message);
      });
  };

  const fetchSectors = async () => {
    return await axios
      .get("sectors")
      .then((res) => res.data.data)
      .then((res) => {
        setSectors(res.data);
      })
      .catch((error) => {
        console.log(error.response.message);
      });
  };

  const formik = useFormik({
    initialValues: {
      institutionID: draft ? draft.institution.id : "",
      shortTitle: draft ? draft.short_title : "",
      lawCategoryId: draft ? draft.law_category_id : "",
      draftStatusId: draft ? draft.draft_status_id : "",
      sectors: draft.sector.length > 0 ? draft.sector.map((sec) => sec) : [],
      file: null,
      active: draft ? draft.active : "",
      isPrivate: draft ? draft.is_private : "",
      tags: draft ? draft.tags : [],
      baseLegalReference: draft ? draft.base_legal_reference : "",
      definition: draft ? draft.definition : "",
      scope: draft ? draft.scope : "",
      mainProvision: draft ? draft.main_provision : "",
      summary: draft ? draft.summary : "",
      amendedLaws: draft ? draft.amended_laws : "",
      repealedLaws: draft ? draft.repealed_laws : "",
      transitoryProvision: draft ? draft.transitory_provision : "",
      updatedBy: userInfo.user.updated_by,
    },

    onSubmit: (values) => {
      const draftsData = {
        institution_id: values.institutionID,
        short_title: values.shortTitle,
        law_category_id: values.lawCategoryId,
        draft_status_id: values.draftStatusId,
        sectors:
          selectedSectors.length > 0
            ? selectedSectors.map((sector) => sector)
            : [],
        comment_opening_date: values.openingDate,
        comment_closing_date: values.closingDate,
        file: values.file,
        slug: values.slug,
        // active:values.active,
        is_private: values.isPrivate,
        parent_id: values.parentId,
        tags:
          tagLists.length > 0
            ? tagLists.map((tagList) => tagList)
            : values.tags,
        note_id: values.noteId,
        base_legal_reference: values.baseLegalReference,
        definition: values.definition,
        scope: values.scope,
        main_provision: values.mainProvision,
        summary: values.summary,
        amended_laws: values.amendedLaws,
        repealed_laws: values.repealedLaws,
        transitory_provision: values.transitoryProvision,
        comment_request_description: values.summary,
        comment_summary: values.summary,
        updated_by: values.updatedBy,
        _method: "put",
      };

      updateDraftDocument(draftsData);
    },
  });

  const updateDraftDocument = async (draftsData) => {
    //  console.log(companyData)
    setLoading(true);
    return await axios
      .post(`drafts/${draft.id}`, draftsData)
      .then((res) => {
        console.log(res.data);
        setServerSuccessMsg(res.data.message);
        setServerErrorMsg(null);
        setShowDraftEditForm(false);
        formik.resetForm();
        fetchDrafts();
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
      <Header title="Edit Drfat Document Information" subtitle="" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Short title"
                variant="outlined"
                size="small"
                fullWidth
                rows={4}
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="shortTitle"
                value={formik.values.shortTitle}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.shortTitle && formik.errors.shortTitle ? (
                    <span style={helperTextStyle}>
                      {formik.errors.shortTitle}
                    </span>
                  ) : null
                }
              />

              <Typography variant="body1" sx={{ paddingBottom: "10px" }}>
                Law Category
              </Typography>
              <FormControl sx={{ minWidth: "100%", paddingBottom: "30px" }}>
                <InputLabel>Select Law Category</InputLabel>
                <Select
                  labelId="law_category_Id"
                  id="law_category_Id"
                  size="small"
                  placeholder="Select law category"
                  color="info"
                  name="lawCategoryId"
                  value={formik.values.lawCategoryId}
                  onChange={formik.handleChange}
                  helperText={
                    formik.touched.lawCategoryId &&
                    formik.errors.lawCategoryId ? (
                      <span style={helperTextStyle}>
                        {formik.errors.lawCategoryId}
                      </span>
                    ) : null
                  }
                >
                  {lawCategories
                    ? lawCategories.map((lawCategory) => (
                        <MenuItem value={lawCategory.id} key={lawCategory.id}>
                          {lawCategory.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                <FormHelperText>
                  {formik.touched.lawCategoryId &&
                  formik.errors.lawCategoryId ? (
                    <span style={helperTextStyle}>
                      {formik.errors.lawCategoryId}
                    </span>
                  ) : null}
                </FormHelperText>
              </FormControl>

              <Typography variant="body1" sx={{ paddingBottom: "10px" }}>
                Economic Sector
              </Typography>
              <Autocomplete
                multiple
                id="tags-standard"
                color="info"
                size="small"
                sx={{ paddingBottom: "10px" }}
                options={sectors ? sectors : []}
                getOptionLabel={(option) => option.name}
                onChange={(e, value) => setSelectedSectors(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select sectors"
                    placeholder="Sectors "
                    name="sectors"
                    value={formik.values.sectors.map((sec) => sec)}
                  />
                )}
              />
              <Typography variant="body1" sx={{ paddingBottom: "10px" }}>
                Document Access
              </Typography>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="isPrivate"
                size="small"
                value={formik.values.isPrivate}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Private"
                />
              </RadioGroup>

              <Autocomplete
                multiple
                id="tags-standard"
                freeSolo
                autoSelect
                color="info"
                sx={{ paddingBottom: "10px" }}
                options={tagLists}
                getOptionLabel={(option) => option}
                onChange={(e, value) => setTagLists(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="List of tags"
                    name="tags"
                    value={draft ? draft.tags : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Base Legal Reference"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="baseLegalReference"
                value={formik.values.baseLegalReference}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.baseLegalReference &&
                  formik.errors.baseLegalReference ? (
                    <span style={helperTextStyle}>
                      {formik.errors.baseLegalReference}
                    </span>
                  ) : null
                }
              />

              <TextField
                label="Definition"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="definition"
                value={formik.values.definition}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.definition && formik.errors.definition ? (
                    <span style={helperTextStyle}>
                      {formik.errors.definition}
                    </span>
                  ) : null
                }
              />

              <TextField
                label="Scope"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="scope"
                value={formik.values.scope}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.scope && formik.errors.scope ? (
                    <span style={helperTextStyle}>{formik.errors.scope}</span>
                  ) : null
                }
              />

              <TextField
                label="Main Provision"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="mainProvision"
                value={formik.values.mainProvision}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.mainProvision &&
                  formik.errors.mainProvision ? (
                    <span style={helperTextStyle}>
                      {formik.errors.mainProvision}
                    </span>
                  ) : null
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Summary"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="summary"
                value={formik.values.summary}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.summary && formik.errors.summary ? (
                    <span style={helperTextStyle}>{formik.errors.summary}</span>
                  ) : null
                }
              />
              <TextField
                label="Amended Laws"
                variant="outlined"
                size="small"
                multiline
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="amendedLaws"
                value={formik.values.amendedLaws}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.amendedLaws && formik.errors.amendedLaws ? (
                    <span style={helperTextStyle}>
                      {formik.errors.amendedLaws}
                    </span>
                  ) : null
                }
              />

              <TextField
                label="Repealed Laws"
                variant="outlined"
                size="small"
                multiline
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="repealedLaws"
                value={formik.values.repealedLaws}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.repealedLaws && formik.errors.repealedLaws ? (
                    <span style={helperTextStyle}>
                      {formik.errors.repealedLaws}
                    </span>
                  ) : null
                }
              />

              <TextField
                label="Transitory Provision"
                variant="outlined"
                size="small"
                multiline
                rows={4}
                fullWidth
                sx={{ paddingBottom: "30px" }}
                color="info"
                name="transitoryProvision"
                value={formik.values.transitoryProvision}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                helperText={
                  formik.touched.transitoryProvision &&
                  formik.errors.transitoryProvision ? (
                    <span style={helperTextStyle}>
                      {formik.errors.transitoryProvision}
                    </span>
                  ) : null
                }
              />

              <Typography variant="body1" sx={{ paddingBottom: "10px" }}>
                <strong>Attachement:</strong>
                Please attach the draft document file. (Only .doc or .docx files
                are allowed.)
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                sx={{ paddingBottom: "20px" }}
                color="info"
                type="file"
                name="file"
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.setFieldValue("file", e.target.files[0]);
                }}
                helperText={
                  formik.touched.file && formik.errors.file ? (
                    <span style={helperTextStyle}>{formik.errors.file}</span>
                  ) : null
                }
              />

              <Button
                color="secondary"
                size="small"
                href={draft ? draft.file : ""}
                target="_blank"
                sx={{ textTransform: "none" }}
              >
                Download previous file
              </Button>

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
                  Save Changes{" "}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </motion.span>
    </Box>
  );
};

export default EditDraft;