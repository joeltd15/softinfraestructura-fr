import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Helvetica',
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    color: "#1a365d",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 18,
    padding: 16,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
    paddingBottom: 8,
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    fontSize: 10,
    color: "#4a5568",
    lineHeight: 1.4,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2c5282",
    borderBottomWidth: 2,
    borderBottomColor: "#edf2f7",
    paddingBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#2d3748",
  },
  trackingSection: {
    marginTop: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#f7fafc",
    borderLeftWidth: 2,
    borderLeftColor: "#2c5282",
  },
  trackingHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2c5282",
    marginBottom: 6,
  },
  trackingCell: {
    fontSize: 10,
    color: "#4a5568",
    marginBottom: 4,
  },
});

const ApplicationPDF = ({ applications }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>INFORME DE MANTENIMIENTO</Text>
      {applications.map((app, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.header}>Solicitud #{app.id}</Text>
          <View style={styles.row}>
            <Text style={styles.cell}>
              <Text style={styles.label}>Fecha del reporte:</Text> {new Date(app.reportDate).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})}
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
              <View style={styles.row}>
                <Text style={styles.cell}>
                  <Text style={styles.label}>Observaciones:</Text> {app.tracking.observations}
                </Text>
                <Text style={styles.cell}>
                  <Text style={styles.label}>Materiales:</Text> {app.tracking.buildingMaterials}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>
                  <Text style={styles.label}>Fecha de servicio:</Text> {new Date(app.tracking.dateService).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                </Text>
                <Text style={styles.cell}>
                  <Text style={styles.label}>Acciones tomadas:</Text> {app.tracking.actionsTaken}
                </Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </Page>
  </Document>
);

export default ApplicationPDF;