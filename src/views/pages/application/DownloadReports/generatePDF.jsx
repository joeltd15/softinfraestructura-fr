import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
    paddingBottom: 5,
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: "#2c3e50",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2980b9",
  },
  label: {
    fontWeight: "bold",
    color: "#34495e",
  },
  trackingSection: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ecf0f1",
  },
  trackingHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16a085",
    marginBottom: 5,
  },
});

const ApplicationPDF = ({ applications }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Informe de Mantenimiento</Text>
      {applications.map((app, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.header}>Solicitud #{app.id}</Text>
          <View style={styles.row}>
            <Text style={styles.cell}>
              <Text style={styles.label}>Fecha del reporte:</Text> {new Date(app.reportDate).toISOString().split('T')[0]}
            </Text>
            <Text style={styles.cell}>
              <Text style={styles.label}>Estado:</Text> {app.status}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>
              <Text style={styles.label}>Centro/Dependencia:</Text> {app.dependence}
            </Text>
            <Text style={styles.cell}>
              <Text style={styles.label}>Lugar:</Text> {app.location}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>
              <Text style={styles.label}>Detalles:</Text> {app.news}
            </Text>
            <Text style={styles.cell}>
              <Text style={styles.label}>Tipo de reporte:</Text> {app.reportType}
            </Text>
          </View>
          {app.status === "Realizado" && app.tracking && (
            <View style={styles.trackingSection}>
              <Text style={styles.trackingHeader}>Información de Seguimiento</Text>
              <Text style={styles.cell}>
                <Text style={styles.label}>Observaciones:</Text> {app.tracking.observations}
              </Text>
              <Text style={styles.cell}>
                <Text style={styles.label}>Materiales utilizados:</Text> {app.tracking.buildingMaterials}
              </Text>
              <Text style={styles.cell}>
                <Text style={styles.label}>Fecha de servicio:</Text> {new Date(app.tracking.dateService).toLocaleDateString()}
              </Text>
              <Text style={styles.cell}>
                <Text style={styles.label}>Acciones tomadas:</Text> {app.tracking.actionsTaken}
              </Text>
            </View>
          )}
        </View>
      ))}
    </Page>
  </Document>
);

export default ApplicationPDF;
