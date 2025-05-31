import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Navbar } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Sidebar from '../admin/Sidebar';
import { useNavigate } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Doanh thu',
      data: [500, 700, 400, 650, 800],
      backgroundColor: 'rgba(75,192,192,0.6)'
    }]
  };

  const navigate = useNavigate()
  
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/error')
      return;
    }
  })

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Navbar bg="white" className="px-4 shadow-sm">
          <Navbar.Brand className="fw-bold">📊 Trang quản trị</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>Chào, Admin 👤</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>👥 Người dùng</Card.Title>
                  <Card.Text className="fs-4 fw-semibold">120</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>📦 Sản phẩm</Card.Title>
                  <Card.Text className="fs-4 fw-semibold">320</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>💰 Doanh thu</Card.Title>
                  <Card.Text className="fs-4 fw-semibold">45,000,000 VNĐ</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>📈 Biểu đồ doanh thu</Card.Title>
                  <Bar data={chartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
