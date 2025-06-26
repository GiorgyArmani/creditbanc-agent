'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import parse, { domToReact } from 'html-react-parser';
import type { DOMNode, Element } from 'html-react-parser';

// Register Helvetica
Font.register({
  family: 'Helvetica',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/helvetica/v15/oxz38sXWvvGgHkZ0QCfOXJw.woff2',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5,
  },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  paragraph: { marginBottom: 4 },
  listItem: { marginLeft: 10, marginBottom: 2 },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    flexGrow: 1,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    backgroundColor: '#eee',
  },
});

function renderNode(node: any, index: number): React.ReactNode {
  if (node.type === 'text') {
    return <Text key={index}>{node.data}</Text>;
  }

  if (node.type === 'tag') {
    const el = node as Element;
    const children = el.children?.filter(
      (child) => child.type === 'tag' || child.type === 'text'
    ) as any[];

    const childContent = domToReact(children);

    switch (el.name) {
      case 'h2':
        return (
          <View key={index} style={styles.section}>
            <Text style={styles.heading}>{childContent}</Text>
          </View>
        );
      case 'p':
        return (
          <Text key={index} style={styles.paragraph}>
            {childContent}
          </Text>
        );
      case 'ul':
        return (
          <View key={index} style={styles.section}>
            {el.children
              .filter((li) => (li as Element).name === 'li')
              .map((li, i) => (
                <Text key={i} style={styles.listItem}>
                  •{' '}
                  {domToReact(
                    ((li as Element).children || []).filter(
                      (child) => child.type === 'tag' || child.type === 'text'
                    ) as any[]
                  )}
                </Text>
              ))}
          </View>
        );
      case 'table':
        const rows = el.children.filter((child) => (child as Element).name === 'tr');
        return (
          <View key={index} style={styles.table}>
            {rows.map((row, rIdx) => {
              const cells = (row as Element).children.filter(
                (cell) =>
                  (cell as Element).name === 'td' ||
                  (cell as Element).name === 'th'
              );
              return (
                <View key={rIdx} style={styles.tableRow}>
                  {cells.map((cell, cIdx) => {
                    const isHeader = (cell as Element).name === 'th';
                    const cellStyles = [
                      styles.tableCell,
                      ...(isHeader ? [styles.tableHeaderCell] : []),
                    ];
                    return (
                      <Text key={cIdx} style={cellStyles}>
                        {domToReact(
                          ((cell as Element).children || []).filter(
                            (child) =>
                              child.type === 'tag' || child.type === 'text'
                          ) as any[]
                        )}
                      </Text>
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      default:
        return (
          <Text key={index} style={styles.paragraph}>
            {childContent}
          </Text>
        );
    }
  }

  return null;
}

const HtmlToPDF = ({ html }: { html: string }) => {
  const parsed = parse(html);

  const nodes = Array.isArray(parsed) ? parsed : [parsed];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {nodes.map((node: any, index: number) =>
          typeof node === 'string' ? (
            <Text key={index}>{node}</Text>
          ) : (
            renderNode(node, index)
          )
        )}
      </Page>
    </Document>
  );
}; 

export default HtmlToPDF;