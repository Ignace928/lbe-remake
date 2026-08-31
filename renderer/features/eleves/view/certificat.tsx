<<<<<<< HEAD
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import logo from "../../../public/images/benjamin.png"
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// import Image from 'next/image';

// Optionnel : Enregistre une police si tu veux un look plus "officiel"
Font.register({ family: 'Helvetica-Bold', src: 'https://fonts.gstatic.com...'});
=======
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Optionnel : Enregistre une police si tu veux un look plus "officiel"
// Font.register({ family: 'Helvetica-Bold', src: 'https://fonts.gstatic.com...'});
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  container: {
<<<<<<< HEAD
    border: '1pt solid #000', // Bordure pour le côté "officiel"
=======
    border: '2pt solid #000', // Bordure pour le côté "officiel"
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
    padding: 15,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
<<<<<<< HEAD
    display:"flex",
    flexDirection:"row",
    alignContent:"stretch",
    alignItems:"center",
    justifyContent:"flex-start",
    textAlign: "center",
=======
    textAlign: 'center',
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
    marginTop: 15,
=======
    marginTop: 20,
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
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
<<<<<<< HEAD
  sexe:"M"|"F"
=======
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
}


export const SchoolCertificate: React.FC<{ data: CertificateProps }> = ({ data }) => (
  <Document>
    {/* size="A5" correspond à une demi-feuille A4. orientation="landscape" pour le format paysage */}
    <Page size="A5" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        
        {/* Entête */}
        <View style={styles.header}>
<<<<<<< HEAD
          <Image src="/images/benjamin.png" style={{width:40, height:70}}/>
          {/* <Image src="/images/benjamin.png" width={40} height={70}/> */}
          <View style={{ marginLeft:120, display:"flex",flexDirection:"column", alignItems:"center", textAlign:"center"}}>
            <Text style={{ fontSize: 12, fontWeight: 'bold'}}>LYCEE FJKM — BENJAMIN ESCANDE</Text>
            <Text style={{ fontSize: 9 }}>DREN AMORON'I MANIA Ambositra - 306</Text>
          </View>
=======
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>LBE SCHOOLAR - ADMINISTRATION</Text>
          <Text style={{ fontSize: 9 }}>République de ... / Ministère de l'Éducation</Text>
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
        </View>

        <Text style={styles.title}>CERTIFICAT DE SCOLARITÉ</Text>

        {/* Corps du texte */}
        <View style={styles.content}>
          <Text>
<<<<<<< HEAD
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
=======
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
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
          </Text>
          <Text>
            Pour l'année scolaire : {data.year}
          </Text>
        </View>

        {/* Signature et Date */}
        <View style={styles.footer}>
<<<<<<< HEAD
          <Text>Fait à Ambositra, le {format(new Date(), "dd MMMM yyyy", { locale: fr })}</Text>
          <View>
            <Text style={{ marginBottom: 20 }}>Le Directeur</Text>
            <View style={styles.signatureBlock}>
              <Text></Text>
=======
          <Text>Fait à ..................., le {new Date().toLocaleDateString()}</Text>
          <View>
            <Text style={{ marginBottom: 20 }}>Le Directeur</Text>
            <View style={styles.signatureBlock}>
              <Text>(Signature et Cachet)</Text>
>>>>>>> 0f8417fef8585d803b9c1436b515535d49ba654f
            </View>
          </View>
        </View>

      </View>
    </Page>
  </Document>
);