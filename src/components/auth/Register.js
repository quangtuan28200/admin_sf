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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { COLORS, distanceMatrixAPIKey } from "../../assets/constants/index";
import { db, storage } from "../../ConfigDB/firebase";

export default function Register() {
    const auth = getAuth();
    const navigate = useNavigate();

    // Local state
    const [registerForm, setRegisterForm] = useState({
        image: null,
        email: "s1@gmail.com",
        password: "123123",
        confirmPassword: "123123",
        phone: "0387126031",
        name: "Salon 1",
        address: "",
        timeOpen: "09:00",
        timeClose: "17:00",
    });

    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const signUpHandle = async () => {
        setIsLoading(true);

        try {
            const salonCredential = await createUserWithEmailAndPassword(
                auth,
                registerForm.email,
                registerForm.password
            );

            // console.log("salonCredential: " + salonCredential);

            //upload image
            if (image !== null) {
                const uImageName = image.name + v4();
                const imageRef = ref(storage, `images/${uImageName}`);

                await uploadBytes(imageRef, image);
                const url = await getDownloadURL(imageRef);

                // console.log("url: " + url);

                const response = await fetch(
                    `https://api.distancematrix.ai/maps/api/geocode/json?address=${registerForm.address}&key=${distanceMatrixAPIKey}`,
                    {
                        method: "GET",
                    }
                );

                const geoCode = await response.json();
                const location = geoCode.result[0].geometry.location;

                // console.log("location: " + location);

                // store fireStore
                await setDoc(doc(db, "salons", salonCredential.user.uid), {
                    id: salonCredential.user.uid,
                    image: {
                        name: uImageName,
                        url,
                    },
                    email: registerForm.email,
                    phone: registerForm.phone,
                    name: registerForm.name,
                    address: {
                        name: registerForm.address,
                        latitude: location.lat,
                        longitude: location.lng,
                    },
                    timeOpen: registerForm.timeOpen,
                    timeClose: registerForm.timeClose,
                    star: 5,
                    rateCount: 1,
                    bookingCount: 0,
                    busyTimes: [],
                });

                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            message.error(error.message);
        }

        // createUserWithEmailAndPassword(
        //     auth,
        //     registerForm.email,
        //     registerForm.password
        // )
        //     .then((salonCredential) => {
        //         const salon = salonCredential.user;

        //         //upload image
        //         if (image !== null) {
        //             const uImageName = image.name + v4();
        //             const imageRef = ref(storage, `images/${uImageName}`);

        //             uploadBytes(imageRef, image)
        //                 .then(() => {
        //                     getDownloadURL(imageRef)
        //                         .then((url) => {
        //                             // console.log(url);
        //                             // const location = geoCoding(registerForm.address);
        //                             fetch(
        //                                 `https://api.distancematrix.ai/maps/api/geocode/json?address=${address}&key=${distanceMatrixAPIKey}`,
        //                                 {
        //                                     method: "GET",
        //                                 }
        //                             )
        //                                 .then((response) => response.json())
        //                                 .then((json) => {
        //                                     const location =
        //                                         json.result[0].geometry
        //                                             .location;

        //                                     // store fireStore
        //                                     setDoc(
        //                                         doc(db, "salons", salon.uid),
        //                                         {
        //                                             id: salon.uid,
        //                                             image: {
        //                                                 name: uImageName,
        //                                                 url,
        //                                             },
        //                                             email: registerForm.email,
        //                                             phone: registerForm.phone,
        //                                             name: registerForm.name,
        //                                             address: {
        //                                                 name: registerForm.address,
        //                                                 latitude: location.lat,
        //                                                 longitude: location.lng,
        //                                             },
        //                                             timeOpen:
        //                                                 registerForm.timeOpen,
        //                                             timeClose:
        //                                                 registerForm.timeClose,
        //                                             star: 0,
        //                                             rateCount: 0,
        //                                         }
        //                                     )
        //                                         .then(() => {
        //                                             // message.info("????ng k?? Salon th??nh c??ng");
        //                                             setRegisterForm({
        //                                                 ...registerForm,
        //                                                 isLoading: false,
        //                                             });
        //                                         })
        //                                         .catch((error) => {
        //                                             setRegisterForm({
        //                                                 ...registerForm,
        //                                                 isLoading: false,
        //                                             });
        //                                             message.error(
        //                                                 error.message
        //                                             );
        //                                         });
        //                                 })
        //                                 .catch((error) => {
        //                                     setRegisterForm({
        //                                         ...registerForm,
        //                                         isLoading: false,
        //                                     });
        //                                     message.error(error.message);
        //                                 });
        //                         })
        //                         .catch((error) => {
        //                             setRegisterForm({
        //                                 ...registerForm,
        //                                 isLoading: false,
        //                             });
        //                             message.error(error.message);
        //                         });
        //                 })
        //                 .catch((error) => {
        //                     setRegisterForm({
        //                         ...registerForm,
        //                         isLoading: false,
        //                     });
        //                     message.error(error.message);
        //                 });
        //         }
        //     })
        //     .catch((error) => {
        //         setRegisterForm({
        //             ...registerForm,
        //             isLoading: false,
        //         });
        //         message.error(error.message);
        //     });
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
            message.error("M???t kh???u v?? m???t kh???u x??c nh???n kh??ng gi???ng nhau");
        } else {
            // console.log({ ...registerForm, image: file });
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
        setImage(file);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";

        if (!isJpgOrPng) {
            message.error("Ch??? c?? th??? ch???n file JPG ho???c PNG");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            message.error("H??nh ???nh ph???i b?? h??n 2MB");
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    return (
        <>
            <Row justify="center" align="middle" style={{ height: "100vh" }}>
                <Col span={10}>
                    <p style={{ textAlign: "center", fontSize: 24 }}>
                        ????ng k?? c???a h??ng
                    </p>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{
                            email: email,
                            password: password,
                            confirmPassword: confirmPassword,
                            phone: phone,
                            name: name,
                        }}
                        autoComplete="off"
                        onFinish={handleRegister}
                    >
                        <Form.Item
                            name="avatar"
                            label="???nh ?????i di???n"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={handleOnChangeAvatar}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng ch???n ???nh ?????i di???n",
                                },
                            ]}
                        >
                            <Upload
                                listType="picture"
                                maxCount={1}
                                beforeUpload={beforeUpload}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Ch???n ???nh
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
                                    message: "Vui l??ng nh???p Email",
                                },
                            ]}
                            value={email}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="email" />
                        </Form.Item>

                        <Form.Item
                            label="M???t kh???u"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng nh???p m???t kh???u",
                                },
                            ]}
                            value={password}
                            onChange={onChangeRegisterForm}
                        >
                            <Input.Password name="password" />
                        </Form.Item>
                        <Form.Item
                            label="X??c nh???n m???t kh???u"
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng nh???p m???t kh???u",
                                },
                            ]}
                            value={confirmPassword}
                            onChange={onChangeRegisterForm}
                        >
                            <Input.Password name="confirmPassword" />
                        </Form.Item>

                        <Form.Item
                            label="T??n Salon"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng nh???p t??n Salon",
                                },
                            ]}
                            value={name}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="name" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="S??T"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng nh???p S??? ??i???n tho???i",
                                },
                            ]}
                            value={phone}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="?????a ch???"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng nh???p ?????a ch??? ",
                                },
                            ]}
                            value={address}
                            onChange={onChangeRegisterForm}
                        >
                            <Input name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Th???i gian m??? c???a"
                            name="timeOpen"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng ch???n th???i gian m??? c???a",
                                },
                            ]}
                            initialValue={moment("9:00", "HH:mm")}
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
                            label="Th???i gian ????ng c???a"
                            name="timeClose"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui l??ng ch???n th???i gian ????ng c???a",
                                },
                            ]}
                            initialValue={moment("17:00", "HH:mm")}
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
                                ???? c?? t??i kho???n
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
                                loading={isLoading}
                            >
                                ????ng k??
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
}
