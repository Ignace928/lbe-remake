import { Document, Page, Text, View, StyleSheet,Font } from '@react-pdf/renderer';

// Optionnel : Enregistre une police si tu veux un look plus "officiel"
Font.register({ family: 'Helvetica-Bold', src: 'https://fonts.gstatic.com...'});

const styles = StyleSheet.create({
  page: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
  },
  container: {
    padding: 5,
    height: '100%',
    display: 'flex',
    fontSize:12
  },
  header: {
    display:"flex",
    flexDirection:"row",
    alignContent:"stretch",
    alignItems:"center",
    justifyContent:"center",
    paddingBottom:5,
    textAlign: "center",
    borderBottom: '1pt solid #140335',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    fontSize: 11,
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-start",
    gap:30,
    marginTop:0,
    borderBottom:'1pt solid #ccc'
  },
//   rounded-xl border bg-card text-card-foreground
});

interface listeProps {
    classe: string,
    matricule: string,
    nom: string,
    verse: number,
    total: number,
    ecart: number,
}


export const ListeRetardataire: React.FC<{data: listeProps[] }> = ({ data }) => (
  <Document>
    {/* size="A5" correspond à une demi-feuille A4. orientation="landscape" pour le format paysage */}
    <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.title}>Retardataire — </Text>
        </View>
        <View style={styles.container}>
            {
                data.map((d)=>(
                    <View key={d.matricule} style={styles.content}>
                        <Text style={{}}>N°:{d.classe}</Text>
                        <Text style={{}}>N°:{d.matricule}</Text>
                        <Text>{d.nom}</Text>
                    </View>
                ))
            }
        </View>
    </Page>
  </Document>
);