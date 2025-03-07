import axios from "axios"

const fetchFilteredData = async (startDate, endDate) => {
  try {
    const [applicationsResponse, assignmentsResponse, trackingsResponse] = await Promise.all([
      axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/application"),
      axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/assignment"),
      axios.get("https://softinfraestructura-a6yl4j3yy-joeltuiran15-gmailcoms-projects.vercel.app/api/tracking"),
    ])

    const applications = applicationsResponse.data
    const assignments = assignmentsResponse.data
    const trackings = trackingsResponse.data

    const filteredApplications = applications.filter((app) => {
      const reportDate = new Date(app.reportDate)
      return reportDate >= new Date(startDate) && reportDate <= new Date(endDate)
    })

    const enrichedApplications = filteredApplications.map((app) => {
      const assignment = assignments.find((a) => a.applicationId === app.id)
      let tracking = null
      if (assignment) {
        tracking = trackings.find((t) => t.assignmentId === assignment.id)
      }
      return {
        ...app,
        assignment,
        tracking,
      }
    })

    return enrichedApplications
  } catch (error) {
    console.error("Error fetching filtered data:", error)
    throw error
  }
}

export default fetchFilteredData;