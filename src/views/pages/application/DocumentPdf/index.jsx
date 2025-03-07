import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 150,
    objectFit: "cover",
    borderRadius: 5,
    marginTop: 5,
  },
  noImageText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
})

const DocumentPdf = ({ Application }) => {
  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = "dvzjinfzq"

  // Function to get the correct image URL from Cloudinary
  const getImageUrl = (path) => {
    if (!path || path.trim() === "") return null

    // If it's already a complete URL, use it directly
    if (path.startsWith("http://") || path.startsWith("https://")) {
      // Fix duplicated URLs if they exist
      if (path.includes("https://res.cloudinary.com") && path.includes("https://res.cloudinary.com", 10)) {
        return path.replace(
          /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//,
          `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`,
        )
      }
      return path
    }

    // If it's a relative Cloudinary path, build the complete URL
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${path}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Detalle de la solicitud</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Fecha del reporte:</Text>
          <Text style={styles.value}>{Application.reportDate}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de reporte:</Text>
          <Text style={styles.value}>{Application.reportType}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Dependencia:</Text>
          <Text style={styles.value}>{Application.dependence}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Lugar:</Text>
          <Text style={styles.value}>{Application.location}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Usuario que reporta:</Text>
          <Text style={styles.value}>{Application.userId}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{Application.status}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Responsable:</Text>
          <Text style={styles.value}>{Application.responsibleForSpace}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Evidencia fotográfica:</Text>
          {Application.photographicEvidence && Application.photographicEvidence.trim() !== "" ? (
            <Image
              style={styles.image}
              src={getImageUrl(Application.photographicEvidence) || "/placeholder.svg"}
              cache={true}
            />
          ) : (
            <Text style={styles.noImageText}>No hay evidencia fotográfica</Text>
          )}
        </View>
      </Page>
    </Document>
  )
}

export default DocumentPdf