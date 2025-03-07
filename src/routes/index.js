import { lazy } from "react";

// Lazy load components for better performance
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Forms = lazy(() => import("../pages/Forms"));
const Cards = lazy(() => import("../pages/Cards"));
const Charts = lazy(() => import("../pages/Charts"));
const Buttons = lazy(() => import("../pages/Buttons"));
const Modals = lazy(() => import("../pages/Modals"));
const Tables = lazy(() => import("../pages/Tables"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const AdminHome = lazy(() => import("../pages/admin/AdminHome"));
const PCBRequest = lazy(() => import("../pages/admin/PCBRequest"));
const ProjectRequestForm = lazy(() => import("../pages/admin/Addnewrequest"));
const Manageusers = lazy(() => import("../pages/admin/ManageUsers"));
const Addnewusers = lazy(() => import("../pages/admin/Addnewuser"));
const Tracking = lazy(() => import("../pages/admin/TrackRequest"));
const Addnewmapping = lazy(() => import("../pages/admin/MapTracking"));
const IssuesTracking = lazy(() => import("../pages/admin/IssuesTracking"));
const Addnewissues = lazy(() => import("../pages/admin/Addnewissues"));
const TechnicianHome = lazy(() => import("../pages/technician/Home"));
const UserHome = lazy(() => import("../pages/technician/UsersHome"));
const ManageStocks = lazy(() => import("../pages/admin/ManageStocks"));
const Addstocks = lazy(() => import("../pages/admin/Addnewstock"));
const Consumestocks = lazy(() => import("../pages/technician/ConsumeStock"));

const routes = [
  { path: "/consume-stocks", component: Consumestocks },
  { path: "/add-new-stock", component: Addstocks },
  { path: "/manage-stocks", component: ManageStocks },
  { path: "/user-home", component: UserHome },
  { path: "/technician-home", component: TechnicianHome },
  { path: "/add-new-issues", component: Addnewissues },
  { path: "/view-issues", component: IssuesTracking },
  { path: "/add-new-mapping", component: Addnewmapping },
  { path: "/track-request", component: Tracking },
  { path: "/add-users", component: Addnewusers },
  { path: "/manage-users", component: Manageusers },
  { path: "/add-new-request", component: ProjectRequestForm },
  { path: "/home", component: AdminHome },
  { path: "/view-request", component: PCBRequest },
  { path: "/dashboard", component: Dashboard },
  { path: "/forms", component: Forms },
  { path: "/cards", component: Cards },
  { path: "/charts", component: Charts },
  { path: "/buttons", component: Buttons },
  { path: "/modals", component: Modals },
  { path: "/tables", component: Tables },
  { path: "/404", component: Page404 },
  { path: "/blank", component: Blank },
];

export default routes;
