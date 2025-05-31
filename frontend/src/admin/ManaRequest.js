import React, { useEffect, useState } from 'react';
import {
    Container, Row, Col, Table, Card, Button, Badge,
    Spinner, Navbar, Modal
} from 'react-bootstrap';
import Sidebar from '../admin/Sidebar';
import axios from 'axios';

function ManaRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get('http://localhost:9999/request/list', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setRequests(res.data.data);
            } catch (error) {
                console.error('Lỗi khi tải yêu cầu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <Badge bg="warning" text="dark">Chờ duyệt</Badge>;
            case 'approved': return <Badge bg="success">Đã duyệt</Badge>;
            case 'rejected': return <Badge bg="danger">Từ chối</Badge>;
            default: return <Badge bg="secondary">Không rõ</Badge>;
        }
    };

    const handleViewDetail = (req) => {
        setSelectedRequest(req);
        setShowModal(true);
    };

    const handleApproved = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.put(`http://localhost:9999/request/approve/${selectedRequest._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            alert('✅ Duyệt yêu cầu thành công!');
            setShowModal(false);
            setRequests(prev =>
                prev.map(req =>
                    req._id === selectedRequest._id ? { ...req, status: 'approved' } : req
                )
            );
        } catch (error) {
            console.error('Lỗi khi duyệt yêu cầu:', error.response?.data || error.message);
        }
    }

    const handleRejected = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:9999/request/reject/${selectedRequest._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('❌ Từ chối yêu cầu thành công!');
            setShowModal(false);
            setRequests(prev =>
                prev.map(req =>
                    req._id === selectedRequest._id ? { ...req, status: 'rejected' } : req
                )
            );
        } catch (error) {
            console.error('Lỗi khi từ chối yêu cầu:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (rid) => {
        const confirm = window.confirm('Bạn có chắc muốn xóa yêu cầu này không ?')
        if(confirm){
            try {
                const res = await axios.delete(`http://localhost:9999/request/delete/${rid}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                alert('Xóa yêu cầu thành công');
                setRequests(requests.filter(req => req._id !== rid))
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <div style={{ marginLeft: '250px', flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8f9fa', paddingBottom: '40px' }}>
                <Navbar bg="white" className="px-4 shadow-sm mb-4">
                    <Navbar.Brand className="fw-bold">📝 Quản lý yêu cầu mở cửa hàng</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>Chào, Admin 👤</Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>

                <Container fluid className="px-4">
                    <Row className="mb-3">
                        <Col><h5 className="fw-bold">Danh sách yêu cầu</h5></Col>
                    </Row>

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-3">
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <div>Đang tải dữ liệu...</div>
                                </div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-5 text-muted">Không có yêu cầu nào.</div>
                            ) : (
                                <Table responsive hover className="align-middle text-center">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Người gửi</th>
                                            <th>Email</th>
                                            <th>Ngày gửi</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((req, idx) => (
                                            <tr key={req._id}>
                                                <td>{idx + 1}</td>
                                                <td className="text-start">{req.name}</td>
                                                <td className="text-start">{req.email}</td>
                                                <td>{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                                                <td>{renderStatusBadge(req.status)}</td>
                                                <td>
                                                    <Button size="sm" variant="info text-white" className="me-2" onClick={() => handleViewDetail(req)}>
                                                        Xem chi tiết
                                                    </Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDelete(req._id)}>Xóa</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Container>

                {/* Modal Chi tiết */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết yêu cầu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRequest && (
                            <div>
                                <p><strong>👤 Người gửi:</strong> {selectedRequest.name}</p>
                                <p><strong>📧 Email:</strong> {selectedRequest.email}</p>
                                <p><strong>🏪 Tên cửa hàng:</strong> {selectedRequest.store}</p>
                                <p><strong>📄 Mô tả:</strong> {selectedRequest.description}</p>
                                <p><strong>📍 Địa chỉ:</strong> {
                                    `${selectedRequest.address?.street}, ${selectedRequest.address?.ward}, ${selectedRequest.address?.district}, ${selectedRequest.address?.city}`
                                }</p>
                                <p><strong>📞 Số điện thoại:</strong> {selectedRequest.phone}</p>
                                <p><strong>📅 Ngày gửi:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString('vi-VN')}</p>
                                <p><strong>🔖 Trạng thái:</strong> {renderStatusBadge(selectedRequest.status)}</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {selectedRequest?.status === 'pending' && (
                            <>
                                <Button variant="success" onClick={handleApproved}>Duyệt yêu cầu</Button>
                                <Button variant="danger" onClick={handleRejected}>Từ chối</Button>
                            </>
                        )}
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ManaRequest;
