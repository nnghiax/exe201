import React, { useEffect, useState } from 'react';
import { Table, Spinner, Image, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../admin/Sidebar';
import HeaderAdmin from '../admin/HeaderAdmin';
import { useNavigate } from 'react-router-dom';

function ManaStore() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const user = localStorage.getItem('user')
        const parseUser = JSON.parse(user)
        if(parseUser.role !== 'admin'){
            navigate('/error')
            return
        }

        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:9999/store/list');
                setStores(res.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách cửa hàng:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderStatus = (isActive) => {
        return isActive ? (
            <span style={{
                color: 'green',
                fontWeight: '600',
                backgroundColor: '#d4edda',
                padding: '4px 10px',
                borderRadius: '12px',
                display: 'inline-block',
                textAlign: 'center',
                minWidth: '70px'
            }}>
                Hoạt động
            </span>
        ) : (
            <span style={{
                color: 'red',
                fontWeight: '600',
                backgroundColor: '#f8d7da',
                padding: '4px 10px',
                borderRadius: '12px',
                display: 'inline-block',
                textAlign: 'center',
                minWidth: '70px'
            }}>
                Không hoạt động
            </span>
        );
    };


    return (
        <div className="d-flex">
            <Sidebar />
            <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <HeaderAdmin />

                <Container fluid className="px-4">
                    <Row className="mb-3">
                        <Col>
                            <h5 className="fw-bold">📦 Danh sách cửa hàng</h5>
                        </Col>
                    </Row>

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-3">
                            <Table
                                hover
                                responsive
                                className="align-middle"
                                style={{ minWidth: '800px', tableLayout: 'fixed' }}
                            >
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: '40px', padding: '12px 8px', textAlign: 'middle' }}>#</th>
                                        <th style={{ width: '70px', padding: '12px 8px', textAlign: 'middle' }}>Ảnh</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'middle' }}>Tên cửa hàng</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'middle' }}>Chủ cửa hàng</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'middle' }}>SĐT</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'middle' }}>Địa chỉ</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'middle' }}>Ngày tạo</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'middle' }}>Hoạt động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                <Spinner animation="border" variant="primary" />
                                                <div>Đang tải dữ liệu...</div>
                                            </td>
                                        </tr>
                                    ) : stores.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4">
                                                Không có cửa hàng nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        stores.map((store, index) => (
                                            <tr key={store._id}>
                                                <td style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>{index + 1}</td>
                                                <td style={{ padding: '10px', textAlign: 'center', verticalAlign: 'middle' }}>
                                                    <Image
                                                        src={store.image || '/images/default-store.png'}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/images/default-store.png';
                                                        }}
                                                        alt="store"
                                                        width={50}
                                                        height={50}
                                                        rounded
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{store.name}</td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{store.ownerName}</td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{store.phone}</td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{store.address}</td>
                                                <td style={{ padding: '12px 15px', textAlign: 'middle', verticalAlign: 'middle' }}>
                                                    {new Date(store.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td style={{ padding: '12px 15px', verticalAlign: 'middle' }}>{renderStatus(store.isActive)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </Table>
                        </Card.Body>
                    </Card>
                </Container>

            </div>
        </div>
    );
}

export default ManaStore;
