
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from 'expo-constants';
import LatexRenderer from './LatexRenderer'; // Make sure path is correct
import axios from 'axios';

const GEMINI_API_KEY = Constants?.expoConfig?.extra?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '0', sender: 'bot', text: 'Hi! I am Gemini. Ask me anything. I can help you with math and physics!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const cleanMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    const loadingId = Date.now().toString() + '_loading';
    setMessages(prev => [...prev, { id: loadingId, sender: 'bot', text: '__LOADING__' }]);

    try {
      if (!GEMINI_API_KEY) throw new Error('Gemini API key not found.');
      const res = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: input }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      const botText = cleanMarkdown(rawText);
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      setMessages(prev => [...prev, { id: Date.now().toString() + '_bot', sender: 'bot', text: botText }]);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || err.message || 'Unknown error.';
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      setMessages(prev => [...prev, { id: Date.now().toString() + '_err', sender: 'error', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = (sender: string) => (
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>
        {sender === 'user' ? '🧑' : sender === 'bot' ? '🤖' : '⚠️'}
      </Text>
    </View>
  );

  const parseContent = (text: string): { type: 'text' | 'math'; content: string }[] => {
    const parts = text.split(/(\$\$[^$]+\$\$)/g);
    return parts.map(part => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return { type: 'math', content: part.slice(2, -2).trim() };
      } else {
        return { type: 'text', content: part.trim() };
      }
    }).filter(p => p.content);
  };

  const renderMessage = (item: { id: string; sender: string; text: string }) => {
    if (item.text === '__LOADING__') {
      return (
        <View key={item.id} style={[styles.messageRow, styles.rowBot]}>
          {renderAvatar('bot')}
          <View style={[styles.bubble, styles.bubbleBot, { flexDirection: 'row', alignItems: 'center' }]}>
            <ActivityIndicator color="#4fc3f7" size="small" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontFamily: 'SpaceMono-Regular', fontSize: 16 }}>Gemini is typing...</Text>
          </View>
        </View>
      );
    }

    const parsed = parseContent(item.text);
    return (
      <View key={item.id} style={[styles.messageRow, item.sender === 'user' ? styles.rowUser : styles.rowBot]}>
        {item.sender !== 'user' && renderAvatar(item.sender)}
        <View style={[
          styles.bubble,
          item.sender === 'user' ? styles.bubbleUser : item.sender === 'bot' ? styles.bubbleBot : styles.bubbleError,
          { alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start' }
        ]}>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            {parsed.map((block, idx) =>
              block.type === 'math' ? (
                <LatexRenderer key={idx} latex={block.content} />
              ) : (
                <Text key={idx} style={styles.messageText}>{block.content}</Text>
              )
            )}
          </View>
        </View>
        {item.sender === 'user' && renderAvatar(item.sender)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.chatArea}
          extraScrollHeight={Platform.select({ ios: 0, android: 24 })}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
        >
          {messages.map(renderMessage)}
        </KeyboardAwareScrollView>
        <View style={styles.inputBarWrapper}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor="#888"
              multiline
              editable={!loading}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading || !input.trim()}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>➤</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111' },
  keyboardAvoidingView: { flex: 1 },
  scrollView: { flex: 1 },
  chatArea: { padding: 16, paddingBottom: 32, flexGrow: 1, justifyContent: 'flex-end' },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10, flexShrink: 1 },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '90%', padding: 12, borderRadius: 18, marginHorizontal: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3, flexShrink: 1,
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', overflow: 'hidden'
  },
  bubbleUser: { backgroundColor: '#4fc3f7', borderBottomRightRadius: 6, alignSelf: 'flex-end' },
  bubbleBot: { backgroundColor: '#222', borderBottomLeftRadius: 6, alignSelf: 'flex-start' },
  bubbleError: { backgroundColor: '#440000', borderColor: '#ff4444', borderWidth: 1, alignSelf: 'flex-start' },
  messageText: { color: '#fff', fontSize: 16, fontFamily: 'SpaceMono-Regular', flexShrink: 1, minWidth: 0 },
  avatarCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#222',
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 2,
    borderWidth: 1, borderColor: '#333'
  },
  avatarText: { fontSize: 18, color: '#fff', fontFamily: 'SpaceMono-Regular' },
  inputBarWrapper: { padding: 8, backgroundColor: 'transparent' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#222',
    borderRadius: 24, paddingHorizontal: 12, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },
  input: {
    flex: 1, color: '#fff', minHeight: 40, maxHeight: 100,
    fontSize: 16, fontFamily: 'SpaceMono-Regular', paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  sendBtn: {
    marginLeft: 8, backgroundColor: '#4fc3f7', borderRadius: 20,
    padding: 10, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
  },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default ChatScreen;
