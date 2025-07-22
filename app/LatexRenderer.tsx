// components/LatexRenderer.tsx
import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  latex: string;
}

const LatexRenderer = ({ latex }: Props) => {
  const colorScheme = useColorScheme();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background-color: transparent;
        }
        .math {
          font-size: 22px;
          color: ${colorScheme === 'dark' ? '#fff' : '#000'};
          display: flex;
          justify-content: center;
          padding: 8px;
        }
      </style>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    </head>
    <body>
      <div class="math">\\[${latex}\\]</div>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 60,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default LatexRenderer;
