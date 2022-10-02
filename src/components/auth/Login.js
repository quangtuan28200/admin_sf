import { Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../contexts/AuthContext";
// import { COLORS } from "../../assets/constants/index";
// import img from "../../../assets/images/bglogin.jpg";

export default function Login() {
    const navigate = useNavigate();

    // Context
    // const { loginStore } = useContext(AuthContext);

    // Local state
    const [loginForm, setLoginForm] = useState({
        phone: "",
        password: "",
    });

    const onChangeLoginForm = (event) =>
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

    const { phone, password } = loginForm;

    const handleLogin = async () => {
        // try {
        //     const loginData = await loginStore(loginForm);
        //     if (loginData && !loginData.success) {
        //         message.error(loginData.message);
        //     }
        //     // console.log(loginData);
        // } catch (error) {
        //     console.log(error);
        // }
        console.log(loginForm);
    };

    // console.log(loginForm);

    return (
        <Row
            justify="center"
            align="middle"
            style={{
                height: "100vh",
                // backgroundImage: `url(${img})`,
                // backgroundSize: "cover",
                // backgroundImage: `url(${process.env.PUBLIC_URL}
                //     "upload/7ab7cbba-8424-483e-8722-5e8c320ad003-1654607633840.jpg")`,
            }}
        >
            <Col
                span={8}
                // style={{
                //     backgroundColor: "rgba(0, 0, 0, 0.6)",
                //     paddingLeft: 50,
                //     paddingRight: 50,
                // }}
            >
                <p
                    style={{
                        textAlign: "center",
                        fontSize: 24,
                        // color: "white",
                    }}
                >
                    Đăng nhập
                </p>

                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    // initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={handleLogin}
                >
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập SĐT!",
                            },
                        ]}
                        value={phone}
                        onChange={onChangeLoginForm}
                    >
                        <Input name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu!",
                            },
                        ]}
                        value={password}
                        onChange={onChangeLoginForm}
                    >
                        <Input.Password name="password" />
                    </Form.Item>

                    {/* <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item> */}

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="link"
                            htmlType="button"
                            onClick={() => navigate("/register")}
                        >
                            Đăng ký
                        </Button>

                        <Button
                            style={{
                                // backgroundColor: COLORS.primary,
                                borderRadius: "4px",
                                width: "100px",
                                border: "none",
                            }}
                            type="primary"
                            htmlType="submit"
                            // onClick={handleLogin}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
