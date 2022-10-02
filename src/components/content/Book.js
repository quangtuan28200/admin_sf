import { SearchOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Space,
    Table,
} from "antd";
import Modal from "antd/lib/modal/Modal";
// import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
// import { apiUrl } from "../../contexts/constants";
import { formatDate } from "../../utils/utils";

const ordersData = [
    {
        _id: 1,
        createAt: "2022/09/23 16:50",
        user: {
            name: "Bui Quang Tuan",
            phone: "0387126034",
            address: "Tân Triều, Thanh Trì, Hà Nội",
        },
        services: [
            {
                _id: 1,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 2,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 3,
                name: "Gội đầu",
                price: 50000,
            },
        ],
        totalPrice: 500000,
        status: "CHƯA THANH TOÁN",
    },
    {
        _id: 2,
        createAt: "2022/09/23 16:50",
        user: {
            name: "Bui Quang Tuan",
            phone: "0387126034",
            address: "Tân Triều, Thanh Trì, Hà Nội",
        },
        services: [
            {
                _id: 1,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 2,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 3,
                name: "Gội đầu",
                price: 50000,
            },
        ],
        totalPrice: 500000,
        status: "CHƯA THANH TOÁN",
    },
    {
        _id: 3,
        createAt: "2022/09/23 16:50",
        user: {
            name: "Bui Quang Tuan",
            phone: "0387126034",
            address: "Tân Triều, Thanh Trì, Hà Nội",
        },
        services: [
            {
                _id: 1,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 2,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 3,
                name: "Gội đầu",
                price: 50000,
            },
        ],
        totalPrice: 500000,
        status: "CHƯA THANH TOÁN",
    },
    {
        _id: 4,
        createAt: "2022/09/23 16:50",
        user: {
            name: "Bui Quang Tuan",
            phone: "0387126034",
            address: "Tân Triều, Thanh Trì, Hà Nội",
        },
        services: [
            {
                _id: 1,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 2,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 3,
                name: "Gội đầu",
                price: 50000,
            },
        ],
        totalPrice: 500000,
        status: "CHƯA THANH TOÁN",
    },
    {
        _id: 5,
        createAt: "2022/09/23 16:50",
        user: {
            name: "Bui Quang Tuan",
            phone: "0387126034",
            address: "Tân Triều, Thanh Trì, Hà Nội",
        },
        services: [
            {
                _id: 1,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 2,
                name: "Gội đầu",
                price: 50000,
            },
            {
                _id: 3,
                name: "Gội đầu",
                price: 50000,
            },
        ],
        totalPrice: 500000,
        status: "CHƯA THANH TOÁN",
    },
];

function Order() {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [orders, setOrders] = useState(null);
    const [orderSelect, setOrderSelect] = useState(null);
    const [status, setStatus] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const searchInput = useRef(null);

    // console.log(orders);

    useEffect(() => {
        // axios
        //     .get(`${apiUrl}/orders/getOrderWeb`)
        //     .then((response) => {
        //         if (response.data.success) {
        //             setOrders(response.data.orders);
        //         }
        //     })
        //     .catch((error) => message.error(error));
        setOrders(ordersData);
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const handleShowDetailModal = (bookData) => {
        setStatus(bookData.status);
        setOrderSelect(bookData);
        setShowDetailModal(true);
    };

    const handleUpdateOrderStatus = () => {
        // console.log(status);
        console.log("update status: " + status);
        setShowDetailModal(false);

        // axios
        //     .put(`${apiUrl}/orders/update/${orderSelect._id}`, { status })
        //     .then((res) => {
        //         // console.log(res);
        //         if (res.data.success) {
        //             setOrderSelect(res.data.order);
        //             message.success(res.data.message);
        //             setShowDetailModal(false);
        //         }
        //     })
        //     .catch((error) => message.error(error));
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Nhập giá trị tìm kiếm`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        // icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Đặt lại
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Lọc
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "Mã đặt lịch",
            dataIndex: "_id",
            key: "_id",
            ...getColumnSearchProps("_id"),
        },
        {
            title: "Ngày đặt",
            dataIndex: "createAt",
            key: "createAt",
            render: (_, { createAt }) => formatDate(createAt),
        },
        {
            title: "Tên khách hàng",
            dataIndex: ["user", "name"],
            key: "userName",
            width: 200,
            // sorter: (a, b) => a.customerName.length - b.customerName.length,
            ...getColumnSearchProps(["user", "name"]),
        },
        {
            title: "Số điện thoại",
            dataIndex: ["user", "phone"],
            key: "phone",
            ...getColumnSearchProps(["user", "phone"]),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            with: 80,
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (_, { totalPrice }) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(totalPrice),
        },
        // {
        //     title: "Trạng thái",
        //     key: "status",
        //     dataIndex: "status",
        //     filters: [
        //         {
        //             text: "ĐÃ LÊN LỊCH",
        //             value: "ĐÃ LÊN LỊCH",
        //         },
        //     ],
        //     // filterMode: "tree",
        //     // filterSearch: true,
        //     onFilter: (value, record) => record.status === value,
        //     render: (_, { status }) => {
        //         let color;
        //         switch (status) {
        //             case "CHƯA XÁC NHẬN":
        //                 color = "#989fa6";
        //                 break;
        //             case "CHUẨN BỊ":
        //                 color = "yellow";
        //                 break;
        //             case "ĐANG GIAO":
        //                 color = "#7CD1A9";
        //                 break;
        //             default:
        //                 color = "volcano";
        //                 break;
        //         }

        //         return (
        //             <Tag
        //                 style={{ textAlign: "center", width: 111 }}
        //                 color={color}
        //                 key={status}
        //             >
        //                 {status}
        //             </Tag>
        //         );
        //     },
        // },

        {
            title: "Tùy chọn",
            key: "action",
            render: (record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() => handleShowDetailModal(record)}
                    >
                        Chi tiết
                    </Button>
                </Space>
            ),
        },
    ];

    const columnOrderDetail = [
        {
            title: "STT",
            // dataIndex: "_id",
            key: "_id",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Tên món",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
            render: (_, { price }) =>
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(price),
        },
    ];

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

    return (
        <>
            <Table
                bordered
                rowKey="_id"
                columns={columns}
                dataSource={orders}
            />
            {/* edit modal */}
            {orderSelect && (
                <Modal
                    // width={1000}
                    destroyOnClose={true}
                    open={showDetailModal}
                    title="Chi tiết đặt lịch"
                    transitionName=""
                    maskTransitionName=""
                    onCancel={() => setShowDetailModal(false)}
                    footer={[
                        <Button
                            key="back"
                            onClick={() => setShowDetailModal(false)}
                        >
                            Đóng
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleUpdateOrderStatus}
                        >
                            Cập nhật trạng thái
                        </Button>,
                    ]}
                >
                    <p className="site-description-item-profile-p">
                        Thông tin lịch hẹn
                    </p>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Mã lịch hẹn"
                                content={orderSelect._id}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Thời gian đặt"
                                content={formatDate(orderSelect.createAt)}
                            />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">
                        Thông tin khách hàng
                    </p>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Họ và Tên"
                                content={orderSelect.user.name}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Số điện thoại"
                                content={orderSelect.user.phone}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Địa chỉ"
                                content={orderSelect.user.address}
                            />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Dịch vụ</p>
                    <Table
                        bordered
                        rowKey="_id"
                        columns={columnOrderDetail}
                        dataSource={orderSelect.services}
                        footer={() => (
                            <p style={{ textAlign: "end", margin: 0 }}>
                                {"Tổng: " +
                                    new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(orderSelect.totalPrice)}
                            </p>
                        )}
                    />

                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        fields={[{ name: "status", value: status }]}
                        initialValues={{
                            remember: true,
                            status: status,
                        }}
                        autoComplete="off"
                        // onFinish={handleUpdateFood}
                    >
                        <Form.Item label="Trạng thái" name="status">
                            <Select
                                // defaultValue={status}
                                onChange={(value) => setStatus(value)}
                            >
                                <Select.Option value={"CHƯA THANH TOÁN"}>
                                    CHƯA THANH TOÁN
                                </Select.Option>
                                <Select.Option value={"ĐÃ THANH TOÁN"}>
                                    ĐÃ THANH TOÁN
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </>
    );
}

export default Order;
