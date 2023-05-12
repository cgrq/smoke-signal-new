import React, { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { signUp, editUser } from "../../store/session";
import "./UserFormModal.css";
import ErrorHandler from "../ErrorHandler";

function UserFormModal({ componentType }) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const imageNotValid = (url) => {
    const errors = {};

    const isValidUrl = url.match(/.(jpg|jpeg|png)$/);
    if (!isValidUrl)
      errors.image = "image url must end in .jpg, .jpeg, or .png";

    const isTooLong = url.length > 500;
    if (isTooLong)
      errors.imageUrlLength = "image url must be less than 500 characters";

    return Object.values(errors).length > 0 ? errors : false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword && !imageNotValid(profileImageUrl)) {
      const data =
        componentType === "update"
          ? await dispatch(
              editUser(
                username,
                email,
                password,
                firstName,
                lastName,
                profileImageUrl
              )
            )
          : await dispatch(
              signUp(
                username,
                email,
                password,
                firstName,
                lastName,
                profileImageUrl
              )
            );
      if (data) {
        setErrors(data);
      } else {
        closeModal();
      }
    } else {
      if (password !== confirmPassword) {
        setErrors({
          ...errors,
          password:
            "Confirm Password field must be the same as the Password field",
        });
      }
      if (imageNotValid(profileImageUrl)) {
        setErrors({ ...errors, ...imageNotValid(profileImageUrl) });
      }
    }
  };

  useEffect(() => {
    if (componentType === "update" && sessionUser) {
      setFirstName(sessionUser.first_name);
      setLastName(sessionUser.last_name);
      setEmail(sessionUser.email);
      setProfileImageUrl(sessionUser.profile_image_url);
      setUsername(sessionUser.username);
    }
  }, [sessionUser]);

  return (
    <>
      <h1 className="sign-up-modal-h1">
        {componentType === "update" ? "Edit user" : "Sign up"}
      </h1>
      <form className="sign-up-modal-form" onSubmit={handleSubmit}>
        <ErrorHandler errors={errors} />
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Profile Image</label>
          <input
            type="text"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-modal-button" type="submit">
          {componentType === "update" ? "Edit user" : "Sign Up"}
        </button>
      </form>
    </>
  );
}

export default UserFormModal;
