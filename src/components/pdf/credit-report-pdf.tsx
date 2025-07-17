import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'

export type CreditReportData = {
  fullName: string
  reportDate: string
  scores: string[][]
  summary: string[][]
  revolvingAccounts: string[][]
  revolvingStats: string[][]
  scoreImprovementTips: string[]
  alerts: string[]
  installmentAccounts: string[][]
}


// Styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, marginBottom: 6, fontWeight: 'bold' },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  row: { flexDirection: 'row' },
  cell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 10,
    flexGrow: 1,
  },
  bold: { fontWeight: 'bold' },
  listItem: { marginLeft: 10, marginBottom: 2 },
})

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <View style={styles.table}>
    <View style={styles.row}>
      {headers.map((h, i) => (
        <Text key={i} style={[styles.cell, styles.bold]}>{h}</Text>
      ))}
    </View>
    {rows.map((row, idx) => (
      <View key={idx} style={styles.row}>
        {row.map((cell, i) => (
          <Text key={i} style={styles.cell}>{cell}</Text>
        ))}
      </View>
    ))}
  </View>
)


export default function CreditReportPDF({ data }: { data: CreditReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image
          src="header-logo.png"
          style={{ width: '100%', marginBottom: 10 }}
        />

        <View style={styles.section}>
          <Text style={styles.heading}>Client Information</Text>
          <Text>Full Name: {data.fullName}</Text>
          <Text>Report Date: {data.reportDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Credit Scores</Text>
          <Table headers={['Bureau', 'FICO Score', 'Score Range']} rows={data.scores} />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Account Summary</Text>
          <Table headers={['Metric', 'Count']} rows={data.summary} />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Open Revolving Accounts</Text>
          <Table headers={['Creditor Name', 'Current Balance', 'Credit Limit', 'Utilization %', 'Past Due', 'Past Due Since']} rows={data.revolvingAccounts} />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Summary Stats</Text>
          <Table headers={['Total Revolving Balance', 'Total Credit Limit', 'Overall Utilization']} rows={data.revolvingStats} />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Estimated FICO Score Increase</Text>
          {data.scoreImprovementTips.map((tip, i) => (
            <Text key={i} style={styles.listItem}>• {tip}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Flags or Alerts</Text>
          {data.alerts.map((alert, i) => (
            <Text key={i} style={styles.listItem}>• {alert}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Non-Revolving Installment Accounts</Text>
          <Table headers={['Creditor Name', 'Account Type', 'Balance', 'Monthly Payment', 'Status']} rows={data.installmentAccounts} />
        </View>
      </Page>
    </Document>
  )
}
