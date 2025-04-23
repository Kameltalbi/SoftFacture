// src/screens/notfound/NotFoundScreen.jsx
import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import notFoundImage from "../../assets/images/page_not_found.svg"; // Replace with your actual image path
import "./NotFoundScreen.css"; // Custom styles

const { Title, Text } = Typography;

const NotFoundScreen = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-text">
        <Text type="primary" style={{ fontWeight: 600, fontSize:20 }}>404 Error</Text>
        <Title level={1}>Page not found</Title>
        <Text type="secondary">
          Sorry, the page you are looking for could not be found or has been removed.
        </Text>
        <br />
        <Link to="/" className="notfound-link">Go back →</Link>
      </div>
      <div className="notfound-image">
        <img src={notFoundImage} alt="404 Illustration" />
      </div>
    </div>
  );
};

export default NotFoundScreen;
