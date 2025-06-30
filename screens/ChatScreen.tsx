import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase';
import firestore from '@react-native-firebase/firestore';
import { sendChat } from '../services/chatService';

// Get user ID for Firestore (placeholder - implement authentication later)
const getUserId = () => {
  // In a real app, this would come from Firebase Authentication
  return 'anonymous-user';
};

// Suggestion chip data
const suggestionChips = [
  { id: '1', icon: '📧', text: 'Compose an email' },
  { id: '2', icon: '🗺️', text: 'Plan a trip' },
  { id: '3', icon: '📝', text: 'Prepare a presentation' },
  { id: '4', icon: '📅', text: 'Schedule a meeting' },
  { id: '5', icon: '🖥️', text: 'Design a website' },
  { id: '6', icon: '📊', text: 'Create a report' },
  { id: '7', icon: '🔍', text: 'Research a topic' },
  { id: '8', icon: '📚', text: 'Update the documentation' },
];

// Typing indicator with animated dots
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);
  return (
    <View style={styles.typingIndicatorContainer}>
      <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
    </View>
  );
};

// Define ChatMessage type
type ChatMessage = { role: 'user' | 'assistant'; content: string; };

// Type for stored conversations
type ChatConversation = { id: string; messages: ChatMessage[]; createdAt: string };

export default function ChatScreen() {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const userName = 'Jessie';
  // start with assistant greeting or loaded messages
  const initialGreeting: ChatMessage = { role: 'assistant', content: `Greetings, ${userName}! How Can I Help?` };
  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ChatConversation[]>([]);
  
  // Animation for input focus
  const focusAnim = useRef(new Animated.Value(0)).current;
  const onInputFocus = () => Animated.timing(focusAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  const onInputBlur = () => Animated.timing(focusAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  
  // Load chat history from Firestore
  useEffect(() => {
    const unsubscribe = db.collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const loadedHistory: ChatConversation[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          loadedHistory.push({
            id: doc.id,
            messages: data.messages,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
          });
        });
        setHistory(loadedHistory);
      });
      
    return () => unsubscribe();
  }, []);
  
  // Save current conversation to Firestore
  const saveHistory = async () => {
    if (messages.length <= 1) return;
    
    await db.collection('chats').add({
      messages,
      createdAt: firestore.FieldValue.serverTimestamp()
    });
  };
  
  // Start a new chat
  const handleNewChat = async () => {
    await saveHistory();
    setMessages([initialGreeting]);
    setInputText('');
  };
  
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    try {
      const assistantMessage = await sendChat([...messages, userMessage]);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LinearGradient
      colors={['#e6d9ff', '#d9c3ff', '#c6b3ff']} // slightly darker stops for contrast
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleNewChat} style={styles.headerButton}>
              <Ionicons name="add-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowHistory(true)} style={styles.headerButton}>
              <Ionicons name="time-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Chat content */}
          <View style={styles.chatContainer}>
            <FlatList
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.role === 'user' ? styles.userBubble : styles.assistantBubble
                  ]}
                >
                  <Text style={styles.messageText}>{item.content}</Text>
                </View>
              )}
              contentContainerStyle={styles.messagesList}
              ListFooterComponent={() => isLoading ? <TypingIndicator /> : null}
            />
            {messages.length === 1 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={suggestionChips}
                  horizontal
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionChip}
                      onPress={() => sendMessage(item.text)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.chipIcon}>{item.icon}</Text>
                      <Text style={styles.chipText}>{item.text}</Text>
                    </TouchableOpacity>
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionsList}
                />
              </View>
            )}
          </View>

          {/* Chat History Modal */}
          {showHistory && (
            <Modal animationType="slide" transparent>
              <TouchableWithoutFeedback onPress={() => setShowHistory(false)}>
                <View style={styles.historyOverlay}>
                  <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Chat History</Text>
                    <FlatList
                      data={history}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => (
                        <Pressable style={styles.historyItem} onPress={() => { setMessages(item.messages); setShowHistory(false); }}>
                          <Text style={styles.historyText}>{new Date(item.createdAt).toLocaleString()}</Text>
                        </Pressable>
                      )}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          {/* Input Field */}
          <Animated.View style={[styles.inputWrapper, {
            backgroundColor: focusAnim.interpolate({ inputRange: [0,1], outputRange: ['#fff','#f0e6ff'] })
          }]}
          >
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              editable={!isLoading}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, styles.sendButton]}
              onPress={() => sendMessage(inputText)}
              disabled={isLoading}
            >
              <Ionicons name={inputText.trim() ? 'send' : 'mic'} size={24} color="white" />
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  messagesList: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  assistantBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  suggestionsContainer: {
    marginVertical: 16,
  },
  suggestionsList: {
    paddingHorizontal: 16,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    minHeight: 44,
  },
  chipIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  historyOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  historyContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
});
