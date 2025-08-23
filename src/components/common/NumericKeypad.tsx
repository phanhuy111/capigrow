import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress, onDelete }) => {
  const keys = [
    [
      { number: '1', letters: '' },
      { number: '2', letters: 'ABC' },
      { number: '3', letters: 'DEF' },
    ],
    [
      { number: '4', letters: 'GHI' },
      { number: '5', letters: 'JKL' },
      { number: '6', letters: 'MNO' },
    ],
    [
      { number: '7', letters: 'PQRS' },
      { number: '8', letters: 'TUV' },
      { number: '9', letters: 'WXYZ' },
    ],
    [
      { number: '0', letters: '' },
    ],
  ];

  const renderKey = (key: { number: string; letters: string }) => (
    <TouchableOpacity
      key={key.number}
      style={styles.keyButton}
      onPress={() => onKeyPress(key.number)}
      activeOpacity={0.7}
    >
      <Text style={styles.keyNumber}>{key.number}</Text>
      {key.letters ? <Text style={styles.keyLetters}>{key.letters}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {keys.slice(0, 3).map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(renderKey)}
        </View>
      ))}

      <View style={styles.lastRow}>
        <View style={styles.emptySpace} />
        {renderKey(keys[3][0])}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyButton: {
    width: 75,
    height: 75,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  keyNumber: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 32,
  },
  keyLetters: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginTop: -2,
  },
  emptySpace: {
    width: 75,
  },
  deleteButton: {
    width: 75,
    height: 75,
    backgroundColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.textSecondary,
  },
});

export default NumericKeypad;
