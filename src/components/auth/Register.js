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
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../contexts/AuthContext";
import { COLORS } from "../../assets/constants/index";

export default function Register() {
    const navigate = useNavigate();

    // Context
    // const { registerStore, uploadImage, deleteImage } = useContext(AuthContext);

    // Local state
    const [registerForm, setRegisterForm] = useState({
        avatar: null,
        phone: "",
        password: "",
        confirmPassword: "",
        name: "",
        address: "",
        timeOpen: "",
        timeClose: "",
    });

    const [file, setFile] = useState(null);

    const onChangeRegisterForm = (event) => {
        // console.log(event);
        setRegisterForm({
            ...registerForm,
            [event.target.name]: event.target.value,
        });
    };

    const {
        phone,
        password,
        confirmPassword,
        name,
        address,
        timeOpen,
        timeClose,
    } = registerForm;

    const handleRegister = () => {
        // if (password !== confirmPassword) {
        //     message.error("Mật khẩu và mật khẩu xác nhận không giống nhau");
        // } else {
        //     file &&
        //         uploadImage(file)
        //             .then((res) => {
        //                 return registerStore({
        //                     ...registerForm,
        //                     avatar: res.data,
        //                 });
        //             })
        //             .then((res) => {
        //                 if (!res.success) {
        //                     message.error(res.message);
        //                     res.avatar && deleteImage(res.avatar);
        //                 }
        //             })
        //             .catch((error) => {
        //                 console.log(error);
        //             });
        // }
        console.log({ ...registerForm, avatar: file });
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
                            label="Tên cửa hàng"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên cửa hàng",
                                },
                            ]}
                            value={name}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="name" />
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
