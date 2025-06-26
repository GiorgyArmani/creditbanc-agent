import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import parse from 'html-react-parser';

// Register Helvetica font (default in most browsers)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v15/oxz38sXWvvGgHkZ0QCfOXJw.woff2' },
  ],
});

// Basic styles matching Credit Banc specs
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 12,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 4,
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 2,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    padding: 4,
    fontWeight: 'bold',
    borderRight: '1 solid #000',
  },
  tableCell: {
    padding: 4,
    borderRight: '1 solid #000',
  },
});

// Helper to transform simple HTML tags to PDF content
const HtmlToPDF = ({ html }: { html: string }) => {
  const parsed = parse(html);

  const renderNode = (node: any, i: number) => {
    if (typeof node === 'string') {
      return <Text key={i}>{node}</Text>;
    }

    if (node.type === 'tag') {
      switch (node.name) {
        case 'h2':
          return (
            <View key={i} style={styles.section}>
              <Text style={styles.heading}>{node.children.map(renderNode)}</Text>
            </View>
          );
        case 'p':
          return (
            <Text key={i} style={styles.paragraph}>
              {node.children.map(renderNode)}
            </Text>
          );
        case 'ul':
          return (
            <View key={i} style={styles.section}>
              {node.children.map((li: any, liIndex: number) =>
                li.name === 'li' ? (
                  <Text key={liIndex} style={styles.listItem}>• {li.children.map(renderNode)}</Text>
                ) : null
              )}
            </View>
          );
        case 'table':
          const rows = node.children.filter((child: any) => child.name === 'tr');
          return (
            <View key={i} style={styles.table}>
              {rows.map((row: any, rowIndex: number) => {
                const cells = row.children.filter((c: any) => c.name === 'td' || c.name === 'th');
                return (
                  <View key={rowIndex} style={styles.tableRow}>
                    {cells.map((cell: any, cellIndex: number) => (
                      <Text
                        key={cellIndex}
                        style={rowIndex === 0 ? styles.tableCellHeader : styles.tableCell}
                      >
                        {cell.children.map(renderNode)}
                      </Text>
                    ))}
                  </View>
                );
              })}
            </View>
          );
        default:
          return <Text key={i}>{node.children?.map(renderNode)}</Text>;
      }
    }

    return null;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {Array.isArray(parsed) ? parsed.map(renderNode) : renderNode(parsed, 0)}
      </Page>
    </Document>
  );
};

export default HtmlToPDF;
