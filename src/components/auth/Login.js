import { Button, Col, Form, Input, message, Row } from "antd";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    // Local state
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        isLoading: false,
    });

    const onChangeLoginForm = (event) =>
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

    const { email, password } = loginForm;
    // console.log("first");

    const logIn = () => {
        setLoginForm({ ...loginForm, isLoading: true });
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(
                getAuth(),
                loginForm.email,
                loginForm.password
            )
                .then(() => {
                    setLoginForm({ ...loginForm, isLoading: false });
                    navigate("/dashboard");
                })
                .catch((error) => {
                    setLoginForm({ ...loginForm, isLoading: false });
                    message.error(error.message);
                });
        }
    };

    // console.log(loginForm);

    return (
        // <>
        //     {isLoged ? null : (
        //         <Row
        //             justify="center"
        //             align="middle"
        //             style={{
        //                 height: "100vh",
        //                 // backgroundImage: `url(${img})`,
        //                 // backgroundSize: "cover",
        //                 // backgroundImage: `url(${process.env.PUBLIC_URL}
        //                 //     "upload/7ab7cbba-8424-483e-8722-5e8c320ad003-1654607633840.jpg")`,
        //             }}
        //         >
        //             <Col span={8}>
        //                 <p
        //                     style={{
        //                         textAlign: "center",
        //                         fontSize: 24,
        //                         // color: "white",
        //                     }}
        //                 >
        //                     Đăng nhập
        //                 </p>

        //                 <Form
        //                     name="basic"
        //                     labelCol={{ span: 8 }}
        //                     wrapperCol={{ span: 16 }}
        //                     // initialValues={{ remember: true }}
        //                     autoComplete="off"
        //                     // onFinish={}
        //                 >
        //                     <Form.Item
        //                         label="Email"
        //                         name="email"
        //                         rules={[
        //                             {
        //                                 required: true,
        //                                 type: "email",
        //                                 message: "Vui lòng nhập Email!",
        //                             },
        //                         ]}
        //                         value={email}
        //                         onChange={onChangeLoginForm}
        //                     >
        //                         <Input name="email" />
        //                     </Form.Item>

        //                     <Form.Item
        //                         label="Mật khẩu"
        //                         name="password"
        //                         rules={[
        //                             {
        //                                 required: true,
        //                                 message: "Vui lòng nhập mật khẩu!",
        //                             },
        //                         ]}
        //                         value={password}
        //                         onChange={onChangeLoginForm}
        //                     >
        //                         <Input.Password name="password" />
        //                     </Form.Item>

        //                     <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        //                         <Button
        //                             type="link"
        //                             htmlType="button"
        //                             onClick={() => navigate("/register")}
        //                         >
        //                             Đăng ký
        //                         </Button>

        //                         <Button
        //                             style={{
        //                                 // backgroundColor: COLORS.primary,
        //                                 borderRadius: "4px",
        //                                 // width: "100px",
        //                                 border: "none",
        //                             }}
        //                             type="primary"
        //                             htmlType="submit"
        //                             onClick={logIn}
        //                             loading={loginForm.isLoading}
        //                         >
        //                             Đăng nhập
        //                         </Button>
        //                     </Form.Item>
        //                 </Form>
        //             </Col>
        //         </Row>
        //     )}
        // </>
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
            <Col span={8}>
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
                    // onFinish={}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: "Vui lòng nhập Email!",
                            },
                        ]}
                        value={email}
                        onChange={onChangeLoginForm}
                    >
                        <Input name="email" />
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
                                // width: "100px",
                                border: "none",
                            }}
                            type="primary"
                            htmlType="submit"
                            onClick={logIn}
                            loading={loginForm.isLoading}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}
