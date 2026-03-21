import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Optionnel : Enregistre une police si tu veux un look plus "officiel"
// Font.register({ family: 'Helvetica-Bold', src: 'https://fonts.gstatic.com...'});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  container: {
    border: '2pt solid #000', // Bordure pour le côté "officiel"
    padding: 15,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    borderBottom: '1pt solid #ccc',
    paddingBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    fontSize: 11,
    lineHeight: 1.6,
    marginVertical: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    fontSize: 10,
  },
  signatureBlock: {
    textAlign: 'center',
    width: 150,
    borderTop: '1pt solid #000',
    marginTop: 40,
    paddingTop: 5,
  }
});

interface CertificateProps {
  studentName: string;
  birthDate: string;
  classLevel: string;
  year: string;
}


export const SchoolCertificate: React.FC<{ data: CertificateProps }> = ({ data }) => (
  <Document>
    {/* size="A5" correspond à une demi-feuille A4. orientation="landscape" pour le format paysage */}
    <Page size="A5" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        
        {/* Entête */}
        <View style={styles.header}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>LBE SCHOOLAR - ADMINISTRATION</Text>
          <Text style={{ fontSize: 9 }}>République de ... / Ministère de l'Éducation</Text>
        </View>

        <Text style={styles.title}>CERTIFICAT DE SCOLARITÉ</Text>

        {/* Corps du texte */}
        <View style={styles.content}>
          <Text>
            Je soussigné, Directeur de l'établissement LBE SCHOOLAR, certifie que l'élève :
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 13, marginTop: 5 }}>
            {data.studentName}
          </Text>
          <Text>
            {`Né(e) le : ${data.birthDate} ` }
          </Text>
          <Text>
            Est régulièrement inscrit(e) en classe de : {data.classLevel}
          </Text>
          <Text>
            Pour l'année scolaire : {data.year}
          </Text>
        </View>

        {/* Signature et Date */}
        <View style={styles.footer}>
          <Text>Fait à ..................., le {new Date().toLocaleDateString()}</Text>
          <View>
            <Text style={{ marginBottom: 20 }}>Le Directeur</Text>
            <View style={styles.signatureBlock}>
              <Text>(Signature et Cachet)</Text>
            </View>
          </View>
        </View>

      </View>
    </Page>
  </Document>
);