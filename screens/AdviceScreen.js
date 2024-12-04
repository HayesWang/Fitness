import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/assets';
import { useNavigation } from '@react-navigation/native';

export default function AdviceScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: Date.now(),
      text: 'Hello, what can I help you?',
      isUser: false,
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [adviceData, setAdviceData] = useState([]);
  const shadowColorAnim = useRef(new Animated.Value(0)).current;
  const shadowRadiusAnim = useRef(new Animated.Value(8)).current;

  const OPENAI_API_KEY = 'sk-8aDY9e0r0RgnBTG5eeeMpPGW9Gjhbq7c8X1I0lrK07NVK7lT'; // Please ensure this is the correct API key
  const systemPrompt = 'You are a health assistant,after hearing from user, you should ask for users current health condition and providing useful health advice with really brief instructions.';
  const handleSend = async () => {
    if (!message.trim()) return;

    startBreathingAnimation();

    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
    };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build message history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://xiaoai.plus/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.choices && data.choices.length > 0) {
        const aiMessage = {
          id: Date.now() + 1,
          text: data.choices[0].message.content.trim(),
          isUser: false,
        };
        setChatHistory(prev => [...prev, aiMessage]);
      } else {
        const aiMessage = {
          id: Date.now() + 1,
          text: 'Sorry, I cannot understand your request.',
          isUser: false,
        };
        setChatHistory(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      const aiMessage = {
        id: Date.now() + 1,
        text: 'Sorry, an error occurred. Please try again later.',
        isUser: false,
      };
      setChatHistory(prev => [...prev, aiMessage]);
    }

    setMessage('');
  };

  // Clear chat history
  const clearChatHistory = () => {
    setChatHistory([]);
  };

  const startBreathingAnimation = () => {
    const colorAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shadowColorAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shadowColorAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shadowColorAnim, {
          toValue: 3,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    const radiusAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shadowRadiusAnim, {
          toValue: 60,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(shadowRadiusAnim, {
          toValue: 10,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    colorAnimation.start();
    radiusAnimation.start();

    // 3秒后停止动画
    setTimeout(() => {
      colorAnimation.stop();
      radiusAnimation.stop();
    }, 3000);
  };

  const fetchAdvice = async () => {
    setIsLoading(true);
    startBreathingAnimation();
    try {
      const userExerciseData = {
        steps: 5000,
        caloriesBurned: 300,
        activeMinutes: 45,
        workoutType: 'Running',
        duration: 30,
      };
      const messages = [
        { 
          role: 'system', 
          content: 'Please provide four exercise suggestions, each with a "Title" and "Content" field, content field should be less than 20 characters, returned as a JSON array. For example: [{"Title": "Drink more water", "Content": "Drink at least 8 cups of water daily."}, ...]' 
        },
        { role: 'user', content: JSON.stringify(userExerciseData) }
      ];

      const response = await fetch('https://xiaoai.plus/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      console.log('Returned JSON:', data); // Output to console

      if (data.choices && data.choices.length > 0) {
        const messageContent = data.choices[0].message.content.trim();
        console.log('Returned message content:', messageContent); // Output message content

        // Check if messageContent is valid JSON
        try {
          const adviceArray = JSON.parse(messageContent);
          setAdviceData(adviceArray);
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          console.error('Returned message content is not valid JSON:', messageContent);
        }
      } else {
        console.error('Failed to get suggestions');
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  const shadowColor = shadowColorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['rgba(0,0,0,0.8)', 'rgba(255,0,0,0.8)', 'rgba(0,255,0,0.8)', 'rgba(0,0,255,0.8)'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <Button 
          title="Back"
          onPress={() => navigation.goBack()}
          color="#000000"
        />
      </View>
      
      <Animated.View style={[styles.mainCard, { shadowColor, shadowRadius: shadowRadiusAnim, shadowOpacity: 0.5 }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Exercise Suggestions</Text>
          <TouchableOpacity onPress={fetchAdvice} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.cardsContainer}>
            {adviceData.length === 0 ? (
              <Animated.Text 
                style={[
                  styles.generatingText, 
                  { color: shadowColor } // 动态改变字体颜色
                ]}
              >
                Generating suggestions from Open AI
              </Animated.Text>
            ) : (
              adviceData.map((advice, index) => (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.card, 
                    isLoading && { shadowColor }
                  ]}
                >
                  <Text 
                    style={styles.cardTitle} 
                    numberOfLines={1} 
                    adjustsFontSizeToFit
                  >
                    {advice.Title}
                  </Text>
                  <Text 
                    style={styles.cardContent} 
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {advice.Content}
                  </Text>
                </Animated.View>
              ))
            )}
          </View>
        </View>
      </Animated.View>

      <View style={styles.healthAssistantCard}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Health Assistant</Text>
          <TouchableOpacity onPress={clearChatHistory} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Chat</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.chatContainer}>
          {chatHistory.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageContainer,
                msg.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Enter your question..."
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSend}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 45,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainCard: {
    marginTop: 40,
    marginBottom: 0,
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    paddingBottom: SIZES.padding.medium,
  },
  headerText: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  cardContent: {
    fontSize: SIZES.fontSize.small,
    color: COLORS.text.secondary,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.secondary,
  },
  messageText: {
    color: COLORS.text.primary,
    fontSize: SIZES.fontSize.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.medium,
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSize.small,
  },
  healthAssistantCard: {
    marginTop: 10,
    marginBottom: 0,
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    flex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  refreshButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
  },
  refreshButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSize.small,
  },
  generatingText: {
    fontSize: SIZES.fontSize.medium,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
