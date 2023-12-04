import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [cookies] = useCookies(["access_token"]);


  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("/api/admin/users/getUsers", {
        headers: { Authorization: cookies.access_token }
      });
      // Filter out admin users
      const nonAdminUsers = response.data.filter(user => !user.isAdmin);
      setUsers(nonAdminUsers);
 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [cookies.access_token]); // Dependency array;

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get("/api/admin/herolists/getReviews", {
        headers: { Authorization: cookies.access_token }
      });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [cookies.access_token]);

  useEffect(() => {
    fetchUsers();
    fetchReviews();
  }, [fetchUsers, fetchReviews]); // Add fetch functions to the dependency array



  // Handlers for user and review management
  const handleDisableUser = useCallback(async (userId) => {
    try {
      await axios.put(`/api/admin/users/disable/${userId}`, {}, {
        headers: { Authorization: `${cookies.access_token}` }
      });
      // Update local state
      setUsers(users.map(user => user._id === userId ? { ...user, isDisabled: true } : user));
      fetchUsers();
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  }, [cookies.access_token, fetchUsers]);
  
  const handleEnableUser = useCallback(async (userId) => {
    try {
      await axios.put(`/api/admin/users/enable/${userId}`, {}, {
        headers: { Authorization: `${cookies.access_token}` }
      });
      // Update local state
      setUsers(users.map(user => user._id === userId ? { ...user, isDisabled: false } : user));
      fetchUsers();
    } catch (error) {
      console.error('Error enabling user:', error);
    }
  }, [cookies.access_token, fetchUsers]);
  
  const handleUpgradeToAdmin = useCallback(async (userId) => {
    const isConfirmed = window.confirm("Are you sure you want to upgrade this user to admin?");
    if (isConfirmed) {
      // Send request to upgrade user to admin
      try {
        await axios.put(`/api/admin/users/upgrade/${userId}`, {}, {
          headers: { Authorization: `${cookies.access_token}` }
        });
        fetchUsers();
      } catch (error) {
        console.error('Error upgrading user:', error);
      }
    }
  }, [cookies.access_token, fetchUsers]);
  const handleHideReview = useCallback(async (reviewId) => {
    try {
      await axios.put(`/api/admin/herolists/hideReview/${reviewId}`, {}, {
        headers: { Authorization: `${cookies.access_token}` }
      });
      fetchReviews();
    } catch (error) {
      console.error('Error hiding review:', error);
    }
  }, [cookies.access_token, fetchReviews]);
  const handleUnhideReview = useCallback(async (reviewId) => {
    try {
      await axios.put(`/api/admin/herolists/unhideReview/${reviewId}`, {}, {
        headers: { Authorization: `${cookies.access_token}` }
      });
      fetchReviews();
    } catch (error) {
      console.error('Error unhiding review:', error);
    }
  }, [cookies.access_token, fetchReviews]);


  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

    
      {/* Toggle Users List */}
      <p htmlFor="showUsers">Show Users:</p>

      <ul>
      <button onClick={() => setShowUsers(!showUsers)}>Toggle Users</button>
      {showUsers && (
        <div>
          {users.map(user => (
            <li key={user._id}>
              <p>Username: {user.username}</p>
              <p>Nickname: {user.nickname}</p>
              {/* Conditional rendering for Disable/Enable User Button */}
              <p>Disabled: {user.isDisabled ? "Yes" : "No"}</p>
              {!user.isDisabled ? (
                <button onClick={() => handleDisableUser(user._id)}>Disable</button>
              ) : (
                <button onClick={() => handleEnableUser(user._id)}>Enable</button>
              )}
              {/* Upgrade to Admin Button */}
              {!user.isAdmin && (
                <button onClick={() => handleUpgradeToAdmin(user._id)}>Upgrade to Admin</button>
              )}
            </li>
          ))}
        </div>
      )}
      </ul>


      {/* Toggle Reviews List */}
      <p htmlFor="showUsers">Show Reviews:</p>
      <ul>
      <button onClick={() => setShowReviews(!showReviews)}>Toggle Reviews</button>
      {showReviews && (
        <div>
          {reviews.map(review => (
            <li key={review._id}>
              <p>Commenter's Nickname: {review.nickname}</p>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
              {/* if statment for hidden review or not */}
              <p>Hidden: {review.hidden ? "Yes" : "No"}</p>

              {/* Hide/Unhide Review Button */}
              <button onClick={() => handleHideReview(review._id)}>Hide</button>
              <button onClick={() => handleUnhideReview(review._id)}>Unhide</button>
            </li>
          ))}
        </div>
      )}
      </ul>
    </div>
  );
};
