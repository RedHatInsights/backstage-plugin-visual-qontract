import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { v4 as uuidv4 } from 'uuid';
import {
  useApi,
  configApiRef,
  identityApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { MarkdownContent } from '@backstage/core-components';

const FloatingChat = () => {
  const greetingMessage = [
    {
      sender: 'bot',
      text: `Hello! 👋 I'm the Convo Incident Management Assistant. I can answer questions about incident management and response including process, workflow, tools, roles, and more. How can I help?`,
    },
  ];
  const [open, setOpen] = useState(true);
  const [assistantId, setAssistantId] = useState(null);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [conversation, setConversation] = useState(greetingMessage);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('You');
  const chatEndRef = useRef(null);
  const config = useApi(configApiRef);
  const identity = useApi(identityApiRef);
  const fetchApi = useApi(fetchApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const theme = useTheme();

  useEffect(() => {
    const fetchAssistantId = async () => {
      const res = await fetchApi.fetch(
        `${backendUrl}/api/proxy/tangerine/api/assistants`,
      );
      const assistants = await res.json();
      const found = assistants.data.find(a =>
        a.name.toLowerCase().includes('incident-management'),
      );
      if (found) setAssistantId(found.id);
    };

    const fetchUsername = async () => {
      const identityResponse = await identity.getProfileInfo();
      setUsername(identityResponse.displayName || 'You');
    };

    fetchAssistantId();
    fetchUsername();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const interactionId = uuidv4();
    const newConversation = [...conversation, { sender: 'human', text: input }];
    setConversation(newConversation);
    setInput('');
    setLoading(true);

    const response = await fetchApi.fetch(
      `${backendUrl}/api/proxy/tangerine/api/assistants/${assistantId}/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistantId,
          sessionId,
          client: 'convo',
          query: input,
          sender: 'human',
          prevMsgs: newConversation,
          interactionId,
        }),
      },
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let botContent = '';
    setConversation(prev => [
      ...prev,
      { sender: 'bot', text: '', interactionId },
    ]);

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const json = JSON.parse(line.replace(/^data:\s*/, ''));
            if (json.text_content) {
              botContent += json.text_content;

              setConversation(prev => {
                const updated = [...prev];
                updated[updated.length - 1].text = botContent;
                return updated;
              });
            }
          } catch (e) {
            console.error('Error parsing streamed JSON:', e, line);
          }
        }
      }
    }
    setLoading(false);
  };

  const clearConversation = () => {
    setConversation([]);
    setSessionId(uuidv4());
  };

  const CloseButton = () => {
    if (showCloseButton) {
      return (
        <IconButton
          size="small"
          onClick={() => {
            setOpen(false);
            clearConversation();
          }}
        >
          <CloseOutlined fontSize="small" />
        </IconButton>
      );
    }
    return null;
  };

  return (
    <Box>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', bottom: 24, left: 250, zIndex: 1000 }}
          variant="contained"
        >
          AI Assistant
        </Button>
      )}
      {open && (
        <Paper
          elevation={4}
          sx={{
            height: 524,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">AI Assistant</Typography>
            <Box>
              <Button size="small" onClick={clearConversation}>
                Clear
              </Button>
              <CloseButton />
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
            {conversation.map((entry, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: entry.sender === 'human' ? 'right' : 'left',
                  mb: 3,
                }}
              >
                {entry.sender === 'human' ? (
                  <Box
                    sx={{
                      display: 'inline-block',
                      bgcolor: '#EE0000',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: '80%',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      <strong>{username}:</strong>
                      <MarkdownContent content={entry.text || ''} />
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', mb: 0.5 }}
                    >
                      Incident Management Assistant:
                    </Typography>
                    <MarkdownContent content={entry.text || ''} />
                  </Box>
                )}
              </Box>
            ))}
            {loading && (
              <Box sx={{ textAlign: 'left', mb: 1 }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '80%',
                  }}
                >
                  <CircularProgress
                    size={16}
                    sx={{ verticalAlign: 'middle' }}
                  />
                </Box>
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              placeholder="Type a message"
              value={input}
              disabled={loading}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              sx={{ input: { color: theme.palette.text.primary } }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default FloatingChat;
