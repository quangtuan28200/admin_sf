import { Layout, Menu } from "antd";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Book from "./content/Book";
import Salon from "./content/Salon";
import Statistic from "./content/Statistic";
import Loading from "./Loading";

const { Header, Content, Footer } = Layout;

const DashBoard = () => {
    const navigate = useNavigate();

    const [isLoged, setIsLoged] = useState(false);

    // console.log("second");

    useEffect(() => {
        onAuthStateChanged(getAuth(), (salon) => {
            if (!salon) {
                navigate("/login");
            } else {
                setIsLoged(true);
            }
        });
    }, [navigate]);

    const logout = () => {
        signOut(getAuth()).then(() => {
            navigate("/login");
        });
    };

    return (
        <>
            {!isLoged ? (
                <Loading />
            ) : (
                <Layout style={{ height: "100%", minHeight: "100vh" }}>
                    <Header
                        style={{
                            position: "fixed",
                            zIndex: 100,
                            width: "100%",
                        }}
                    >
                        <div className="logo">SalonManager</div>
                        <div className="logOut" onClick={logout}>
                            Đăng xuất
                        </div>

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
                    </Header>
                    <Content
                        className="site-layout"
                        style={{
                            padding: "0 50px",
                            marginTop: 64,
                        }}
                    >
                        {/* <Breadcrumb
                    style={{
                        margin: "16px 0",
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb> */}
                        <div
                            style={{
                                margin: "16px 0",
                            }}
                        ></div>
                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                minHeight: 380,
                            }}
                        >
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="salon" />}
                                />
                                <Route path="/salon" element={<Salon />} />
                                <Route path="/book" element={<Book />} />
                                <Route
                                    path="/statistic"
                                    element={<Statistic />}
                                />
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
            )}
        </>
    );
};

export default DashBoard;
