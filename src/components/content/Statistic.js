import { SearchOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Input,
    Row,
    Space,
    Table,
    Tag,
    Statistic,
    Divider,
    Modal,
    message,
} from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { db } from "../../ConfigDB/firebase";
import { formatDate } from "../../utils/utils";

function StatisticScreen({ salon }) {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [orders, setOrders] = useState(null);
    const [orderSelect, setOrderSelect] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const getOrders = () => {
        onSnapshot(
            collection(db, "orders"),
            (snapshot) => {
                const ordersData = [];
                snapshot.docs.forEach((order) => {
                    if (
                        order.data().salon.id === salon.id &&
                        order.data().status !== "CHƯA THANH TOÁN"
                    ) {
                        ordersData.push({
                            ...order.data(),
                            id: order.id,
                        });
                    }
                });
                setOrders(ordersData);
            },
            (error) => {
                message.error(error.message);
            }
        );
    };

    useEffect(() => {
        getOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const searchInput = useRef(null);

    const handleShowDetailModal = (bookData) => {
        setOrderSelect(bookData);
        setShowDetailModal(true);
    };

    const Sum =
        orders && orders.length > 0
            ? orders.reduce(
                  (Sum, order) =>
                      order.status === "ĐÃ THANH TOÁN"
                          ? Sum + order.totalPrice
                          : Sum + 0,
                  0
              )
            : 0;

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
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
            title: "Mã đăt lịch",
            dataIndex: "id",
            key: "id",
            ...getColumnSearchProps("id"),
        },
        {
            title: "Ngày đặt",
            dataIndex: "date",
            key: "date",
            render: (_, { date }) => formatDate(date),
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
        {
            title: "Trạng thái",
            key: "status",
            dataIndex: "status",
            filters: [
                {
                    text: "ĐÃ THANH TOÁN",
                    value: "ĐÃ THANH TOÁN",
                },
                {
                    text: "ĐÃ HỦY",
                    value: "ĐÃ HỦY",
                },
            ],
            // filterMode: "tree",
            // filterSearch: true,
            onFilter: (value, record) => record.status === value,
            render: (_, { status }) => {
                let color;
                switch (status) {
                    case "ĐÃ THANH TOÁN":
                        color = "green";
                        break;
                    default:
                        color = "volcano";
                        break;
                }

                return (
                    <Tag
                        style={{ textAlign: "center", width: 111 }}
                        color={color}
                        key={status}
                    >
                        {status}
                    </Tag>
                );
            },
        },

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
            // dataIndex: "id",
            key: "id",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Tên dịch vụ",
            dataIndex: "name",
            key: "name",
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

    return (
        <>
            <Table bordered rowKey="id" columns={columns} dataSource={orders} />

            <Row style={{ marginTop: 30 }}>
                <Col span={24} offset={4}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Statistic
                                title="Đã Thanh Toán"
                                value={
                                    orders
                                        ? orders.filter(
                                              (order) =>
                                                  order.status ===
                                                  "ĐÃ THANH TOÁN"
                                          ).length
                                        : 0
                                }
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Đã Hủy"
                                value={
                                    orders
                                        ? orders.filter(
                                              (order) =>
                                                  order.status === "ĐÃ HỦY"
                                          ).length
                                        : 0
                                }
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Doanh Thu (VNĐ)"
                                value={Sum}
                                precision={0}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={16}>
                        <Col span={6}>
                            <Statistic
                                title="Nhận xét"
                                value={salon.rateCount}
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Đánh giá"
                                value={
                                    Math.round(
                                        (salon.star / salon.rateCount) * 10
                                    ) / 10
                                }
                                suffix="/ 5"
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

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
                    ]}
                >
                    <p className="site-description-item-profile-p">
                        Thông tin lịch hẹn
                    </p>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Mã lịch hẹn"
                                content={orderSelect.id}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem
                                title="Thời gian đặt"
                                content={formatDate(orderSelect.date)}
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
                                title="ID"
                                content={orderSelect.user.uid}
                            />
                        </Col>
                    </Row>
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
                                content={orderSelect.user.address.name}
                            />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Dịch vụ</p>
                    <Table
                        bordered
                        rowKey="id"
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
                </Modal>
            )}
        </>
    );
}

export default StatisticScreen;
