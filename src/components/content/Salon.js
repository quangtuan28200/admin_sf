import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Descriptions,
    Divider,
    Form,
    Image,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Space,
    Table,
    TimePicker,
    Upload,
} from "antd";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { db, storage } from "../../ConfigDB/firebase";

function Salon({ salon }) {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataUpdateInfoForm, setDataUpdateInfoForm] = useState({
        image: "",
        name: "",
        phone: "",
        address: "",
        timeOpen: "08:00",
        timeClose: "17:00",
    });
    const [dataAddServiceForm, setDataAddServiceForm] = useState({
        image: "",
        name: "",
        price: "",
    });
    const [dataUpdateServiceForm, setDataUpdateServiceForm] = useState({
        id: "",
        image: "",
        name: "",
        price: "",
    });
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
    const [showUpdateServiceModal, setShowUpdateServiceModal] = useState(false);

    // handle update info
    const handleUpdateInfo = () => {
        // console.log({ ...dataUpdateInfoForm, image });
        setIsLoading(true);

        if (image) {
            const desertRef = ref(
                storage,
                `images/${dataUpdateInfoForm.image.name}`
            );
            // Delete the file
            deleteObject(desertRef)
                .then(() => {
                    const uImageName = image.name + v4();
                    const imageRef = ref(storage, `images/${uImageName}`);
                    uploadBytes(imageRef, image).then(() => {
                        getDownloadURL(imageRef).then((url) => {
                            updateDoc(
                                doc(db, "salons", dataUpdateInfoForm.id),
                                {
                                    image: { name: uImageName, url },
                                    name: dataUpdateInfoForm.name,
                                    phone: dataUpdateInfoForm.phone,
                                    address: dataUpdateInfoForm.address,
                                    timeOpen: dataUpdateInfoForm.timeOpen,
                                    timeClose: dataUpdateInfoForm.timeClose,
                                }
                            ).then(() => {
                                setIsLoading(false);
                                setShowUpdateInfoModal(false);
                                message.success("Cập nhật Salon thành công");
                            });
                        });
                    });
                })
                .catch((error) => {
                    setIsLoading(false);
                    message.error(error.message);
                });
        } else {
            updateDoc(doc(db, "salons", dataUpdateInfoForm.id), {
                name: dataUpdateInfoForm.name,
                phone: dataUpdateInfoForm.phone,
                address: dataUpdateInfoForm.address,
                timeOpen: dataUpdateInfoForm.timeOpen,
                timeClose: dataUpdateInfoForm.timeClose,
            })
                .then(() => {
                    setIsLoading(false);
                    setShowUpdateInfoModal(false);
                    message.success("Cập nhật Salon thành công");
                })
                .catch((error) => {
                    setIsLoading(false);
                    message.error(error.message);
                });
        }
    };

    const handleShowUpdateInfoModal = () => {
        setImage(null);
        setDataUpdateInfoForm(salon);
        setShowUpdateInfoModal(true);
    };

    //handle service
    const handleAddService = () => {
        // console.log("addservice");
        // console.log({ ...dataAddServiceForm, image });
        setIsLoading(true);

        //upload image
        if (image !== null) {
            const uImageName = image.name + v4();
            const imageRef = ref(storage, `images/${uImageName}`);
            uploadBytes(imageRef, image).then(() => {
                getDownloadURL(imageRef).then((url) => {
                    addDoc(collection(db, "services"), {
                        image: { name: uImageName, url },
                        name: dataAddServiceForm.name,
                        price: parseInt(dataAddServiceForm.price),
                        salonId: salon.id,
                    }).then(() => {
                        setDataAddServiceForm({
                            image: "",
                            name: "",
                            price: "",
                        });
                        setIsLoading(false);
                        getServices();
                        setShowAddServiceModal(false);
                        message.success("Thêm salon thành công");
                    });
                });
            });
        }
    };

    const handleUpdateService = () => {
        // console.log(dataUpdateServiceForm);
        // console.log(image);
        setIsLoading(true);

        if (image) {
            const desertRef = ref(
                storage,
                `images/${dataUpdateServiceForm.image.name}`
            );

            // Delete the file
            deleteObject(desertRef).then(() => {
                const uImageName = image.name + v4();
                const imageRef = ref(storage, `images/${uImageName}`);
                uploadBytes(imageRef, image).then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        updateDoc(
                            doc(db, "services", dataUpdateServiceForm.id),
                            {
                                image: { name: uImageName, url },
                                name: dataUpdateServiceForm.name,
                                price: dataUpdateServiceForm.price,
                            }
                        )
                            .then(() => {
                                setIsLoading(false);
                                getServices();
                                setShowUpdateServiceModal(false);
                                message.success("Cập nhật dịch vụ thành công");
                            })
                            .catch((error) => {
                                setIsLoading(false);
                                message.error(error.message);
                            });
                    });
                });
            });
        } else {
            updateDoc(doc(db, "services", dataUpdateServiceForm.id), {
                name: dataUpdateServiceForm.name,
                price: dataUpdateServiceForm.price,
            })
                .then(() => {
                    setIsLoading(false);
                    getServices();
                    setShowUpdateServiceModal(false);
                    message.success("Cập nhật dịch vụ thành công");
                })
                .catch((error) => {
                    setIsLoading(false);
                    message.error(error.message);
                });
        }
    };

    const handleDeleteService = (service) => {
        const desertRef = ref(storage, `images/${service.image.name}`);

        // Delete the file
        deleteObject(desertRef)
            .then(() => {
                deleteDoc(doc(db, "services", service.id));
            })
            .then(() => {
                getServices();
                message.success("Xóa dịch vụ thành công");
            })
            .catch((error) => {
                message.error(error.message);
            });
    };

    const handleCloseAddServiceModal = () => {
        setShowAddServiceModal(false);
        setDataAddServiceForm({ image: "", name: "", price: "" });
    };

    const handleShowUpdateServiceModal = (service) => {
        // console.log(service);
        setImage(null);
        setDataUpdateServiceForm(service);
        setShowUpdateServiceModal(true);
    };

    // handle image
    const handleOnChangeImage = (e) => {
        const file = e.target.files[0];
        // console.log(file);
        setImage(file);
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

    const normFile = (e) => {
        // console.log("Upload event:", e.file);

        if (Array.isArray(e)) {
            return e;
        }

        return e?.fileList;
    };

    // fetch SERVICES

    const [services, setServices] = useState([]);

    const getServices = () => {
        onSnapshot(
            collection(db, "services"),
            (snapshot) => {
                const servicesData = [];
                snapshot.docs.forEach((service) => {
                    if (service.data().salonId === salon.id) {
                        servicesData.push({
                            ...service.data(),
                            id: service.id,
                        });
                    }
                });
                setServices(servicesData);
            },
            (error) => {
                message.error(error.message);
            }
        );
    };

    useEffect(() => {
        // const servicesData = [];
        // onSnapshot(collection(db, "services"), (snapshot) => {
        //     // eslint-disable-next-line array-callback-return
        //     snapshot.docs.map((service) => {
        //         if (service.data().salonId === salon.id) {
        //             servicesData.push({ ...service.data(), id: service.id });
        //         }
        //     });
        //     setServices(servicesData);
        // });
        getServices();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log(services);

    const servicesData =
        services &&
        services.length > 0 &&
        services.map((service) => {
            return { ...service, key: service.id };
        });

    // console.log(servicesData);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên dịch vụ",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
            width: 100,
            render: (_, { image }) => <Image width={100} src={image.url} />,
        },
        {
            title: "Giá (VNĐ)",
            dataIndex: "price",
            key: "price",
            render: (_, { price }) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(price),
        },
        {
            title: "Tùy chọn",
            key: "action",
            width: 150,
            render: (record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() => {
                            handleShowUpdateServiceModal(record);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa dịch vụ này ?"
                        placement="left"
                        onConfirm={() => handleDeleteService(record)}
                    >
                        <Button type="primary" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row>
                <Col span={10}>
                    <div
                        style={{
                            // backgroundColor: "red",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            style={{ objectFit: "contain" }}
                            height={400}
                            src={salon.image.url}
                        />
                    </div>
                </Col>
                <Col span={14}>
                    <div style={{ marginLeft: 20 }}>
                        <Descriptions
                            column={1}
                            title={
                                <div style={{ fontSize: 30 }}>{salon.name}</div>
                            }
                            labelStyle={{ fontSize: 20, fontWeight: 500 }}
                            contentStyle={{ fontSize: 20 }}
                        >
                            <Descriptions.Item label="Hoạt động">
                                {`${salon.timeOpen} - ${salon.timeClose}`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Liên hệ">
                                {salon.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">
                                {salon.address}
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: 20 }}>
                            <Button
                                type="primary"
                                onClick={handleShowUpdateInfoModal}
                            >
                                Chỉnh sửa thông tin
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Divider
                style={{ marginTop: 50 }}
                orientation="left"
                orientationMargin={0}
            >
                Dịch vụ
            </Divider>

            <div>
                <Table bordered columns={columns} dataSource={servicesData} />
            </div>

            {/* add btn */}
            <div
                style={{
                    position: "fixed",
                    bottom: 16,
                    right: 20,
                    zIndex: 999,
                }}
            >
                <Button
                    className="add_btn"
                    style={{
                        display: "flex",
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 20,
                        paddingBottom: 20,
                        borderRadius: 50,
                        alignItems: "center",
                    }}
                    type="primary"
                    onClick={() => setShowAddServiceModal(true)}
                >
                    <PlusOutlined style={{ fontSize: 20 }} />
                </Button>
            </div>

            {/* update info modal */}
            <Modal
                destroyOnClose={true}
                open={showUpdateInfoModal}
                title="Chỉnh sửa thông tin"
                // transitionName=""
                // maskTransitionName=""

                onCancel={() => setShowUpdateInfoModal(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setShowUpdateInfoModal(false)}
                    >
                        Đóng
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUpdateInfo}
                        loading={isLoading}
                    >
                        Cập nhật
                    </Button>,
                ]}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    fields={[
                        { name: "name", value: dataUpdateInfoForm.name },
                        { name: "phone", value: dataUpdateInfoForm.phone },
                        { name: "address", value: dataUpdateInfoForm.address },
                        {
                            name: "timeOpen",
                            value: moment(dataUpdateInfoForm.timeOpen, "HH:mm"),
                        },
                        {
                            name: "timeClose",
                            value: moment(
                                dataUpdateInfoForm.timeClose,
                                "HH:mm"
                            ),
                        },
                    ]}
                    initialValues={{
                        name: dataUpdateInfoForm.name,
                        phone: dataUpdateInfoForm.phone,
                        address: dataUpdateInfoForm.address,
                        timeOpen: moment(dataUpdateInfoForm.timeOpen, "HH:mm"),
                        timeClose: moment(dataUpdateInfoForm.timeOpen, "HH:mm"),
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        name="image"
                        label="Ảnh đại diện"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        onChange={handleOnChangeImage}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ảnh salon",
                            },
                        ]}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
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
                        onChange={(e) =>
                            setDataUpdateInfoForm({
                                ...dataUpdateInfoForm,
                                name: e.target.value,
                            })
                        }
                    >
                        <Input name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại",
                            },
                        ]}
                        onChange={(e) =>
                            setDataUpdateInfoForm({
                                ...dataUpdateInfoForm,
                                phone: e.target.value,
                            })
                        }
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ",
                            },
                        ]}
                        onChange={(e) =>
                            setDataUpdateInfoForm({
                                ...dataUpdateInfoForm,
                                address: e.target.value,
                            })
                        }
                    >
                        <Input />
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
                    >
                        <TimePicker
                            format={"HH:mm"}
                            minuteStep={5}
                            name="timeOpen"
                            onChange={(a, b) =>
                                setDataUpdateInfoForm({
                                    ...dataUpdateInfoForm,
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
                                message: "Vui lòng chọn thời gian mở cửa",
                            },
                        ]}
                    >
                        <TimePicker
                            format={"HH:mm"}
                            minuteStep={5}
                            name="timeClose"
                            onChange={(a, b) =>
                                setDataUpdateInfoForm({
                                    ...dataUpdateInfoForm,
                                    timeClose: b,
                                })
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* add service modal */}
            <Modal
                destroyOnClose={true}
                open={showAddServiceModal}
                title="Thêm dịch vụ"
                transitionName=""
                maskTransitionName=""
                onCancel={handleCloseAddServiceModal}
                footer={[
                    <Button key="back" onClick={handleCloseAddServiceModal}>
                        Đóng
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAddService}
                        loading={isLoading}
                    >
                        Thêm
                    </Button>,
                ]}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    fields={[
                        { name: "name", value: dataAddServiceForm.name },
                        { name: "price", value: dataAddServiceForm.price },
                    ]}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        name="image"
                        label="Ảnh"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        onChange={handleOnChangeImage}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ảnh dịch vụ",
                            },
                        ]}
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Tên dịch vụ"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên dịch vụ",
                            },
                        ]}
                        onChange={(e) =>
                            setDataAddServiceForm({
                                ...dataAddServiceForm,
                                name: e.target.value,
                            })
                        }
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá dịch vụ!",
                            },
                        ]}
                        onChange={(e) =>
                            setDataAddServiceForm({
                                ...dataAddServiceForm,
                                price: e.target.value,
                            })
                        }
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* update service modal */}
            <Modal
                destroyOnClose={true}
                open={showUpdateServiceModal}
                title="Cập nhật dịch vụ"
                transitionName=""
                maskTransitionName=""
                onCancel={() => setShowUpdateServiceModal(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setShowUpdateServiceModal(false)}
                    >
                        Đóng
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUpdateService}
                        loading={isLoading}
                    >
                        Lưu thay đổi
                    </Button>,
                ]}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    fields={[
                        { name: "name", value: dataUpdateServiceForm.name },
                        { name: "price", value: dataUpdateServiceForm.price },
                    ]}
                    initialValues={{
                        name: dataUpdateServiceForm.name,
                        price: dataUpdateServiceForm.price,
                    }}
                    autoComplete="off"
                    // onFinish={handleUpdateFood}
                >
                    <Form.Item
                        name="image"
                        label="Ảnh"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        onChange={handleOnChangeImage}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ảnh dịch vụ",
                            },
                        ]}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            // defaultFileList={[
                            //     {
                            //         uid: dataUpdateServiceForm.id,
                            //         name: "service image",
                            //         status: "done",
                            //         url: dataUpdateServiceForm.image,
                            //         thumbUrl: dataUpdateServiceForm.image,
                            //     },
                            // ]}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Tên dịch vụ"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên dịch vụ",
                            },
                        ]}
                    >
                        <Input
                            name="name"
                            onChange={(e) =>
                                setDataUpdateServiceForm({
                                    ...dataUpdateServiceForm,
                                    name: e.target.value,
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá dịch vụ"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá dịch vụ",
                            },
                        ]}
                    >
                        <Input
                            name="price"
                            onChange={(e) =>
                                setDataUpdateServiceForm({
                                    ...dataUpdateServiceForm,
                                    price: parseInt(e.target.value),
                                })
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Salon;
