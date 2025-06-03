import React, { useEffect, useState } from 'react';
import Sidebar from '../admin/Sidebar';
import HeaderAdmin from '../admin/HeaderAdmin';
import { Container, Row, Col, Table, Card, Navbar, Image, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ManaUser() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user')
        const parseUser = JSON.parse(user)
        if (parseUser.role !== 'admin') {
            navigate('/error')
            return
        }

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9999/user/list', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="d-flex">
            <Sidebar />
            <div
                style={{
                    marginLeft: '250px',
                    flexGrow: 1,
                    backgroundColor: '#f8f9fa',
                    minHeight: '100vh',
                    paddingBottom: '40px',
                }}
            >
                <HeaderAdmin />

                <Container fluid className="px-4">
                    <Row className="mb-3">
                        <Col>
                            <h5 className="fw-bold">Danh sách người dùng</h5>
                        </Col>
                    </Row>

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-3">
                            <Table
                                hover
                                responsive
                                className="align-middle"
                                style={{ minWidth: '750px', tableLayout: 'fixed' }}
                            >
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: '40px', padding: '12px 8px' }}>#</th>
                                        <th style={{ width: '70px', padding: '12px 8px' }}>Avatar</th>
                                        <th style={{ width: '20%', padding: '12px 15px', textAlign: 'left' }}>Họ tên</th>
                                        <th style={{ width: '25%', padding: '12px 15px', textAlign: 'left' }}>Email</th>
                                        <th style={{ width: '15%', padding: '12px 8px', textAlign: 'center' }}>Vai trò</th>
                                        <th style={{ width: '25%', padding: '12px 15px', textAlign: 'left' }}>Địa chỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                <Spinner animation="border" variant="primary" />
                                                <div>Đang tải dữ liệu...</div>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                Không có người dùng nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u, index) => (
                                            <tr key={u._id}>
                                                <td style={{ padding: '12px 8px', textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                                    <Image
                                                        src={u.avatar || '/images/default-avatar.png'}
                                                        roundedCircle
                                                        width={50}
                                                        height={50}
                                                        alt={u.name}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td className="text-start" style={{ padding: '12px 15px' }}>{u.name}</td>
                                                <td className="text-start" style={{ padding: '12px 15px' }}>{u.email}</td>
                                                <td style={{ padding: '12px 8px', textTransform: 'capitalize', fontWeight: '600', textAlign: 'center' }}>{u.role}</td>
                                                <td className="text-start" style={{ padding: '12px 15px' }}>
                                                    {u.address && (u.address.street || u.address.ward || u.address.district || u.address.city)
                                                        ? `${u.address.street || ''}, ${u.address.ward || ''}, ${u.address.district || ''}, ${u.address.city || ''}`
                                                        : 'Chưa cập nhật'}
                                                </td>



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

export default ManaUser;
