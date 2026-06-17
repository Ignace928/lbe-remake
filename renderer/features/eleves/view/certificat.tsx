import { Document, Page, Text, Image, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Optionnel : Enregistre une police si tu veux un look plus "officiel"
// Font.register({ family: 'Helvetica-Bold', src: 'https://fonts.gstatic.com...'});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  container: {
    border: '1pt solid #000', // Bordure pour le côté "officiel"
    padding: 15,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    display:"flex",
    flexDirection:"row",
    alignContent:"stretch",
    alignItems:"center",
    justifyContent:"flex-start",
    textAlign: "center",
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
    marginTop: 15,
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
  sexe:"M"|"F"
}


export const SchoolCertificate: React.FC<{ data: CertificateProps }> = ({ data }) => (
  <Document>
    {/* size="A5" correspond à une demi-feuille A4. orientation="landscape" pour le format paysage */}
    <Page size="A5" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        
        {/* Entête */}
        <View style={styles.header}>
          <Image src='/images/benjamin.png' style={{width:40, height:70}}/>
          <View style={{ marginLeft:120, display:"flex",flexDirection:"column", alignItems:"center", textAlign:"center"}}>
            <Text style={{ fontSize: 12, fontWeight: 'bold'}}>LYCEE FJKM — BENJAMIN ESCANDE</Text>
            <Text style={{ fontSize: 9 }}>DREN AMORON'I MANIA Ambositra - 306</Text>
          </View>
        </View>

        <Text style={styles.title}>CERTIFICAT DE SCOLARITÉ</Text>

        {/* Corps du texte */}
        <View style={styles.content}>
          <Text>
            Je soussigné, Directeur de l'établissement Lycée Benjamin Escande, certifie que l'élève :
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 5 }}>
            {data.studentName}
          </Text>
          <Text>
            {
              data.sexe==="F"? `Née le : ${data.birthDate}`:`Né le : ${data.birthDate}` 
            }
          </Text>
          <Text>
            Est régulièrement {data.sexe==="F"?"inscrite":"inscrit"} en classe de : {data.classLevel}
          </Text>
          <Text>
            Pour l'année scolaire : {data.year}
          </Text>
        </View>

        {/* Signature et Date */}
        <View style={styles.footer}>
          <Text>Fait à Ambositra, le {format(new Date(), "dd MMMM yyyy", { locale: fr })}</Text>
          <View>
            <Text style={{ marginBottom: 20 }}>Le Directeur</Text>
            <View style={styles.signatureBlock}>
              <Text></Text>
            </View>
          </View>
        </View>

      </View>
    </Page>
  </Document>
);