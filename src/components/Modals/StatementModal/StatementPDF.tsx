import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});

interface StatementPDFProps {
  data: {
    transactions: any[];
    totals: {
      totalIncome: number;
      totalExpense: number;
    };
    period: {
      type: string;
      month?: string;
      year?: string;
      startDate?: string;
      endDate?: string;
    };
  };
  statementName: string;
}

const StatementPDF = ({ data, statementName }: StatementPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{statementName}</Text>
        <Text style={styles.subtitle}>
          {data.period.type === 'monthly'
            ? `${dayjs().month(parseInt(data.period.month!) - 1).format('MMMM')} ${data.period.year}`
            : data.period.type === 'yearly'
            ? data.period.year
            : `${dayjs(data.period.startDate).format('DD/MM/YYYY')} - ${dayjs(data.period.endDate).format('DD/MM/YYYY')}`}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Date</Text>
          <Text style={styles.tableCell}>Description</Text>
          <Text style={styles.tableCell}>Category</Text>
          <Text style={styles.tableCell}>Type</Text>
          <Text style={styles.tableCell}>Amount</Text>
        </View>

        {data.transactions.map((transaction, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{dayjs(transaction.date).format('DD/MM/YYYY')}</Text>
            <Text style={styles.tableCell}>{transaction.description}</Text>
            <Text style={styles.tableCell}>{transaction.category || '-'}</Text>
            <Text style={styles.tableCell}>{transaction.type}</Text>
            <Text style={styles.tableCell}>${transaction.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summary}>
        <Text>Total Income: ${data.totals.totalIncome.toFixed(2)}</Text>
        <Text>Total Expense: ${data.totals.totalExpense.toFixed(2)}</Text>
        <Text>Net Balance: ${(data.totals.totalIncome - data.totals.totalExpense).toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default StatementPDF;