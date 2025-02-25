import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { FaUser, FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const [totalReservas, setTotalReservas] = useState(0);
  const [reportData, setReportData] = useState([]);
  const [sceneryData, setSceneryData] = useState([]); // Estado para escenarios

  useEffect(() => {
    axios.get("http://localhost:2025/api/user").then((res) => {
      setTotalUsuarios(res.data.length);
    });

    axios.get("http://localhost:2025/api/application").then((res) => {
      setTotalSolicitudes(res.data.length);
    });

    axios.get("http://localhost:2025/api/reservation").then((res) => {
      setTotalReservas(res.data.length);
      
      // Procesar datos de escenarios
      const sceneryCounts = res.data.reduce((acc, resv) => {
        acc[resv.scenery] = (acc[resv.scenery] || 0) + 1;
        return acc;
      }, {});

      // Convertir a formato de gráfico
      const sceneryChartData = Object.keys(sceneryCounts).map((key) => ({
        name: key,
        value: sceneryCounts[key],
      }));

      setSceneryData(sceneryChartData);
    });

    axios.get("http://localhost:2025/api/application").then((res) => {
      setReportData(res.data);
    });
  }, []);

  const damageCounts = reportData.reduce((acc, report) => {
    acc[report.reportType] = (acc[report.reportType] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = reportData.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  const damageChartData = Object.keys(damageCounts).map((key) => ({ name: key, value: damageCounts[key] }));
  const statusChartData = Object.keys(statusCounts).map((key) => ({ name: key, value: statusCounts[key] }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6666", "#66CC99", "#D4A017"];

  return (
    <div className="container mt-4">
      <Row>
        <Col md={4} className="d-flex justify-content-start">
          <Card className="shadow text-center p-2">
            <FaClipboardList size={40} className="text-primary mb-2" />
            <h6>Total de Solicitudes</h6>
            <h4>{totalSolicitudes}</h4>
          </Card>
        </Col>

        <Col md={4} className="d-flex justify-content-center">
          <Card className="shadow text-center p-2">
            <FaCalendarAlt size={40} className="text-warning mb-2" />
            <h6>Total de Reservas</h6>
            <h4>{totalReservas}</h4>
          </Card>
        </Col>
        
        <Col md={4} className="d-flex justify-content-end">
          <Card className="shadow text-center p-2">
            <FaUser size={40} className="text-danger mb-2" />
            <h6>Total de Usuarios</h6>
            <h4>{totalUsuarios}</h4>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="shadow p-3">
            <h6 className="text-center">Tipos de Daños Reportados</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={damageChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {damageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow p-3">
            <h6 className="text-center">Estado de Solicitudes</h6>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" outerRadius={100}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Nueva Sección: Escenarios con más registros */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow p-3">
            <h6 className="text-center">Escenarios con más Reservas</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sceneryData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {sceneryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;