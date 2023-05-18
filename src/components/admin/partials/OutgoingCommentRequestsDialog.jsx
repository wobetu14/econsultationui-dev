
import React, { useEffect, useState } from 'react'
import axios from '../../../axios/AxiosGlobal'
import { motion } from 'framer-motion';
import { 
     Autocomplete,
     Button,
     Dialog, 
     DialogContent, 
     DialogContentText, 
     DialogTitle,
     Stack,
     TextField,
     Typography, 
     useTheme, Box, DialogActions, Grid, Alert
    } from '@mui/material'
import { tokens } from '../../../theme';
import { useFormik } from 'formik';

const OutgoingCommentRequestsDialog = ({
    draftInfo, 
    title, 
    setServerSuccessMsg, 
    setServerErrorMsg, 
    serverSuccessMsg,
    serverErrorMsg,
    openDialog, 
    setOpenDialog,
    showDialog
}) => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData]=useState([]); 

    const [institutions, setInstitutions]=useState([]);
    const [selectedInstitutions, setSelectedInstitutions]=useState([]);

    // Set list of email address for invitation
    const [peopleEmail, setPeopleEmail]=useState([]);
    // const [instIDs, setInsIDs]=useState([]);

    const helperTextStyle={
        color:'red',
        fontWeight:'400',
        fontSize:'15px'
       }

       const errorStyle={
        color:'red',
        fontWeight:'400',
        fontSize:'18px'
        }
    
        const successStyle={
        color:'green',
        fontWeight:'400',
        fontSize:'18px'
        }

    React.useEffect(()=>{
        fetchInstitutions();
        // getInstitutionsID();
     }, [selectedInstitutions])

   /*   const getInstitutionsID=()=>{
         if(selectedInstitutions.length>0){
            selectedInstitutions.map((selectedInstitution)=>(
                setInsIDs([...instIDs, selectedInstitution.id])
            ))
         }
     } */

     const fetchInstitutions = async() =>{
        try{
          const res = await  axios.get('public/institutions')
          setInstitutions(res.data.data.data);
        } catch(error){
            console.log(error);
         }
      }

     const formikAcceptanceForm=useFormik({
        initialValues:{
            draft_id:draftInfo ? draftInfo.id:"",
            institutions: selectedInstitutions ? selectedInstitutions.map((selectedInstitution)=>(
                selectedInstitution.id
            )):[], 
            draftOpeningDate:"",
            draftClosingDate:"",
            acceptanceRemark:""
        },

      onSubmit:(values)=>{
        const requestData={
            draft_id:values.draft_id,
            institutions:values.institutions,
            comment_opening_date:values.draftOpeningDate,
            comment_closing_date:values.draftClosingDate,
            acceptance_remark:values.acceptanceRemark,
        };
    
        acceptCommentOpening(requestData);
      }
    }); 

    const acceptCommentOpening=async (requestData) => {
        return await axios.post(`approve-comment-opening/draft/${draftInfo.id}`, requestData)
        .then(res => {
          setServerSuccessMsg(res.data.message);
          setServerErrorMsg(null)
        })
        .catch(errors =>{
           setServerErrorMsg(errors.response.data.message);
           setServerSuccessMsg(null) 
        }) 
       }

     const formikInviteInstitutionForm=useFormik({
        initialValues:{
            draft_id:draftInfo ? draftInfo.id:"",
            institutions: selectedInstitutions ? selectedInstitutions.map((selectedInstitution)=>(
                selectedInstitution.id
            )):[], 
            invitationRemark:""
        },

      onSubmit:(values)=>{
        const requestData={
            draft_id:values.draft_id,
            institutions:values.institutions,
            invitation_remark:values.invitationRemark
        };
    
        inviteInstitutions(requestData);
      }
    }); 
 
 
     const inviteInstitutions=async (requestData) => {
         console.log(requestData)
            return await axios.post('request-institution-for-comment', requestData)
            .then(res => {
                // console.log(res.data.message)
                setServerSuccessMsg(res.data.message);
                setServerErrorMsg(null);
                // setOpenDialog(false);
            })
            .catch(errors =>{
                setServerErrorMsg(errors.response.data.message);
                setServerSuccessMsg(null) 
            }) 
       }

       const formikInvitePeopleForm=useFormik({
        initialValues:{
            draft_id:draftInfo.id,
            emailAddresses:peopleEmail,
            invitationRemark:""
        },

      onSubmit:(values)=>{
        const requestData={
            draft_id:values.draft_id,
            email:values.emailAddresses,
            invitation_remark:values.invitationRemark
        };
    
        invitePeople(requestData);
      }
    }); 

    const invitePeople=async (requestData) => {
        console.log(requestData)

        /* return await axios.post('request-institution-for-comment', requestData)
           .then(res => {
               setServerSuccessMsg(res.data.message);
               setServerErrorMsg(null);
           })
           .catch(errors =>{
               setServerErrorMsg(errors.response.data.message);
               setServerSuccessMsg(null) 
           }) */ 
      }
    
  return (
    <Dialog 
    //   fullScreen
      open={openDialog}
     >
         <DialogTitle>
             <Typography variant="h5" fontWeight="600">
                {title}
             </Typography>
         </DialogTitle>
         <DialogContent>
             <DialogContentText>

             <Grid align='center' sx={{ paddingBottom:"5px", paddingTop:'5px' }}>
            <motion.span
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 0.3 }}
                > 
                <Typography variant='h1'>
                    {serverSuccessMsg ? <Alert severity='success' style={successStyle}>{serverSuccessMsg}</Alert>:null}
                </Typography>
                
                <Typography variant='h1'>
                {serverErrorMsg ? <Alert severity='error' style={errorStyle}>{serverErrorMsg}</Alert>:null}
                </Typography> 
            </motion.span>
        </Grid>

                <form style={{ marginBottom:"30px" }} onSubmit={formikAcceptanceForm.handleSubmit}>
                    <Typography variant='h5' fontWeight="600">
                        Set draft opening and closing date
                    </Typography>
                    <TextField 
                        // label="Draft Openining Date" 
                        type="date"
                        variant='outlined'
                        size='small' 
                        fullWidth
                        rows={4}
                        sx={{ paddingBottom:"10px" }}
                        color="info"
                        name='draftOpeningDate'
                        value={formikAcceptanceForm.values.draftOpeningDate}
                        onBlur={formikAcceptanceForm.handleBlur}
                        onChange={formikAcceptanceForm.handleChange}
                        helperText={formikAcceptanceForm.touched.draftOpeningDate && formikAcceptanceForm.errors.draftOpeningDate ? <span style={helperTextStyle}>{formikAcceptanceForm.errors.draftOpeningDate}</span>:null}
                        />
                    <TextField 
                        // label="Draft Closing Date" 
                        type="date"
                        variant='outlined'
                        size='small' 
                        fullWidth
                        rows={4}
                        sx={{ paddingBottom:"10px" }}
                        color="info"
                        name='draftClosingDate'
                        value={formikAcceptanceForm.values.draftClosingDate}
                        onBlur={formikAcceptanceForm.handleBlur}
                        onChange={formikAcceptanceForm.handleChange}
                        helperText={formikAcceptanceForm.touched.draftClosingDate && formikAcceptanceForm.errors.draftClosingDate ? <span style={helperTextStyle}>{formikAcceptanceForm.errors.draftClosingDate}</span>:null}
                        />

                        <TextField 
                        label="Write a remark (not mandatory)" 
                        variant='outlined'
                        size='small' 
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ paddingBottom:"10px" }}
                        color="info"
                        name='acceptanceRemark'
                        value={formikAcceptanceForm.values.acceptanceRemark}
                        onBlur={formikAcceptanceForm.handleBlur}
                        onChange={formikAcceptanceForm.handleChange}
                        helperText={formikAcceptanceForm.touched.acceptanceRemark && formikAcceptanceForm.errors.acceptanceRemark ? <span style={helperTextStyle}>{formikAcceptanceForm.errors.acceptanceRemark}</span>:null}
                        />
                    <Button 
                        variant="contained" color='secondary'
                        size='small'
                        type="submit"
                        sx={{ textTransform:"none" }}
                    >
                        <Typography variant="body2">
                            Accept and Open Document
                        </Typography>
                    </Button>
            </form>
            
            <form onSubmit={formikInviteInstitutionForm.handleSubmit} style={{ paddingBottom:"30px" }}>
                    <Typography variant="subtitle1" fontWeight="600">
                        Invite Institutions
                    </Typography>
                {/* <Stack spacing={2} > */}
            <Autocomplete
                multiple
                id="tags-standard"
                freeSolo
                autoSelect
                color="info"
                sx={{ paddingBottom:"10px" }}
                options={institutions}
                getOptionLabel={(option) => option.name}
                onChange={(e,value)=>setSelectedInstitutions(value)}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Select Institutions"
                    placeholder="Institutions"
                    value={(option)=>option.name}
                />
                )}
            />

                    <TextField 
                        label="Write a remark (not mandatory)" 
                        variant='outlined'
                        size='small' 
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ paddingBottom:"5px" }}
                        color="info"
                        name='invitationRemark'
                        value={formikInviteInstitutionForm.values.invitationRemark}
                        onBlur={formikInviteInstitutionForm.handleBlur}
                        onChange={formikInviteInstitutionForm.handleChange}
                        // helperText={formik.touched.shortTitle && formik.errors.shortTitle ? <span style={helperTextStyle}>{formik.errors.shortTitle}</span>:null}
                        />

            <Box>
                <Button 
                    size='small' 
                    variant="contained" 
                    color="secondary" 
                    type='submit'
                    sx={{ textTransform:"none", marginRight:"5px" }}
                    onClick={inviteInstitutions}
                    >  
                    Send Invitation
                </Button>
            </Box> 
        {/* </Stack> */}
    </form>

        <form onSubmit={formikInvitePeopleForm.handleSubmit}>
            <Typography variant="subtitle1" fontWeight="600">
                Invite People
                {
                    peopleEmail.length>0 ? (
                        peopleEmail.map((email)=><h3>{email}</h3>)
                    ):""
                }
            </Typography>
                {/* <Stack spacing={2} sx={{ width: 500 }}> */}
            <Autocomplete
                multiple
                id="tags-standard"
                freeSolo
                autoSelect
                color="info"
                sx={{ paddingBottom:"10px" }}
                options={peopleEmail}
                getOptionLabel={(option) => option}
                onChange={(e,value)=>setPeopleEmail(value)}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Enter email addresses"
                    value={(option)=>option}
                />
                )}
            />

                    <TextField 
                        label="Write a remark (not mandatory)" 
                        variant='outlined'
                        size='small' 
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ paddingBottom:"5px" }}
                        color="info"
                        name='invitationRemark'
                        value={formikInvitePeopleForm.values.invitationRemark}
                        onBlur={formikInvitePeopleForm.handleBlur}
                        onChange={formikInvitePeopleForm.handleChange}
                        // helperText={formik.touched.shortTitle && formik.errors.shortTitle ? <span style={helperTextStyle}>{formik.errors.shortTitle}</span>:null}
                        />

            <Box>
                <Button 
                    size='small' 
                    variant="contained" 
                    color="secondary" 
                    type='submit'
                    sx={{ textTransform:"none", marginRight:"5px" }}
                    onClick={invitePeople}
                    >  
                     Send Invitation
                </Button>
            </Box> 
        {/* </Stack> */}
    </form>

    </DialogContentText>
    <DialogActions>
        <Button
            onClick={()=>setOpenDialog(false)}
            variant="contained"
            size="small"
            sx={{ textTransform:"none", backgroundColor:colors.dangerColor[200], color:colors.grey[300] }}
            >
                Close
            </Button>
    </DialogActions>
</DialogContent>  
     </Dialog>
  )
}

export default OutgoingCommentRequestsDialog;

