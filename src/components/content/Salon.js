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
import { distanceMatrixAPIKey } from "../../assets/constants";
import { db, storage } from "../../ConfigDB/firebase";

function Salon({ salon }) {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataUpdateInfoForm, setDataUpdateInfoForm] = useState({
        image: "",
        name: "",
        phone: "",
        address: {
            name: "",
            latitude: "",
            longitude: "",
        },
        timeOpen: "08:00",
        timeClose: "17:00",
    });
    const [dataAddServiceForm, setDataAddServiceForm] = useState({
        image: "",
        name: "",
        price: "",
        completionTime: "",
    });
    const [dataUpdateServiceForm, setDataUpdateServiceForm] = useState({
        id: "",
        image: "",
        name: "",
        price: "",
        completionTime: "",
    });
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
    const [showUpdateServiceModal, setShowUpdateServiceModal] = useState(false);

    // handle update info
    const handleUpdateInfo = async () => {
        // console.log({ ...dataUpdateInfoForm, image });
        setIsLoading(true);

        if (image) {
            try {
                const desertRef = ref(
                    storage,
                    `images/${dataUpdateInfoForm.image.name}`
                );
                await deleteObject(desertRef);

                const uImageName = image.name + v4();
                const imageRef = ref(storage, `images/${uImageName}`);

                await uploadBytes(imageRef, image);
                const url = await getDownloadURL(imageRef);

                // console.log("url: " + url);

                const response = await fetch(
                    `https://api.distancematrix.ai/maps/api/geocode/json?address=${dataUpdateInfoForm.address.name}&key=${distanceMatrixAPIKey}`,
                    {
                        method: "GET",
                    }
                );

                const geoCode = await response.json();
                const location = geoCode.result[0].geometry.location;

                await updateDoc(doc(db, "salons", dataUpdateInfoForm.id), {
                    image: { name: uImageName, url },
                    name: dataUpdateInfoForm.name,
                    phone: dataUpdateInfoForm.phone,
                    address: {
                        name: dataUpdateInfoForm.address.name,
                        latitude: location.lat,
                        longitude: location.lng,
                    },
                    timeOpen: dataUpdateInfoForm.timeOpen,
                    timeClose: dataUpdateInfoForm.timeClose,
                });

                setIsLoading(false);
                setShowUpdateInfoModal(false);
                message.success("C???p nh???t Salon th??nh c??ng");
            } catch (error) {
                setIsLoading(false);
                message.error(error.message);
            }
        } else {
            try {
                const response = await fetch(
                    `https://api.distancematrix.ai/maps/api/geocode/json?address=${dataUpdateInfoForm.address.name}&key=${distanceMatrixAPIKey}`,
                    {
                        method: "GET",
                    }
                );

                const geoCode = await response.json();
                const location = geoCode.result[0].geometry.location;
                updateDoc(doc(db, "salons", dataUpdateInfoForm.id), {
                    name: dataUpdateInfoForm.name,
                    phone: dataUpdateInfoForm.phone,
                    address: {
                        name: dataUpdateInfoForm.address.name,
                        latitude: location.lat,
                        longitude: location.lng,
                    },
                    timeOpen: dataUpdateInfoForm.timeOpen,
                    timeClose: dataUpdateInfoForm.timeClose,
                });

                setIsLoading(false);
                setShowUpdateInfoModal(false);
                message.success("C???p nh???t Salon th??nh c??ng");
            } catch (error) {
                setIsLoading(false);
                message.error(error.message);
            }
        }

        // if (image) {
        //     const desertRef = ref(
        //         storage,
        //         `images/${dataUpdateInfoForm.image.name}`
        //     );
        //     // Delete the file
        //     deleteObject(desertRef)
        //         .then(() => {
        //             const uImageName = image.name + v4();
        //             const imageRef = ref(storage, `images/${uImageName}`);
        //             uploadBytes(imageRef, image).then(() => {
        //                 getDownloadURL(imageRef).then((url) => {
        //                     updateDoc(
        //                         doc(db, "salons", dataUpdateInfoForm.id),
        //                         {
        //                             image: { name: uImageName, url },
        //                             name: dataUpdateInfoForm.name,
        //                             phone: dataUpdateInfoForm.phone,
        //                             address: dataUpdateInfoForm.address,
        //                             timeOpen: dataUpdateInfoForm.timeOpen,
        //                             timeClose: dataUpdateInfoForm.timeClose,
        //                         }
        //                     ).then(() => {
        //                         setIsLoading(false);
        //                         setShowUpdateInfoModal(false);
        //                         message.success("C???p nh???t Salon th??nh c??ng");
        //                     });
        //                 });
        //             });
        //         })
        //         .catch((error) => {
        //             setIsLoading(false);
        //             message.error(error.message);
        //         });
        // } else {
        //     updateDoc(doc(db, "salons", dataUpdateInfoForm.id), {
        //         name: dataUpdateInfoForm.name,
        //         phone: dataUpdateInfoForm.phone,
        //         address: dataUpdateInfoForm.address,
        //         timeOpen: dataUpdateInfoForm.timeOpen,
        //         timeClose: dataUpdateInfoForm.timeClose,
        //     })
        //         .then(() => {
        //             setIsLoading(false);
        //             setShowUpdateInfoModal(false);
        //             message.success("C???p nh???t Salon th??nh c??ng");
        //         })
        //         .catch((error) => {
        //             setIsLoading(false);
        //             message.error(error.message);
        //         });
        // }
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
                        completionTime: parseInt(
                            dataAddServiceForm.completionTime
                        ),
                        salonId: salon.id,
                    }).then(() => {
                        setDataAddServiceForm({
                            image: "",
                            name: "",
                            price: "",
                            completionTime: "",
                        });
                        setIsLoading(false);
                        getServices();
                        setShowAddServiceModal(false);
                        message.success("Th??m salon th??nh c??ng");
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
                                completionTime:
                                    dataUpdateServiceForm.completionTime,
                            }
                        )
                            .then(() => {
                                setIsLoading(false);
                                getServices();
                                setShowUpdateServiceModal(false);
                                message.success("C???p nh???t d???ch v??? th??nh c??ng");
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
                completionTime: dataUpdateServiceForm.completionTime,
            })
                .then(() => {
                    setIsLoading(false);
                    getServices();
                    setShowUpdateServiceModal(false);
                    message.success("C???p nh???t d???ch v??? th??nh c??ng");
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
                message.success("X??a d???ch v??? th??nh c??ng");
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
            title: "T??n d???ch v???",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "H??nh ???nh",
            dataIndex: "image",
            key: "image",
            width: 100,
            render: (_, { image }) => <Image width={100} src={image.url} />,
        },
        {
            title: "Gi?? (VN??)",
            dataIndex: "price",
            key: "price",
            render: (_, { price }) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(price),
        },
        {
            title: "Th???i gian",
            dataIndex: "completionTime",
            key: "completionTime",
            render: (_, { completionTime }) => completionTime + " ph??t",
        },
        {
            title: "T??y ch???n",
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
                        S???a
                    </Button>
                    <Popconfirm
                        title="X??a d???ch v??? n??y ?"
                        placement="left"
                        onConfirm={() => handleDeleteService(record)}
                    >
                        <Button type="primary" danger>
                            X??a
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
                            <Descriptions.Item label="Ho???t ?????ng">
                                {`${salon.timeOpen} - ${salon.timeClose}`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Li??n h???">
                                {salon.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="?????a ch???">
                                {salon.address.name}
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: 20 }}>
                            <Button
                                type="primary"
                                onClick={handleShowUpdateInfoModal}
                            >
                                Ch???nh s???a th??ng tin
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
                D???ch v???
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
                title="Ch???nh s???a th??ng tin"
                // transitionName=""
                // maskTransitionName=""

                onCancel={() => setShowUpdateInfoModal(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setShowUpdateInfoModal(false)}
                    >
                        ????ng
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUpdateInfo}
                        loading={isLoading}
                    >
                        C???p nh???t
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
                        {
                            name: "address",
                            value: dataUpdateInfoForm.address.name,
                        },
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
                        address: dataUpdateInfoForm.address.name,
                        timeOpen: moment(dataUpdateInfoForm.timeOpen, "HH:mm"),
                        timeClose: moment(dataUpdateInfoForm.timeOpen, "HH:mm"),
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        name="image"
                        label="???nh ?????i di???n"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        onChange={handleOnChangeImage}
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng ch???n ???nh salon",
                            },
                        ]}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Ch???n ???nh</Button>
                        </Upload>
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
                        label="S??? ??i???n tho???i"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p s??? ??i???n tho???i",
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
                        label="?????a ch???"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p ?????a ch???",
                            },
                        ]}
                        onChange={(e) =>
                            setDataUpdateInfoForm({
                                ...dataUpdateInfoForm,
                                address: {
                                    ...dataUpdateInfoForm.address,
                                    name: e.target.value,
                                },
                            })
                        }
                    >
                        <Input />
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
                        label="Th???i gian ????ng c???a"
                        name="timeClose"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng ch???n th???i gian m??? c???a",
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
                title="Th??m d???ch v???"
                transitionName=""
                maskTransitionName=""
                onCancel={handleCloseAddServiceModal}
                footer={[
                    <Button key="back" onClick={handleCloseAddServiceModal}>
                        ????ng
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAddService}
                        loading={isLoading}
                    >
                        Th??m
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
                        label="???nh"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        onChange={handleOnChangeImage}
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng ch???n ???nh d???ch v???",
                            },
                        ]}
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Ch???n ???nh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="T??n d???ch v???"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p t??n d???ch v???",
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
                        label="Gi??"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p gi?? d???ch v???!",
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

                    <Form.Item
                        label="Th???i gian"
                        name="completionTime"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p th???i gian ho??n th??nh!",
                            },
                        ]}
                        onChange={(e) =>
                            setDataAddServiceForm({
                                ...dataAddServiceForm,
                                completionTime: e.target.value,
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
                title="C???p nh???t d???ch v???"
                transitionName=""
                maskTransitionName=""
                onCancel={() => setShowUpdateServiceModal(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setShowUpdateServiceModal(false)}
                    >
                        ????ng
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleUpdateService}
                        loading={isLoading}
                    >
                        L??u thay ?????i
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
                        {
                            name: "completionTime",
                            value: dataUpdateServiceForm.completionTime,
                        },
                    ]}
                    initialValues={{
                        name: dataUpdateServiceForm.name,
                        price: dataUpdateServiceForm.price,
                        completionTime: dataUpdateServiceForm.completionTime,
                    }}
                    autoComplete="off"
                    // onFinish={handleUpdateFood}
                >
                    <Form.Item
                        name="image"
                        label="???nh"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        onChange={handleOnChangeImage}
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng ch???n ???nh d???ch v???",
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
                            <Button icon={<UploadOutlined />}>Ch???n ???nh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="T??n d???ch v???"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p t??n d???ch v???",
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
                        label="Gi?? d???ch v???"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p gi?? d???ch v???",
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

                    <Form.Item
                        label="Th???i gian"
                        name="completionTime"
                        rules={[
                            {
                                required: true,
                                message: "Vui l??ng nh???p th???i gian ho??n th??nh",
                            },
                        ]}
                    >
                        <Input
                            name="completionTime"
                            onChange={(e) =>
                                setDataUpdateServiceForm({
                                    ...dataUpdateServiceForm,
                                    completionTime: parseInt(e.target.value),
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
