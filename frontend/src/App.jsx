import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GuardRoute from "./authentication/guardRoute";
// import Navbar from "./share-view/navbar";
import RouterView from "./web-view/router-view";

import UserRouter from "./user-view/router-user";

// import HeaderUser from "./user-view/components/headerUser";

import RouterAdmin from "./admin-view/router-admin";
import NavBarAdmin from "./admin-view/components/navBarAdmin";
import HeaderAdmin from "./admin-view/components/headerAdmin";

import { Grid, Paper } from "@mui/material";
import Header from "./web-view/share/header";
import Footer from "./web-view/share/footer";
import SidebarUser from "./user-view/profile/sidebar";

function App() {
  return (
    <div className="App">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={2000}
      >
        <Router>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
            <Route
              path="/admin/*"
              element={<GuardRoute element={AdminLayout} />}
            />{" "}
            {/* <Route path="/admin/*" element={<AdminLayout />} /> */}
            <Route path="/profile/*" element={<RouterUser />} />
            {/* <Route path="/admin/*" element={<RouterAdmin />} /> */}
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>{" "}
      </SnackbarProvider>
    </div>
  );
}

// Giao diện cơ bản
const MainLayout = () => (
  <>
    <Header />
    <Routes>
      <Route path="/*" element={<RouterView />} />
    </Routes>
    <Footer />
  </>
);

const RouterUser = () => (
  <>
    <Header />
    {/* <HeaderUser /> */}
    <Grid container style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Grid item xs={12} md={3} style={{ background: "#fff", borderRight: "1px solid #ddd" }}>
        <SidebarUser />
      </Grid>
      <Grid item xs={12} md={9} style={{ padding: "20px" }}>
        <Paper elevation={2} style={{ padding: "20px", borderRadius: "12px" }}>
          <Routes>
            <Route path="/*" element={<UserRouter />} />
          </Routes>
        </Paper>
      </Grid>
    </Grid>
    <Footer />
  </>
);

const AdminLayout = () => (
  <>
    <HeaderAdmin />
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}>
        <NavBarAdmin />
      </Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<RouterAdmin />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

export default App;
