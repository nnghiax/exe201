import React, { useEffect, useState } from 'react';
import Sidebar from '../admin/Sidebar';
import { Container, Row, Col, Table, Card, Navbar, Image, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ManaUser() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/error');
            return;
        }

        const user = JSON.parse(storedUser);
        if (user.role !== 'admin') {
            navigate('/error');
            return;
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
                <Navbar bg="white" className="px-4 shadow-sm mb-4">
                    <Navbar.Brand className="fw-bold">👥 Quản lý người dùng</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>Chào, Admin 👤</Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>

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
                                                    {u.address && u.address.length > 0
                                                        ? `${u.address.find(a => a.isDefault)?.street || u.address[0].street}, ${u.address.find(a => a.isDefault)?.ward || u.address[0].ward}, ${u.address.find(a => a.isDefault)?.district || u.address[0].district}, ${u.address.find(a => a.isDefault)?.city || u.address[0].city}`
                                                        : '—'}
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
