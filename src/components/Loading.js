import { Spin } from "antd";
import React from "react";

function Loading() {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Spin tip="Loading..." size="large" />
        </div>
    );
}

export default Loading;
