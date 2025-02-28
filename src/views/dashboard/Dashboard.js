"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import CIcon from "@coreui/icons-react"
import { cilArrowTop, cilOptions } from "@coreui/icons"
import { CChartBar, CChartLine, CChartPie } from "@coreui/react-chartjs"

import {
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CWidgetStatsA,
  CCard,
  CCardBody,
  CCardHeader,
} from "@coreui/react"

const Dashboard = () => {
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [totalSolicitudes, setTotalSolicitudes] = useState(0)
  const [totalReservas, setTotalReservas] = useState(0)
  const [reportData, setReportData] = useState([])
  const [sceneryData, setSceneryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthlyReservations, setMonthlyReservations] = useState([])
  const [monthlyApplications, setMonthlyApplications] = useState([])

  // Function to get CSS variables
  const getStyle = (variable) => String(getComputedStyle(document.documentElement).getPropertyValue(variable)).trim()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const usersResponse = await axios.get("http://localhost:2025/api/user")
        setTotalUsuarios(usersResponse.data.length)

        const applicationsResponse = await axios.get("http://localhost:2025/api/application")
        setTotalSolicitudes(applicationsResponse.data.length)
        setReportData(applicationsResponse.data)

        // Process application data by month
        const appsByMonth = processDataByMonth(applicationsResponse.data)
        setMonthlyApplications(appsByMonth)

        const reservationsResponse = await axios.get("http://localhost:2025/api/reservation")
        setTotalReservas(reservationsResponse.data.length)

        // Process reservation data by month
        const reservationsByMonth = processDataByMonth(reservationsResponse.data)
        setMonthlyReservations(reservationsByMonth)

        // Process scenery data
        const sceneryCounts = reservationsResponse.data.reduce((acc, resv) => {
          acc[resv.scenery] = (acc[resv.scenery] || 0) + 1
          return acc
        }, {})

        const sceneryChartData = Object.keys(sceneryCounts).map((key) => ({
          name: key,
          value: sceneryCounts[key],
        }))

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
  const damageChartData = Object.keys(damageCounts).map((key) => ({ label: key, data: damageCounts[key] }))
  const statusChartData = Object.keys(statusCounts).map((key) => ({ label: key, data: statusCounts[key] }))

  // Colors for charts
  const COLORS = ["#5856d6", "#39f", "#f9b115", "#e55353", "#2eb85c", "#768192"]

  if (loading) {
    return <div>Cargando datos...</div>
  }

  return (
    <>
      <CRow>
        <CCol sm={6} lg={4}>
          <CWidgetStatsA
            className="mb-4"
            style={{ minHeight: "125px" }} // Reducido a la mitad (de 250px a 125px)
            color="primary"
            value={
              <>
                {totalUsuarios}{" "}
                <span className="fs-6 fw-normal">
                  <CIcon icon={cilArrowTop} />
                </span>
              </>
            }
            title="Total de Usuarios"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Ver detalles</CDropdownItem>
                  <CDropdownItem>Exportar datos</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: "90px" }} // Reducido a la mitad (de 180px a 90px)
                data={{
                  labels: ["January", "February", "March", "April", "May", "June", "July"],
                  datasets: [
                    {
                      label: "Usuarios",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255,255,255,.55)",
                      pointBackgroundColor: getStyle("--cui-primary"),
                      data: [65, 59, 84, 84, 51, 55, totalUsuarios],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 30,
                      max: Math.max(89, totalUsuarios + 10),
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 3, // Reducido de 4 a 3
                      hitRadius: 8, // Reducido de 10 a 8
                      hoverRadius: 3, // Reducido de 4 a 3
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsA
            className="mb-4"
            style={{ minHeight: "125px" }} // Reducido a la mitad (de 250px a 125px)
            color="info"
            value={
              <>
                {totalSolicitudes}{" "}
                <span className="fs-6 fw-normal">
                  <CIcon icon={cilArrowTop} />
                </span>
              </>
            }
            title="Total de Solicitudes"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Ver detalles</CDropdownItem>
                  <CDropdownItem>Exportar datos</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: "90px" }} // Reducido a la mitad (de 180px a 90px)
                data={{
                  labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
                  datasets: [
                    {
                      label: "Solicitudes",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255,255,255,.55)",
                      pointBackgroundColor: getStyle("--cui-info"),
                      data: monthlyApplications.slice(0, 7),
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 0,
                      max: Math.max(...monthlyApplications) + 5,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 3, // Reducido de 4 a 3
                      hitRadius: 8, // Reducido de 10 a 8
                      hoverRadius: 3, // Reducido de 4 a 3
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={6} lg={4}>
          <CWidgetStatsA
            className="mb-4"
            style={{ minHeight: "125px" }} // Reducido a la mitad (de 250px a 125px)
            color="warning"
            value={
              <>
                {totalReservas}{" "}
                <span className="fs-6 fw-normal">
                  <CIcon icon={cilArrowTop} />
                </span>
              </>
            }
            title="Total de Reservas"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Ver detalles</CDropdownItem>
                  <CDropdownItem>Exportar datos</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: "90px" }} // Reducido a la mitad (de 180px a 90px)
                data={{
                  labels: ["January", "Febrero", "March", "April", "May", "June", "July"],
                  datasets: [
                    {
                      label: "Reservas",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: monthlyReservations.slice(0, 7),
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 8, // Reducido de 10 a 8
                      hoverRadius: 3, // Reducido de 4 a 3
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      <CRow className="equal-height-charts">
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardHeader>Tipos de Reportes</CCardHeader>
            <CCardBody className="d-flex flex-column">
              <div className="chart-container flex-grow-1">
                <CChartPie
                  style={{ height: "400px" }} // Mantenemos la altura del gráfico
                  data={{
                    labels: damageChartData.map((item) => item.label),
                    datasets: [
                      {
                        data: damageChartData.map((item) => item.data),
                        backgroundColor: COLORS.slice(0, damageChartData.length),
                        hoverBackgroundColor: COLORS.slice(0, damageChartData.length),
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          font: {
                            size: 14, // Mantenemos el tamaño de la fuente de la leyenda
                          },
                          padding: 20, // Mantenemos el espacio entre etiquetas
                        },
                      },
                      tooltip: {
                        bodyFont: {
                          size: 14, // Mantenemos el tamaño de la fuente del tooltip
                        },
                        titleFont: {
                          size: 16, // Mantenemos el tamaño del título del tooltip
                        },
                      },
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardHeader>Estado de Solicitudes</CCardHeader>
            <CCardBody className="d-flex flex-column">
              <div className="chart-container flex-grow-1">
                <CChartBar
                  style={{ height: "400px" }} // Mantenemos la altura del gráfico
                  data={{
                    labels: statusChartData.map((item) => item.label),
                    datasets: [
                      {
                        label: "Estado",
                        backgroundColor: COLORS[3],
                        data: statusChartData.map((item) => item.data),
                        barThickness: 40, // Mantenemos el grosor de las barras
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        bodyFont: {
                          size: 14, // Mantenemos el tamaño de la fuente del tooltip
                        },
                        titleFont: {
                          size: 16, // Mantenemos el tamaño del título del tooltip
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 14, // Mantenemos el tamaño de la fuente de las etiquetas del eje X
                          },
                        },
                      },
                      y: {
                        ticks: {
                          font: {
                            size: 14, // Mantenemos el tamaño de la fuente de las etiquetas del eje Y
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {sceneryData.length > 0 && (
        <CRow>
          <CCol sm={12}>
            <CCard className="mb-4">
              <CCardHeader>Escenarios más reservados</CCardHeader>
              <CCardBody className="d-flex flex-column">
                <div className="chart-container flex-grow-1">
                  <CChartBar
                    style={{ height: "450px" }} // Mantenemos la altura del gráfico
                    data={{
                      labels: sceneryData.map((item) => item.name),
                      datasets: [
                        {
                          label: "Reservas",
                          backgroundColor: COLORS[2],
                          data: sceneryData.map((item) => item.value),
                          barThickness: 50, // Mantenemos el grosor de las barras
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          bodyFont: {
                            size: 14, // Mantenemos el tamaño de la fuente del tooltip
                          },
                          titleFont: {
                            size: 16, // Mantenemos el tamaño del título del tooltip
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            font: {
                              size: 14, // Mantenemos el tamaño de la fuente de las etiquetas del eje X
                            },
                          },
                        },
                        y: {
                          ticks: {
                            font: {
                              size: 14, // Mantenemos el tamaño de la fuente de las etiquetas del eje Y
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      <style jsx global>{`
        .equal-height-charts .chart-container {
          position: relative;
          height: 100%;
          width: 100%;
        }
        
        .chart-container {
          position: relative;
          height: 100%;
          width: 100%;
          min-height: 400px; /* Mantenemos la altura mínima para los gráficos principales */
        }

        .card-body {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem; /* Mantenemos el padding */
        }

        .flex-grow-1 {
          flex-grow: 1;
        }
        
        /* Ajustamos la altura de los widgets */
        .widget-chart {
          min-height: 125px; /* Reducido a la mitad */
        }
        
        /* Mejorar la visualización en dispositivos móviles */
        @media (max-width: 768px) {
          .chart-container {
            min-height: 350px; /* Mantenemos la altura mínima para móviles */
          }
        }
      `}</style>
    </>
  )
}

export default Dashboard