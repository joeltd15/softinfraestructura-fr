import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000", paddingBottom: 5, marginBottom: 5 },
  cell: { flex: 1 },
  header: { fontWeight: "bold", marginBottom: 10 },
})

const ApplicationPDF = ({ applications }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Informe de Aplicaciones</Text>
      {applications.map((app, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.header}>Aplicación #{app.id}</Text>
          <View style={styles.row}>
            <Text style={styles.cell}>Fecha del reporte: {new Date(app.reportDate).toISOString().split('T')[0]}</Text>
            <Text style={styles.cell}>Estado: {app.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Centro/dependencia: {app.dependence}</Text>
            <Text style={styles.cell}>Lugar: {app.location}</Text>
          </View>
          <Text>Detalles: {app.news}</Text>
          <Text>Tipo de reporte: {app.reportType}</Text>

          {app.status === "Completado" && app.tracking && (
            <View>
              <Text style={styles.header}>Información de Seguimiento</Text>
              <Text>Observaciones: {app.tracking.observations}</Text>
              <Text>Materiales utilizados: {app.tracking.buildingMaterials}</Text>
              <Text>Fecha de servicio: {new Date(app.tracking.dateService).toLocaleDateString()}</Text>
              <Text>Acciones tomadas: {app.tracking.actionsTaken}</Text>
            </View>
          )}
        </View>
      ))}
    </Page>
  </Document>
)

export default ApplicationPDF