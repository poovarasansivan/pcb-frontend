const role = localStorage.getItem("role");

let routes = [];

switch (role) {
  case "1":
    routes = [
      {
        path: "/app/home",
        icon: "HomeIcon",
        name: "Home Page",
      },
      {
        path: "/app/manage-users",
        icon: "CiUser",
        name: "Manage Users",
      },
      {
        path: "/app/view-request",
        icon: "CiSquareQuestion",
        name: "View Request",
      },
      {
        path: "/app/track-request",
        icon: "RiProgress5Line",
        name: "Track Request",
      },
      {
        path: "/app/view-issues",
        icon: "AiOutlineIssuesClose",
        name: "View Issues",
      },
      {
        path:"/app/manage-stocks",
        icon:"CgComponents",
        name:"Manage Stocks"
      }
    ];
    break;
  case "2":
    routes = [
      {
        path: "/app/technician-home",
        icon: "HomeIcon",
        name: "Technician Home",
      },
      {
        path: "/app/view-request",
        icon: "CiSquareQuestion",
        name: "View Request",
      },
      {
        path: "/app/track-request",
        icon: "RiProgress5Line",
        name: "Track Request",
      },
      {
        path: "/app/view-issues",
        icon: "AiOutlineIssuesClose",
        name: "View Issues",
      },
      {
        path:"/app/consume-stocks",
        icon:"CgComponents",
        name:"Manage Stocks"
      }
    ];
    break;
  case "3":
    routes = [
      {
        path: "/app/user-home",
        icon: "HomeIcon",
        name: "User Home",
      },
      {
        path: "/app/view-request",
        icon: "CiSquareQuestion",
        name: "View Request",
      },
      {
        path: "/app/track-request",
        icon: "RiProgress5Line",
        name: "Track Request",
      },
    ];
    break;
  default:
    routes = [
      {
        path: "/login",
        icon: "LoginIcon",
        name: "Login",
      },
    ];
}

export default routes;
