import { Alert, Box, Button, Grid, Link, Paper, TextField, Typography, useTheme } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import axios from '../../../axios/AxiosGlobal'
import DataTable from 'react-data-table-component'
import { useFormik } from 'formik';
import * as YUP from 'yup';
import { Stack } from '@mui/system'
import { tokens } from '../../../theme'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { UserContext } from '../../../contexts/UserContext'
import Header from '../AdminHeader'
import CreateUser from '../users/CreateUser'
import EditUser from '../users/EditUser'
import { UsersDataContext } from '../../../contexts/UsersDataContext';
import { motion } from 'framer-motion';
import { DraftsDataContext } from '../../../contexts/DraftsDataContext';
import CreateDraft from '../drafts/CreateDraft';
import EditDraft from '../drafts/EditDraft';

const DraftsTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 

    
    // User context
    const {userInfo, setUserInfo, userRole, setUserRole, setUserToken}=useContext(UserContext);
    const {
        drafts,
        setDrafts,
        filteredDrafts,
        setFilteredDrafts,
        searchDraft,
        setSearchDraft,
        draft,
        setDraft,
        showDraftAddForm,
        setShowDraftAddForm,
        showDraftEditForm,
        setShowDraftEditForm,
        serverErrorMsg,
        setServerErrorMsg,
        serverSuccessMsg,
        setServerSuccessMsg
    }=useContext(DraftsDataContext);

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


    // Show / Hide Add User Form
    const showAddDraftForm=(msg)=>{
        setShowDraftAddForm(!showDraftAddForm)
        setShowDraftEditForm(false);
    }

    const showEditDraftForm=(row)=>{
            setDraft(row)
            setShowDraftEditForm(true);
            setShowDraftAddForm(false);
            console.log(row)
    }

    const hideForm=()=>{
        setShowDraftEditForm(false);
        setShowDraftAddForm(false)
    }

    const columns=[
        {
            name:<Typography variant="h5" fontWeight="600">Title</Typography>,
            selector:(row)=><Typography variant="body1">{`${row.short_title.substr(0, 20)}`}</Typography>,
            sortable:true,
        },
        
        {
            name:<Typography variant="h5" fontWeight="600">Owning Institution</Typography>,
            selector:(row)=><Typography variant="body1">{row.institution.name}</Typography>,
            sortable:true,
        },
        {
            name:<Typography variant="h5" fontWeight="600">Created By</Typography>,
            selector:(row)=><Typography variant="body1">{row.created_by}</Typography>,
            sortable:true,
        },
        {
            name:<Typography variant="h5" fontWeight="600">Updated By</Typography>,
            selector:(row)=><Typography variant="body1">{row.updated_by}</Typography>,
            sortable:true,
        },
        
        {
            name:<Typography variant="h5" fontWeight="600">Actions</Typography>,
            selector:(row)=>{
                return (
                    <Stack spacing={0} direction="row">
                        <Button variant="Link" size="small" color="secondary" sx={{ textTransform:"none" }} key={row.id} onClick={()=>showEditDraftForm(row)}><ModeEditIcon fontSize="small" color="secondary" /></Button>
                        <Button variant="Link" size="small" sx={{textTransform:"none"}} onClick={()=>alert("You deleted user ID: "+row.id)}><DeleteIcon fontSize="small" sx={{ color:colors.dangerColor[200] }} /></Button>
                        {/* <Button variant="contained" size="small" color="warning" sx={{textTransform:"none"}} onClick={()=>alert("You deleted user ID: "+row.id)}>Deactivate Account</Button> */}
                    </Stack>
                )
            },
        },
    ]

  return (
    <Box width={'95%'}>
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
    {
        showDraftAddForm && (
          <CreateDraft />
        )
    } 
    {
      showDraftEditForm && (
        <EditDraft />
      )
    }
     <Paper elevation={1} sx={{ marginTop:"10px", marginBottom:"350px"}}>
       <DataTable 
        columns={columns} 
        data={filteredDrafts}
        pagination
        // selectableRows
        selectableRowsHighlight
        // highlightOnHover
        subHeader
        subHeaderComponent={
            <Box width="100%" sx={{ display:"flex", justifyContent:"space-between", direction:"row" }}>
              <Box width="30%" >
                <TextField 
                label="Search..." 
                variant="outlined"
                size='small'
                color='info'
                fullWidth
                value={searchDraft}
                onChange={(e)=>setSearchDraft(e.target.value)}
                />
              </Box>
              <Box>
                {
                    showDraftAddForm ? (
                        <Button 
                        variant="contained" 
                        size="small" 
                        color="secondary" 
                        sx={{ textTransform:"none" }}
                        onClick={hideForm}
                    >
                        <VisibilityOffIcon /> Hide Form    
                    </Button>
                    ):( showDraftEditForm ? (
                        <Button 
                            variant="contained" 
                            size="small" 
                            color="secondary" 
                            sx={{ textTransform:"none" }}
                            onClick={hideForm}
                        >
                            <VisibilityOffIcon /> Hide Form    
                        </Button>
                    ): (
                        <Button 
                            variant="contained" 
                            size="small" 
                            color="secondary" 
                            sx={{ textTransform:"none" }}
                            onClick={showAddDraftForm}
                            >
                       <AddIcon /> Add New Draft
                    </Button>
                    )
                )
                }
              </Box>
            </Box>
        }
        />
 </Paper>
</Box> 
  )
}

export default DraftsTable