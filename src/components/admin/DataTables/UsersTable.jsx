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

const UsersTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 

    
    // User context
    const {userInfo, setUserInfo, userRole, setUserRole, setUserToken}=useContext(UserContext);
    const {
        users, setUsers, user, setUser, filteredUsers,
        searchUser,setSearchUser, showUserAddForm, 
        setShowUserAddForm, 
        showUserEditForm, 
        setShowUserEditForm,
        serverErrorMsg,
        setServerErrorMsg,
        serverSuccessMsg,
        setServerSuccessMsg,
    }=useContext(UsersDataContext);

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

    const helperTextStyle={
    color:'red',
    fontWeight:'400',
    fontSize:'15px'
    }

    // Show / Hide Add User Form
    const showAddUserForm=(msg)=>{
        setShowUserAddForm(!showUserAddForm)
        setShowUserEditForm(false);
    }

    const showEditUserForm=(userRow)=>{
            setUser(userRow)
            setShowUserEditForm(true);
            setShowUserAddForm(false);
            console.log(userRow)
    }

    const hideForm=()=>{
        setShowUserEditForm(false);
        setShowUserAddForm(false)
    }

    const columns=[
        {
            name:<Typography variant="h5" fontWeight="600">Full Name</Typography>,
            selector:(row)=><Typography variant="body1">{`${row.first_name} ${row.middle_name}`}</Typography>,
            sortable:true,
        },
        
        {
            name:<Typography variant="h5" fontWeight="600">Mobile</Typography>,
            selector:(row)=><Typography variant="body1">{row.mobile_number}</Typography>,
            sortable:true,
        },
        {
            name:<Typography variant="h5" fontWeight="600">Institution</Typography>,
            selector:(row)=><Typography variant="body1">{row.institution_id}</Typography>,
            sortable:true,
        },
        {
            name:<Typography variant="h5" fontWeight="600">Region</Typography>,
            selector:(row)=><Typography variant="body1">{row.region_id}</Typography>,
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
            name:<Typography variant="h5" fontWeight="600">Role</Typography>,
            selector:(row)=>row.roles.map((role)=>(
                <li style={{ listStyleType:"none" }}>
                    <Typography variant="body1">{role.name}</Typography>
                </li>
            ))
        },
        {
            name:<Typography variant="h5" fontWeight="600">Actions</Typography>,
            selector:(row)=>{
                return (
                    <Stack spacing={0} direction="row">
                        <Button variant="Link" size="small" color="secondary" sx={{ textTransform:"none" }} key={row.id} onClick={()=>showEditUserForm(row)}><ModeEditIcon fontSize="small" color="secondary" /></Button>
                        <Button variant="Link" size="small" sx={{textTransform:"none"}} onClick={()=>alert("You deleted user ID: "+row.id)}><DeleteIcon fontSize="small" sx={{ color:colors.dangerColor[200] }} /></Button>
                        {/* <Button variant="contained" size="small" color="warning" sx={{textTransform:"none"}} onClick={()=>alert("You deleted user ID: "+row.id)}>Deactivate Account</Button> */}
                    </Stack>
                )
            },
        },
    ]

  return (
    <Box m='0 20px' width={'95%'}>
    <Header title="Users" subtitle="Manage Users" />

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
        showUserAddForm && (
          <CreateUser users={users} setUsers={setUsers} />
        )
    } 
    {
      showUserEditForm && (
        <EditUser />
      )
    }
     <Paper elevation={1} sx={{ marginTop:"10px", marginBottom:"350px"}}>
       <DataTable 
        columns={columns} 
        data={filteredUsers}
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
                value={searchUser}
                onChange={(e)=>setSearchUser(e.target.value)}
                />
              </Box>
              <Box>
                {
                    showUserAddForm ? (
                        <Button 
                        variant="contained" 
                        size="small" 
                        color="secondary" 
                        sx={{ textTransform:"none" }}
                        onClick={hideForm}
                    >
                        <VisibilityOffIcon /> Hide Form    
                    </Button>
                    ):( showUserEditForm ? (
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
                            onClick={showAddUserForm}
                            >
                       <AddIcon /> Add New User
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

export default UsersTable