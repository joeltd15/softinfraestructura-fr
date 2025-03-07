import { useEffect, useState } from "react"
import axios from "axios"
import './DashboardM.css'
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
  const [totalApplications, setTotalApplications] = useState(0)
  const [totalCompletedApplications, setTotalCompletedApplications] = useState(0)
  const [reportData, setReportData] = useState([])
  const [dependencyData, setDependencyData] = useState([])
  const [responsibleData, setResponsibleData] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthlyApplications, setMonthlyApplications] = useState([])
  const [applicationGrowthData, setApplicationGrowthData] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [applicationPerformance, setApplicationPerformance] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const usersResponse = await axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/user")
        setTotalUsers(usersResponse.data.length)

        const applicationsResponse = await axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/application")
        setTotalApplications(applicationsResponse.data.length)
        setReportData(applicationsResponse.data)

        // Count completed applications
        const completedApps = applicationsResponse.data.filter(app => 
          app.status === "Realizado" || app.status === "Realizado" || app.status === "Realizado"
        ).length
        setTotalCompletedApplications(completedApps)

        // Process application data by month
        const appsByMonth = processDataByMonth(applicationsResponse.data)
        setMonthlyApplications(appsByMonth)

        // Generate application growth data
        const growthData = generateApplicationGrowthData(appsByMonth)
        setApplicationGrowthData(growthData)

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

        // Fetch responsible persons and assignments
        const responsibleResponse = await axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/responsible")
        const assignmentsResponse = await axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/assignment")
        
        // Process responsible persons data with completed assignments count
        const responsibleWithCompletedAssignments = processResponsibleDataWithCompletedStatus(
          responsibleResponse.data, 
          assignmentsResponse.data,
          applicationsResponse.data,
          usersResponse.data
        )
        setResponsibleData(responsibleWithCompletedAssignments)

        // Generate application performance data (simulated)
        const performanceData = generateApplicationPerformanceData()
        setApplicationPerformance(performanceData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to process responsible data with completed assignments count
  const processResponsibleDataWithCompletedStatus = (responsibleData, assignmentsData, applicationsData, usersData) => {
    // Create a map of application IDs to their status
    const applicationStatusMap = applicationsData.reduce((acc, app) => {
      acc[app.id] = app.status
      return acc
    }, {})

    // Create a map of responsible IDs to completed assignment counts
    const completedAssignmentCounts = assignmentsData.reduce((acc, assignment) => {
      const responsibleId = assignment.responsibleId
      const applicationId = assignment.applicationId
      const status = applicationStatusMap[applicationId]
      
      // Only count assignments with completed status
      if (status === "Realizado" || status === "Realizado" || status === "Cerrado") {
        acc[responsibleId] = (acc[responsibleId] || 0) + 1
      }
      
      return acc
    }, {})

    // Create a map of user IDs to names
    const userMap = usersData.reduce((acc, user) => {
      acc[user.id] = user.name || `Usuario ${user.id}`
      return acc
    }, {})

    // Map responsible data with completed assignment counts and user names
    return responsibleData.map(responsible => {
      const completedCount = completedAssignmentCounts[responsible.id] || 0
      const userName = userMap[responsible.userId] || `Encargado ${responsible.id}`
      
      // Get the first few responsibilities to display in the name
      const responsibilities = responsible.Responsibilities || []
      const responsibilityNames = responsibilities.map(r => r.name).slice(0, 2)
      const displayName = responsibilityNames.length > 0 
        ? `${userName} (${responsibilityNames.join(', ')}${responsibilities.length > 2 ? '...' : ''})`
        : userName

      return {
        id: responsible.id,
        name: displayName,
        count: completedCount,
        responsibilities: responsibilities.map(r => r.name)
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8) // Get top 8 responsible persons
  }

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

  // Helper function to generate application growth data
  const generateApplicationGrowthData = (monthlyData) => {
    let accumulated = 0
    return MONTHS.map((month, index) => {
      const newApps = monthlyData[index] || Math.floor(Math.random() * 20) + 5
      accumulated += newApps
      return {
        name: month,
        nuevas: newApps,
        acumuladas: accumulated
      }
    })
  }

  // Helper function to generate application performance data
  const generateApplicationPerformanceData = () => {
    return [
      { subject: 'Tiempo de respuesta', A: Math.floor(Math.random() * 100) + 60, fullMark: 150 },
      { subject: 'Satisfacción', A: Math.floor(Math.random() * 100) + 70, fullMark: 150 },
      { subject: 'Completitud', A: Math.floor(Math.random() * 100) + 80, fullMark: 150 },
      { subject: 'Eficiencia', A: Math.floor(Math.random() * 100) + 65, fullMark: 150 },
      { subject: 'Resolución', A: Math.floor(Math.random() * 100) + 75, fullMark: 150 },
    ]
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

        {/* Completed Applications Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Solicitudes Completadas</h3>
            <span className="icon completed-icon"></span>
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{totalCompletedApplications}</div>
            <p className="stat-trend positive">
              <span className="trend-arrow">↗</span>
              10% más que el mes pasado
            </p>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart 
                data={[
                  { name: "Ene", value: 25 },
                  { name: "Feb", value: 32 },
                  { name: "Mar", value: 38 },
                  { name: "Abr", value: 42 },
                  { name: "May", value: 35 },
                  { name: "Jun", value: 48 },
                  { name: "Jul", value: totalCompletedApplications },
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

            {/* Responsible Persons with Completed Assignments Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Encargados con más Solicitudes Realizadas</h3>
                <p>Top encargados por número de solicitudes completadas</p>
                <span className="badge">Top 8</span>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={responsibleData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const responsible = responsibleData.find(r => r.name === label)
                            return (
                              <div className="custom-tooltip">
                                <p className="tooltip-label">{label}</p>
                                <p className="tooltip-value">Solicitudes completadas: {payload[0].value}</p>
                                {responsible && responsible.responsibilities && (
                                  <div className="tooltip-responsibilities">
                                    <p className="tooltip-subtitle">Responsabilidades:</p>
                                    <ul>
                                      {responsible.responsibilities.map((resp, idx) => (
                                        <li key={idx}>{resp}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {responsibleData.map((entry, index) => (
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
          <div className="charts-grid">
            {/* Application Growth Chart */}
            <div className="chart-card full-width">
              <div className="chart-card-header">
                <h3>Crecimiento de Solicitudes</h3>
                <p>Nuevas solicitudes y acumuladas por mes</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={applicationGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="nuevas" stackId="1" stroke="#8884d8" fill="#8884d8" name="Nuevas solicitudes" />
                      <Area type="monotone" dataKey="acumuladas" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Total acumulado" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Application Performance Radar Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Rendimiento de Solicitudes</h3>
                <p>Métricas clave de rendimiento</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={applicationPerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar name="Rendimiento" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Monthly Applications Trend */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Tendencia Mensual de Solicitudes</h3>
                <p>Solicitudes por mes</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={monthlyApplicationsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} name="Solicitudes" />
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