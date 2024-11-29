import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../constants/assets';

export default function DiscoveryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>发现</Text>
      {/* 这里添加发现页面的具体内容 */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  title: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    padding: SIZES.padding.large,
  },
});
