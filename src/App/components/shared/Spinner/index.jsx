import "./Spinner.scss";
import React from "react";
import { Alert, Spin } from "antd";

export function Spinner() {
  return (
    <div className="container">
      <Spin size="large" />
    </div>
  );
}
