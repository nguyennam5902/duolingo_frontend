import UserNav from "../nav/UserNav";

const UserRoute = ({ children, showNav = true }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">{showNav && <UserNav />}</div>
          <div className="col-md-10">{children}</div>
        </div>
      </div>
    </>
  );
};

export default UserRoute;