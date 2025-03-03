import { useEffect, useState } from "react"
import axios from "axios"
import './Dashboard.css'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Month names for charts
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

// Colors for charts
const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
]

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`${label}`}</p>
        <p className="tooltip-value">{`${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalApplications, setTotalApplications] = useState(0)
  const [totalReservations, setTotalReservations] = useState(0)
  const [reportData, setReportData] = useState([])
  const [sceneryData, setSceneryData] = useState([])
  const [dependencyData, setDependencyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthlyReservations, setMonthlyReservations] = useState([])
  const [monthlyApplications, setMonthlyApplications] = useState([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const usersResponse = await axios.get("http://localhost:2025/api/user")
        setTotalUsers(usersResponse.data.length)

        const applicationsResponse = await axios.get("http://localhost:2025/api/application")
        setTotalApplications(applicationsResponse.data.length)
        setReportData(applicationsResponse.data)

        // Process application data by month
        const appsByMonth = processDataByMonth(applicationsResponse.data)
        setMonthlyApplications(appsByMonth)

        // Process dependency data
        const dependencyCounts = applicationsResponse.data.reduce((acc, app) => {
          if (app.dependence) {
            acc[app.dependence] = (acc[app.dependence] || 0) + 1
          }
          return acc
        }, {})

        const dependencyChartData = Object.entries(dependencyCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6) // Get top 6 dependencies

        setDependencyData(dependencyChartData)

        const reservationsResponse = await axios.get("http://localhost:2025/api/reservation")
        setTotalReservations(reservationsResponse.data.length)

        // Process reservation data by month
        const reservationsByMonth = processDataByMonth(reservationsResponse.data)
        setMonthlyReservations(reservationsByMonth)

        // Process scenery data
        const sceneryCounts = reservationsResponse.data.reduce((acc, resv) => {
          if (resv.scenery) {
            acc[resv.scenery] = (acc[resv.scenery] || 0) + 1
          }
          return acc
        }, {})

        const sceneryChartData = Object.entries(sceneryCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6) // Get top 6 sceneries

        setSceneryData(sceneryChartData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to process data by month
  const processDataByMonth = (data) => {
    const monthlyData = Array(12).fill(0)

    data.forEach((item) => {
      if (item.createdAt) {
        const date = new Date(item.createdAt)
        const month = date.getMonth()
        monthlyData[month]++
      }
    })

    return monthlyData
  }

  // Process report types
  const damageCounts = reportData.reduce((acc, report) => {
    if (report.reportType) {
      acc[report.reportType] = (acc[report.reportType] || 0) + 1
    }
    return acc
  }, {})

  // Process status counts
  const statusCounts = reportData.reduce((acc, report) => {
    if (report.status) {
      acc[report.status] = (acc[report.status] || 0) + 1
    }
    return acc
  }, {})

  // Convert to chart data format
  const damageChartData = Object.keys(damageCounts).map((key) => ({ name: key, value: damageCounts[key] }))
  const statusChartData = Object.keys(statusCounts).map((key) => ({ name: key, value: statusCounts[key] }))

  // Format monthly data for charts
  const monthlyReservationsData = monthlyReservations.map((value, index) => ({
    name: MONTHS[index],
    value,
  }))

  const monthlyApplicationsData = monthlyApplications.map((value, index) => ({
    name: MONTHS[index],
    value,
  }))

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Cargando datos...</h2>
      </div>
    )
  }

  return (
    <div className="body-dashboard dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Control</h1>
        <p>Visualización de datos y estadísticas del sistema</p>
      </header>

      <div className="stats-cards">
        {/* Total Users Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Total de Usuarios</h3>
            <span className="icon users-icon"></span>
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{totalUsers}</div>
            <p className="stat-trend positive">
              <span className="trend-arrow">↗</span>
              12% más que el mes pasado
            </p>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart
                data={[
                  { name: "Ene", value: 65 },
                  { name: "Feb", value: 59 },
                  { name: "Mar", value: 84 },
                  { name: "Abr", value: 84 },
                  { name: "May", value: 51 },
                  { name: "Jun", value: 55 },
                  { name: "Jul", value: totalUsers },
                ]}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Applications Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Total de Solicitudes</h3>
            <span className="icon applications-icon"></span>
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{totalApplications}</div>
            <p className="stat-trend positive">
              <span className="trend-arrow">↗</span>
              8% más que el mes pasado
            </p>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={monthlyApplicationsData.slice(0, 7)} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Reservations Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Total de Reservas</h3>
            <span className="icon reservations-icon"></span>
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{totalReservations}</div>
            <p className="stat-trend positive">
              <span className="trend-arrow">↗</span>
              15% más que el mes pasado
            </p>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={monthlyReservationsData.slice(0, 7)} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <Line type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <div className="tabs-nav">
            <button
              className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Resumen
            </button>
            <button
              className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              Análisis
            </button>
          </div>
          <div className="tabs-actions">
            <div className="dropdown">
              <button className="dropdown-button">
                <span className="more-icon">⋮</span>
              </button>
              <div className="dropdown-content">
                <a href="#">Descargar PDF</a>
                <a href="#">Exportar datos</a>
                <a href="#">Compartir</a>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content" style={{ display: activeTab === "overview" ? "block" : "none" }}>
          <div className="charts-grid">
            {/* Report Types Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Tipos de Reportes</h3>
                <p>Distribución por categoría</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={damageChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {damageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Application Status Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Estado de Solicitudes</h3>
                <p>Distribución por estado actual</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Most Reserved Scenarios Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Escenarios más Reservados</h3>
                <p>Top escenarios por número de reservas</p>
                <span className="badge">Top 6</span>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sceneryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {sceneryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Dependencies with Most Applications Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Dependencias con más Solicitudes</h3>
                <p>Top dependencias por número de solicitudes</p>
                <span className="badge">Top 6</span>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={dependencyData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {dependencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content" style={{ display: activeTab === "analytics" ? "block" : "none" }}>
          <div className="chart-card full-width">
            <div className="chart-card-header">
              <h3>Tendencias Mensuales</h3>
              <p>Solicitudes y reservas por mes</p>
            </div>
            <div className="chart-card-content">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={MONTHS.map((month, index) => ({
                      name: month,
                      solicitudes: monthlyApplications[index] || 0,
                      reservas: monthlyReservations[index] || 0,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="solicitudes" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="reservas" stroke="#f43f5e" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

