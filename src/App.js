import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Home from "./components/guest/Home";
import About from "./components/guest/About";
import Login from "./components/guest/auth/Login";
import GuestSignup from "./components/guest/auth/GuestSignup";
import { UserContext } from "./contexts/UserContext";
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Users from "./components/admin/users/Users";
import HelpCenter from "./components/guest/HelpCenter";
import { PageNotFound } from "./PageNotFound";
import Regions from "./components/admin/regions/Regions";
import Sectors from "./components/admin/sectors/Sectors";
import Drafts from "./components/admin/drafts/Drafts";
import CreateRegion from "./components/admin/regions/CreateRegion";
import CreateSector from "./components/admin/sectors/CreateSector";
import CreateDraft from "./components/admin/drafts/CreateDraft";
import Institutions from "./components/admin/institutions/Institutions";
import CreateInstitution from "./components/admin/institutions/CreateInstitution";
import CreateUser from "./components/admin/users/CreateUser";
import DocumentLayout from "./components/guest/DocumentLayout";
import DocumentDetailView from "./components/guest/DocumentDetailView";
import { AccessRestricted } from "./AccessRestricted";
import UserProfile from "./components/admin/users/UserProfile";
import DraftApprovalRequest from "./components/admin/drafts/DraftApprovalRequest";
import ExternalCommentRequests from "./components/admin/drafts/ExternalCommentRequests";
import ExternalRequestsPreview from "./components/admin/drafts/ExternalRequestsPreview";

import UsersTable from "./components/admin/DataTables/UsersTable";
import Reports from "./components/admin/Reports";
import DocumentDetails from "./components/admin/drafts/DocumentDetails";
import AccountActivation from "./components/guest/AccountActivation";
import CommenterLayout from "./layouts/CommenterLayout";
import CommenterDashboard from "./components/guest/CommenterDashboard";
import DraftAssignments from "./components/admin/drafts/DraftAssignments";
import CommentReflections from "./components/admin/drafts/CommentReflections";
import ExternalRequestDetails from "./components/admin/drafts/external_requests/ExternalRequestDetails";
import InvitedDrafts from "./components/admin/drafts/InvitedDrafts";
import RedirectCommentInvitation from "./components/admin/drafts/RedirectCommentInvitation";
import ResetPasswordProvideEmail from "./components/guest/auth/ResetPasswordProvideEmail";
import ResetPassword from "./components/guest/auth/ResetPassword";
import DraftInvitationCheckpoint from "./components/guest/auth/DraftInvitationCheckpoint";
import AssignedToComment from "./components/admin/drafts/AssignedToComment";

function App() {
  const { t } = useTranslation();
  const [theme, colorMode] = useMode();

  const { userRole } = useContext(UserContext);

  const PublicElement = ({ children }) => {
    return <>{children}</>;
  };

  const AdminElement = ({ children }) => {
    if (
      userRole === "Super Admin" ||
      userRole === "Federal Admin" ||
      userRole === "Federal Institutions Admin" ||
      userRole === "Regional Admin" ||
      userRole === "Regional Institutions Admin" ||
      userRole === "Approver" ||
      userRole === "Uploader"
    ) {
      return <>{children}</>;
    } else {
      return (
        <>
          <AccessRestricted />
        </>
      );
    }
  };

  const Uploaders = ({ children }) => {
    if (userRole === "Uploaders") {
      return <>{children}</>;
    } else {
      return (
        <>
          <AccessRestricted />
        </>
      );
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <main className="content" display="flex">
            <Routes>
              <Route
                path="/"
                element={
                  <PublicElement>
                    <RootLayout />
                  </PublicElement>
                }
              >
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="help" element={<HelpCenter />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="reset_password/email_address"
                  element={<ResetPasswordProvideEmail />}
                />
                <Route path="reset_password" element={<ResetPassword />} />
                <Route path="create-account" element={<GuestSignup />} />
                <Route path="user_profile" element={<UserProfile />} />
                <Route
                  path="activation/:token"
                  element={<AccountActivation />}
                />
                <Route
                  path="draft/comment-invitation/:id"
                  element={<RedirectCommentInvitation />}
                />
                <Route path="*" element={<PageNotFound />} />
                {/* </Route> */}
              </Route>

              <Route
                path="/draft"
                element={
                  <PublicElement>
                    <DocumentLayout />
                  </PublicElement>
                }
              >
                <Route path=":id" element={<DocumentDetailView />} />
                <Route
                  path="reflection-on-comments/:id"
                  element={<CommentReflections />}
                />
              </Route>

              <Route path="/commenter" element={<CommenterLayout />}>
                <Route index element={<CommenterDashboard />} />
                <Route path="assigned_drafts" element={<DraftAssignments />} />
                <Route path="invited_drafts" element={<InvitedDrafts />} />
                <Route
                  path="draft_invitation_checkpoint"
                  element={<DraftInvitationCheckpoint />}
                />
                <Route
                  path="assigned_to_comment"
                  element={<AssignedToComment />}
                />
                <Route
                  path="comment_reflections"
                  element={<DraftAssignments />}
                />
                <Route path="user_profile" element={<UserProfile />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <AdminElement>
                    <AdminLayout />
                  </AdminElement>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="create_user" element={<CreateUser />} />
                <Route path="user_profile" element={<UserProfile />} />
                <Route path="institutions" element={<Institutions />} />
                <Route
                  path="create_institution"
                  element={<CreateInstitution />}
                />
                <Route path="regions" element={<Regions />} />
                <Route path="create_region" element={<CreateRegion />} />
                <Route path="sectors" element={<Sectors />} />
                <Route path="create_sector" element={<CreateSector />} />
                <Route path="drafts" element={<Drafts />} />
                <Route path="data_table" element={<UsersTable />} />
                <Route path="reports" element={<Reports />} />
                <Route
                  path="create_draft"
                  element={
                    <Uploaders>
                      <CreateDraft />
                    </Uploaders>
                  }
                />
                <Route
                  path="draft_approval_request"
                  element={<DraftApprovalRequest />}
                />
                <Route
                  path="document_details/:id"
                  element={<DocumentDetails />}
                />
                <Route
                  path="external_request_details/:id"
                  element={<ExternalRequestDetails />}
                />
                <Route
                  path="external_comment_requests"
                  element={<ExternalCommentRequests />}
                />
                <Route
                  path="external_requests_preview/:id"
                  element={<ExternalRequestsPreview />}
                />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
