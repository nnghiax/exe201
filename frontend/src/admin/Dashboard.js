import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Sidebar from '../admin/Sidebar';
import HeaderAdmin from '../admin/HeaderAdmin';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const [users, setUsers] = useState(0)
  const [stores, setStores] = useState(0)

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
        const resUser = await axios.get('http://localhost:9999/user/count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const resStore = await axios.get('http://localhost:9999/store/count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setUsers(resUser.data.data)
        setStores(resStore.data.data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])

  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <HeaderAdmin />

        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>👥 Người dùng</Card.Title>
                  <Card.Text className="fs-4 fw-semibold">{users}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>📦 Sản phẩm</Card.Title>
                  <Card.Text className="fs-4 fw-semibold">{stores}</Card.Text>
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
