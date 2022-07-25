import React, { useState } from "react";
import YesNoDialog from "../../../components/YesNoDialog";

export const ProfileTab = ({ logout, userDetails }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <div id="tabProfile" className="home-page__tab-data">
      <YesNoDialog
        open={showLogoutDialog}
        setOpen={setShowLogoutDialog}
        title="Logout"
        message="Are you sure you want to log out?"
        yesAction={logout}
      />
      <div className="home-page__tab-data__section-label">Profile</div>
      <table className="home-page__tab-data__table">
        <tbody>
          <tr>
            <td>User Name</td>
            <td>{userDetails.data.username}</td>
          </tr>
          <tr>
            <td>User Email</td>
            <td>{userDetails.data.email}</td>
          </tr>

          <tr>
            <td>Account Created</td>
            <td>7 Oct 2021</td>
          </tr>

          <tr>
            <td>Total Projects</td>
            <td>27</td>
          </tr>

          <tr>
            <td>WriterAI Usage</td>
            <td>{userDetails.data.apiReqCount}</td>
          </tr>
        </tbody>
      </table>
      <div className="home-page__tab-data__button_container">
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="writerai-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
