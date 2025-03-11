import { useEffect, useState } from "react"
import axios from "axios"
import './DashboardR.css'
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  const [totalReservations, setTotalReservations] = useState(0)
  const [activeReservations, setActiveReservations] = useState(0)
  const [reservationData, setReservationData] = useState([])
  const [sceneryData, setSceneryData] = useState([])
  const [userReservationsData, setUserReservationsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthlyReservations, setMonthlyReservations] = useState([])
  const [reservationGrowthData, setReservationGrowthData] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [timeDistribution, setTimeDistribution] = useState([])
  const [durationData, setDurationData] = useState([])
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const usersResponse = await axios.get("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/user", {headers})
        setTotalUsers(usersResponse.data.length)

        const reservationsResponse = await axios.get("https://softinfraestructura-86fdvmh2g-ingdanielbs-projects.vercel.app/api/reservation", {headers})
        setTotalReservations(reservationsResponse.data.length)
        setReservationData(reservationsResponse.data)

        // Count active reservations
        const active = reservationsResponse.data.filter(res => 
          res.estatus === "Reservado" || res.estatus === "Confirmado"
        ).length
        setActiveReservations(active)

        // Process reservation data by month
        const reservationsByMonth = processDataByMonth(reservationsResponse.data)
        setMonthlyReservations(reservationsByMonth)

        // Generate reservation growth data
        const growthData = generateReservationGrowthData(reservationsByMonth)
        setReservationGrowthData(growthData)

        // Process scenery data
        const sceneryCounts = reservationsResponse.data.reduce((acc, res) => {
          if (res.scenery) {
            acc[res.scenery] = (acc[res.scenery] || 0) + 1
          }
          return acc
        }, {})

        const sceneryChartData = Object.entries(sceneryCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6) // Get top 6 sceneries

        setSceneryData(sceneryChartData)

        // Process user reservations data
        const userReservations = processUserReservationsData(
          reservationsResponse.data,
          usersResponse.data
        )
        setUserReservationsData(userReservations)

        // Generate time distribution data
        const timeData = generateTimeDistribution(reservationsResponse.data)
        setTimeDistribution(timeData)

        // Generate duration data
        const durationData = generateDurationData(reservationsResponse.data)
        setDurationData(durationData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to process user reservations data
  const processUserReservationsData = (reservationsData, usersData) => {
    // Create a map of user IDs to reservation counts
    const userReservationCounts = reservationsData.reduce((acc, res) => {
      const userId = res.userId
      acc[userId] = (acc[userId] || 0) + 1
      return acc
    }, {})

    // Create a map of user IDs to names
    const userMap = usersData.reduce((acc, user) => {
      acc[user.id] = user.name || `Usuario ${user.id}`
      return acc
    }, {})

    // Map user data with reservation counts
    return Object.entries(userReservationCounts)
      .map(([userId, count]) => {
        const userName = userMap[userId] || `Usuario ${userId}`
        return {
          id: userId,
          name: userName,
          count: count
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Get top 8 users
  }

  // Helper function to process data by month
  const processDataByMonth = (data) => {
    const monthlyData = Array(12).fill(0)

    data.forEach((item) => {
      if (item.date) {
        const date = new Date(item.date)
        const month = date.getMonth()
        monthlyData[month]++
      }
    })

    return monthlyData
  }

  // Helper function to generate reservation growth data
  const generateReservationGrowthData = (monthlyData) => {
    let accumulated = 0
    return MONTHS.map((month, index) => {
      const newReservations = monthlyData[index] || Math.floor(Math.random() * 10) + 2
      accumulated += newReservations
      return {
        name: month,
        nuevas: newReservations,
        acumuladas: accumulated
      }
    })
  }

  // Helper function to generate time distribution data
  const generateTimeDistribution = (data) => {
    const timeSlots = {
      "Mañana (8-12)": 0,
      "Mediodía (12-14)": 0,
      "Tarde (14-18)": 0
    }
    
    data.forEach(reservation => {
      if (reservation.startTime) {
        const hour = parseInt(reservation.startTime.split(':')[0])
        
        if (hour >= 8 && hour < 12) {
          timeSlots["Mañana (8-12)"]++
        } else if (hour >= 12 && hour < 14) {
          timeSlots["Mediodía (12-14)"]++
        } else if (hour >= 14 && hour < 18) {
          timeSlots["Tarde (14-18)"]++
        }
      }
    })
    
    return Object.entries(timeSlots).map(([name, value]) => ({ name, value }))
  }

  // Helper function to generate duration data
  const generateDurationData = (data) => {
    const durations = []
    
    data.forEach(reservation => {
      if (reservation.startTime && reservation.finishTime) {
        const start = new Date(`2000-01-01T${reservation.startTime}`)
        const end = new Date(`2000-01-01T${reservation.finishTime}`)
        const durationHours = (end - start) / (1000 * 60 * 60)
        
        durations.push({
          id: reservation.id,
          scenery: reservation.scenery,
          duration: durationHours,
          activity: reservation.activity
        })
      }
    })
    
    return durations.sort((a, b) => b.duration - a.duration).slice(0, 10)
  }

  // Process status counts
  const statusCounts = reservationData.reduce((acc, reservation) => {
    if (reservation.estatus) {
      acc[reservation.estatus] = (acc[reservation.estatus] || 0) + 1
    }
    return acc
  }, {})

  // Convert to chart data format
  const statusChartData = Object.keys(statusCounts).map((key) => ({ name: key, value: statusCounts[key] }))

  // Format monthly data for charts
  const monthlyReservationsData = monthlyReservations.map((value, index) => ({
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
        <h1>Panel de Control de Reservas</h1>
        <p>Visualización de datos y estadísticas de reservas</p>
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

        {/* Total Reservations Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Total de Reservas</h3>
            <span className="icon applications-icon"></span>
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{totalReservations}</div>
            <p className="stat-trend positive">
              <span className="trend-arrow">↗</span>
              8% más que el mes pasado
            </p>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={monthlyReservationsData.slice(0, 7)} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Reservations Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Reservas Activas</h3>
            <span className="icon completed-icon"></span>
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{activeReservations}</div>
            <p className="stat-trend positive">
              <span className="trend-arrow">↗</span>
              10% más que el mes pasado
            </p>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart 
                data={[
                  { name: "Ene", value: 15 },
                  { name: "Feb", value: 22 },
                  { name: "Mar", value: 28 },
                  { name: "Abr", value: 32 },
                  { name: "May", value: 25 },
                  { name: "Jun", value: 38 },
                  { name: "Jul", value: activeReservations },
                ]} 
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
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
        </div>

        <div className="tab-content" style={{ display: activeTab === "overview" ? "block" : "none" }}>
          <div className="charts-grid">
            {/* Time Distribution Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Distribución por Horario</h3>
                <p>Reservas por franja horaria</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={timeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {timeDistribution.map((entry, index) => (
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

            {/* Reservation Status Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Estado de Reservas</h3>
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

            {/* Users with Most Reservations Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Usuarios con más Reservas</h3>
                <p>Top usuarios por número de reservas realizadas</p>
                <span className="badge">Top 8</span>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={userReservationsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="custom-tooltip">
                                <p className="tooltip-label">{label}</p>
                                <p className="tooltip-value">Reservas: {payload[0].value}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {userReservationsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Most Reserved Sceneries Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Escenarios más Reservados</h3>
                <p>Top escenarios por número de reservas</p>
                <span className="badge">Top 6</span>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={sceneryData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {sceneryData.map((entry, index) => (
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
          <div className="charts-grid">
            {/* Reservation Growth Chart */}
            <div className="chart-card full-width">
              <div className="chart-card-header">
                <h3>Crecimiento de Reservas</h3>
                <p>Nuevas reservas y acumuladas por mes</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={reservationGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="nuevas" stackId="1" stroke="#8884d8" fill="#8884d8" name="Nuevas reservas" />
                      <Area type="monotone" dataKey="acumuladas" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Total acumulado" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Longest Duration Reservations */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Reservas de Mayor Duración</h3>
                <p>Top reservas por horas de duración</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={durationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="scenery" tick={false} />
                      <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="custom-tooltip">
                                <p className="tooltip-label">{data.scenery}</p>
                                <p className="tooltip-value">Duración: {data.duration} horas</p>
                                <p className="tooltip-subtitle">Actividad: {data.activity || "No especificada"}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Bar dataKey="duration" name="Duración (horas)" radius={[4, 4, 0, 0]}>
                        {durationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Monthly Reservations Trend */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Tendencia Mensual de Reservas</h3>
                <p>Reservas por mes</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={monthlyReservationsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} name="Reservas" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
