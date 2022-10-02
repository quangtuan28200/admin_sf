import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Form,
    Input,
    message,
    Row,
    TimePicker,
    Upload,
} from "antd";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../assets/constants/index";
import { db } from "../../ConfigDB/firebase";

export default function Register() {
    const auth = getAuth();
    const navigate = useNavigate();

    // Local state
    const [registerForm, setRegisterForm] = useState({
        image: null,
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        name: "",
        address: "",
        timeOpen: "",
        timeClose: "",
        isLoading: false,
    });

    const [file, setFile] = useState(null);

    const signUpHandle = () => {
        setRegisterForm({ ...registerForm, isLoading: true });

        createUserWithEmailAndPassword(
            auth,
            registerForm.email,
            registerForm.password
        )
            .then((salonCredential) => {
                const salon = salonCredential.user;
                setDoc(doc(db, "salons", salon.uid), {
                    id: salon.uid,
                    email: registerForm.email,
                    phone: registerForm.phone,
                    name: registerForm.name,
                    address: registerForm.address,
                    timeOpen: registerForm.timeOpen,
                    timeClose: registerForm.timeClose,
                });
            })
            .then(() => {
                message.info("Đăng ký Salon thành công");
            })
            .catch((error) => {
                setRegisterForm({ ...registerForm, isLoading: false });
                message.error(error.message);
            });
    };

    const onChangeRegisterForm = (event) => {
        // console.log(event);
        setRegisterForm({
            ...registerForm,
            [event.target.name]: event.target.value,
        });
    };

    const {
        email,
        password,
        confirmPassword,
        phone,
        name,
        address,
        timeOpen,
        timeClose,
    } = registerForm;

    const handleRegister = () => {
        if (password !== confirmPassword) {
            message.error("Mật khẩu và mật khẩu xác nhận không giống nhau");
        } else {
            console.log({ ...registerForm, image: file });
            signUpHandle();
        }
    };

    const normFile = (e) => {
        // console.log("Upload event:", e.file);

        if (Array.isArray(e)) {
            return e;
        }

        return e?.fileList;
    };

    const handleOnChangeAvatar = (e) => {
        const file = e.target.files[0];
        // console.log(file);
        setFile(file);

        // avatar && deleteImage(avatar);

        // file &&
        //     uploadImage(file)
        //         .then((res) => {
        //             setRegisterForm({ ...registerForm, avatar: res.data });
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";

        if (!isJpgOrPng) {
            message.error("Chỉ có thể chọn file JPG hoặc PNG");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            message.error("Hình ảnh phải bé hơn 2MB");
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    return (
        <>
            <Row justify="center" align="middle" style={{ height: "100vh" }}>
                <Col span={10}>
                    <p style={{ textAlign: "center", fontSize: 24 }}>
                        Đăng ký cửa hàng
                    </p>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        onFinish={handleRegister}
                    >
                        <Form.Item
                            name="avatar"
                            label="Ảnh đại diện"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={handleOnChangeAvatar}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn ảnh đại diện",
                                },
                            ]}
                        >
                            <Upload
                                listType="picture"
                                maxCount={1}
                                beforeUpload={beforeUpload}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Chọn ảnh
                                </Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Vui lòng nhập Email",
                                },
                            ]}
                            value={email}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="email" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu",
                                },
                            ]}
                            value={password}
                            onChange={onChangeRegisterForm}
                        >
                            <Input.Password name="password" />
                        </Form.Item>
                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu",
                                },
                            ]}
                            value={confirmPassword}
                            onChange={onChangeRegisterForm}
                        >
                            <Input.Password name="confirmPassword" />
                        </Form.Item>

                        <Form.Item
                            label="Tên Salon"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên Salon",
                                },
                            ]}
                            value={name}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="name" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="SĐT"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập Số điện thoại",
                                },
                            ]}
                            value={phone}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập địa chỉ ",
                                },
                            ]}
                            value={address}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Thời gian mở cửa"
                            name="timeOpen"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn thời gian mở cửa",
                                },
                            ]}
                            // initialValue={moment("13:30:56", "HH:mm:ss")}
                        >
                            <TimePicker
                                format={"HH:mm"}
                                name="timeOpen"
                                value={moment(timeOpen, "HH:mm")}
                                onChange={(a, b) =>
                                    setRegisterForm({
                                        ...registerForm,
                                        timeOpen: b,
                                    })
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Thời gian đóng cửa"
                            name="timeClose"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn thời gian đóng cửa",
                                },
                            ]}
                            // initialValue={moment("13:30:56", "HH:mm:ss")}
                        >
                            <TimePicker
                                format={"HH:mm"}
                                name="timeClose"
                                value={moment(timeClose, "HH:mm")}
                                onChange={(a, b) =>
                                    setRegisterForm({
                                        ...registerForm,
                                        timeClose: b,
                                    })
                                }
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                                type="link"
                                htmlType="button"
                                onClick={() => navigate("/login")}
                            >
                                Đã có tài khoản
                            </Button>

                            <Button
                                style={{
                                    backgroundColor: COLORS.primary,
                                    borderRadius: "4px",
                                    border: "none",
                                    // width: "200px",
                                }}
                                type="primary"
                                htmlType="submit"
                                loading={registerForm.isLoading}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
}
