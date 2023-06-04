import {Alert, Avatar, Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, Paper, TextField, Typography, useTheme } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { tokens, useMode } from '../../../theme';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as YUP from 'yup';
import {useContext, useState} from 'react';
import axios from '../../../axios/AxiosGlobal';
import { motion } from 'framer-motion';

import { UserContext } from '../../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
   const theme=useTheme();
   const colors=tokens(theme.palette.mode);
   const {t}=useTranslation();

   const navigate=useNavigate()
   const {userInfo, setUserInfo, setUserRole, setUserToken}=useContext(UserContext);

   const [loggedIn, setLoggedIn]=useState(false);
   const [serverError, setServerError]=useState(null)

   const [serverErrorMsg, setServerErrorMsg]=useState(null);
   const [serverSuccessMsg, setServerSuccessMsg]=useState(null);

   const [loading, setLoading]=useState(false);

   const errorStyle={
    color:'red',
    fontWeight:'bold'
  }

  const successStyle={
    color:'green',
    fontWeight:'bold'
  }

 const helperTextStyle={
  color:'red',
  fontWeight:'400',
  fontSize:'15px'
 }


  const formikResetPassword=useFormik({
    initialValues:{
        emailAddress:"",
        password:"",
        confirmPassword:"",
        passwordResetCode:""
    },

validationSchema:YUP.object({
    emailAddress:YUP.string().required("This field is required. Please enter your email address."),
    password:YUP.string().required("This field is required. Please enter your new password."),
    passwordResetCode:YUP.string().required("This field is required. Please enter your reset code."),
    confirmPassword:YUP.string().required("This field is required. Please re-enter password to confirm.")
    .oneOf([YUP.ref('password'), null], "Confirmation password didn't match.")
  }),

  onSubmit:(values)=>{
    const userData={
        email:values.emailAddress,
        password:values.password,
        confirm_password:values.confirmPassword,
        token:values.passwordResetCode,
    };

   resetPassword(userData);
  }
}); 
    
const resetPassword=async (userData) => {
     setLoading(true);
    return await axios.post('reset-password', userData)
    .then(res => {
      console.log(res.data)
      setServerSuccessMsg(res.data.message);
      setServerErrorMsg(null);
      formikResetPassword.resetForm();
      setLoading(false);
    })
    .catch(errors =>{
      setServerErrorMsg(errors.response.data.message);
      setServerSuccessMsg(null);
      setLoading(false);
    }) 
   }

  return (
    <Box sx={{ marginTop:"100px" }}>
      <motion.span
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ duration: 0.3 }}
      >
     
      <Paper
        elevation={1} 
        sx={{ padding:"20px", margin:"20px auto", width:"600px", backgroundColor:colors.grey[200] }}
      >
        <Grid align="center">
          <Typography variant='h5' sx={{ fontWeight:600, paddingBottom:'20px', color:colors.headerText[100] }}>
            {t('reset_password')}
          </Typography>
          <Typography variant='body1'>
            {t('password_reset_message')}
          </Typography>

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
                    {
                        loading ? (<CircularProgress color='info'/>):null
                    }
                </motion.span>
            </Grid>

        </Grid>

        <Grid align='center'>
            <p>
            {serverError ? <Alert severity='error' style={errorStyle}>{serverError}</Alert>:null}
            </p> 

            <p style={successStyle}>
              
            </p>
        </Grid>

        <form onSubmit={formikResetPassword.handleSubmit}>
            <Grid>
            <TextField 
              label={t('email_address')} 
              variant='outlined' 
              placeholder={t('enter_email_address')}
              fullWidth
              size='small'
              sx={{ paddingBottom:"10px" }}
              color="info"

              name='emailAddress'
              value={formikResetPassword.emailAddress}
              onChange={formikResetPassword.handleChange}
              helperText={formikResetPassword.touched.emailAddress && formikResetPassword.errors.emailAddress ? <span style={helperTextStyle}>{formikResetPassword.errors.emailAddress}</span>:null}
            />

            <TextField 
              label={t('password')} 
              variant='outlined' 
              placeholder={t('enter_email_address')}
              fullWidth
              size='small'
              sx={{ paddingBottom:"10px" }}
              color="info"

              name='password'
              value={formikResetPassword.password}
              onChange={formikResetPassword.handleChange}
              helperText={formikResetPassword.touched.password && formikResetPassword.errors.password ? <span style={helperTextStyle}>{formikResetPassword.errors.password}</span>:null}
            />

            <TextField 
              label={t('confirm_password')} 
              variant='outlined' 
              placeholder={t('confirm_password')}
              fullWidth
              size='small'
              sx={{ paddingBottom:"10px" }}
              color="info"

              name='confirmPassword'
              value={formikResetPassword.confirmPassword}
              onChange={formikResetPassword.handleChange}
              helperText={formikResetPassword.touched.confirmPassword && formikResetPassword.errors.confirmPassword ? <span style={helperTextStyle}>{formikResetPassword.errors.confirmPassword}</span>:null}
            />

            <TextField 
              label={t('password_reset_code')} 
              variant='outlined' 
              placeholder={t('password_reset_code')} 
              fullWidth
              size='small'
              sx={{ paddingBottom:"10px" }}
              color="info"

              name='passwordResetCode'
              value={formikResetPassword.passwordResetCode}
              onChange={formikResetPassword.handleChange}
              helperText={formikResetPassword.touched.passwordResetCode && formikResetPassword.errors.passwordResetCode ? <span style={helperTextStyle}>{formikResetPassword.errors.passwordResetCode}</span>:null}
            />
            
            </Grid>

            <Grid 
              sx={{ paddingBottom:"5px" }}
            >  
                <Button type='submit' variant='contained'
                    color="info"
                fullWidth
                    sx={{ backgroundColor:colors.brandColor[200], color:colors.grey[300] }}
                >
                    {t('send_code')}
                </Button>
            </Grid>
        </form>
    </Paper>
</motion.span>
    </Box>
  )
}

export default ResetPassword