// import {
//     ArrowsAltOutlined,
//     BarChartOutlined,
//     ContainerOutlined,
//     HomeOutlined,
//     LogoutOutlined,
//     ShoppingOutlined,
//     ShrinkOutlined,
// } from "@ant-design/icons";
// import { Layout, Menu } from "antd";
// // import React, { useContext, useState } from "react";
// import React, { useState } from "react";
// // import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// // import { AuthContext } from "../contexts/AuthContext";
// // import Foods from "./Content/Foods";
// // import Order from "./Content/Order";
// // import Statistic from "./Content/Statistic";
// // import Store from "./Content/Store";

// const { Sider, Content } = Layout;

// const keyNav = () => {
//     const path = window.location.pathname.replace("/dashboard/", "");
//     switch (path) {
//         case "store":
//             return "1";
//         case "food":
//             return "2";
//         case "order":
//             return "3";
//         case "statistic":
//             return "4";
//         default:
//             break;
//     }
// };

// const DashBoard = () => {
//     const navigate = useNavigate();
//     // const { logoutStore } = useContext(AuthContext);
//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <Layout style={{ height: "100%", minHeight: "100vh" }}>
//             <Sider trigger={null} collapsible collapsed={collapsed}>
//                 <Menu
//                     style={{ marginTop: 20 }}
//                     theme="dark"
//                     mode="inline"
//                     defaultSelectedKeys={[keyNav() || "1"]}
//                     items={[
//                         {
//                             key: "1",
//                             icon: <HomeOutlined />,
//                             label: "Cửa hàng",
//                             onClick: () => navigate("store"),
//                         },
//                         {
//                             key: "2",
//                             icon: <ContainerOutlined />,
//                             label: "Món ăn",
//                             onClick: () => navigate("food"),
//                         },

//                         {
//                             key: "3",
//                             icon: <ShoppingOutlined />,
//                             label: "Đơn hàng",
//                             onClick: () => navigate("order"),
//                         },
//                         {
//                             key: "4",
//                             icon: <BarChartOutlined />,
//                             label: "Thống kê",
//                             onClick: () => navigate("statistic"),
//                         },
//                         {
//                             key: "5",
//                             icon: !collapsed ? (
//                                 <ShrinkOutlined />
//                             ) : (
//                                 <ArrowsAltOutlined />
//                             ),
//                             label: !collapsed ? "Thu nhỏ" : "Mở rộng",
//                             onClick: () => setCollapsed(!collapsed),
//                         },
//                         {
//                             key: "6",
//                             icon: <LogoutOutlined />,
//                             label: "Đăng xuất",
//                             // onClick: () => logoutStore(),
//                         },
//                     ]}
//                 />
//             </Sider>
//             <Layout className="site-layout">
//                 <Content
//                     className="site-layout-background"
//                     style={{
//                         margin: 10,
//                         padding: 10,
//                         minHeight: 280,
//                     }}
//                 >
//                     {/* {content} */}
//                     {/* <Routes>
//                         <Route path="/" element={<Navigate to="store" />} />
//                         <Route path="/store" element={<Store />} />
//                         <Route path="/food" element={<Foods />} />
//                         <Route path="/order" element={<Order />} />
//                         <Route path="/statistic" element={<Statistic />} />
//                     </Routes> */}
//                 </Content>
//             </Layout>
//         </Layout>
//     );
// };

// export default DashBoard;

import { Breadcrumb, Layout, Menu } from "antd";
import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Salon from "./content/Salon";
import Book from "./content/Book";
import Statistic from "./content/Statistic";

const { Header, Content, Footer } = Layout;

const DashBoard = () => {
    const navigate = useNavigate();
    return (
        <Layout style={{ height: "100%", minHeight: "100vh" }}>
            <Header
                style={{
                    position: "fixed",
                    zIndex: 100,
                    width: "100%",
                }}
            >
                <div className="logo">SalonManager</div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            label: "Salon",
                            onClick: () => navigate("salon"),
                        },
                        {
                            key: "2",
                            label: "Đặt lịch",
                            onClick: () => navigate("book"),
                        },
                        {
                            key: "3",
                            label: "Thống kê",
                            onClick: () => navigate("statistic"),
                        },
                    ]}
                />

                {/* <div style={{ float: "right" }}>Đăng xuất</div> */}
            </Header>
            <Content
                className="site-layout"
                style={{
                    padding: "0 50px",
                    marginTop: 64,
                }}
            >
                <Breadcrumb
                    style={{
                        margin: "16px 0",
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 380,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Navigate to="salon" />} />
                        <Route path="/salon" element={<Salon />} />
                        <Route path="/book" element={<Book />} />
                        <Route path="/statistic" element={<Statistic />} />
                    </Routes>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: "center",
                }}
            >
                SalonManager by KMA
            </Footer>
        </Layout>
    );
};

export default DashBoard;
