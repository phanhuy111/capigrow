import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
      className="w-[75px] h-[75px] bg-white rounded-lg justify-center items-center shadow-sm"
      onPress={() => onKeyPress(key.number)}
      activeOpacity={0.7}
    >
      <Text className="text-[28px] font-semibold text-gray-900 leading-8">{key.number}</Text>
      {key.letters ? <Text className="text-[10px] font-medium text-gray-500 tracking-widest -mt-0.5">{key.letters}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View className="px-6 pb-12">
      {keys.slice(0, 3).map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between mb-4">
          {row.map(renderKey)}
        </View>
      ))}

      <View className="flex-row justify-between items-center">
        <View className="w-[75px]" />
        {renderKey(keys[3][0])}
        <TouchableOpacity
          className="w-[75px] h-[75px] bg-gray-200 rounded-lg justify-center items-center"
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Text className="text-[32px] font-light text-gray-500">×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default NumericKeypad;
