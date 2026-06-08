import { Request, Response } from 'express';
import { classifyMessage } from '../services/classifier.service';
import { getResponse, getBreathingStepResponse } from '../services/response.service';
import {
  getSession,
  createSession,
  updateSession,
  clearFlow,
  logMood,
  BREATHING_FLOW_STEPS,
} from '../services/session.service';
import { CRISIS_RESPONSE } from '../utils/constants';

export interface ChatResponse {
  reply: string;
  currentMood: string | null;
  category: string;
  isCrisis: boolean;
  sessionId: string;
  requiresFollowup: boolean;
  followupPrompt: string | null;
}

export async function handleChat(req: Request, res: Response): Promise<void> {
  const { message, sessionId: incomingSessionId } = req.body as {
    message: string;
    sessionId?: string;
  };

  // ── Validate input ─────────────────────────────────────────────────────────
  if (!message || typeof message !== 'string' || message.trim() === '') {
    res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
    return;
  }

  // ── Resolve session ────────────────────────────────────────────────────────
  let session = incomingSessionId ? getSession(incomingSessionId) : null;
  if (!session) {
    session = createSession();
  }

  const { session_id } = session;

  // ── 1. Crisis detection - ALWAYS FIRST ────────────────────────────────────
  const classification = classifyMessage(message);

  if (classification.isCrisis) {
    // Log the crisis mood and clear any active flow
    updateSession(session_id, { current_mood: 'hopeless', current_flow: null, flow_step: 0 });

    const response: ChatResponse = {
      reply: CRISIS_RESPONSE,
      currentMood: 'hopeless',
      category: 'crisis',
      isCrisis: true,
      sessionId: session_id,
      requiresFollowup: false,
      followupPrompt: null,
    };
    res.json(response);
    return;
  }

  // ── 2. Update mood if detected ─────────────────────────────────────────────
  if (classification.detectedMood) {
    updateSession(session_id, { current_mood: classification.detectedMood });
    session = getSession(session_id)!;
  }

  // ── 3. Handle active flows (breathing exercise, mood follow-up) ────────────
  if (session.current_flow === 'breathing_exercise') {
    const flowResult = handleBreathingFlow(session_id, session.flow_step, message);
    const response: ChatResponse = {
      ...flowResult,
      currentMood: session.current_mood,
      isCrisis: false,
      sessionId: session_id,
    };
    res.json(response);
    return;
  }

  if (session.current_flow === 'mood_followup') {
    const flowResult = handleMoodFollowup(session_id, session.flow_step, message, session.current_mood);
    const response: ChatResponse = {
      ...flowResult,
      currentMood: session.current_mood,
      isCrisis: false,
      sessionId: session_id,
    };
    res.json(response);
    return;
  }

  // ── 4. Fresh classification and response ───────────────────────────────────
  const { category, subTopic } = classification;

  // If breathing category, start the breathing flow
  if (category === 'breathing') {
    updateSession(session_id, {
      current_flow: 'breathing_exercise',
      flow_step: 0,
    });
    const responseData = getBreathingStepResponse('intro');

    if (classification.detectedMood) {
      logMood(session_id, classification.detectedMood, message);
    }

    res.json({
      reply: responseData.text,
      currentMood: session.current_mood,
      category: 'breathing',
      isCrisis: false,
      sessionId: session_id,
      requiresFollowup: responseData.requiresFollowup,
      followupPrompt: responseData.followupPrompt,
    } as ChatResponse);
    return;
  }

  // If mood tracking, start mood follow-up flow
  if (category === 'mood_tracking') {
    const responseData = getResponse(category, subTopic);

    if (classification.detectedMood) {
      logMood(session_id, classification.detectedMood, message);
    }

    if (responseData.requiresFollowup) {
      updateSession(session_id, {
        current_flow: 'mood_followup',
        flow_step: 1,
        context_data: { original_mood: classification.detectedMood },
      });
    }

    res.json({
      reply: responseData.text,
      currentMood: session.current_mood,
      category,
      isCrisis: false,
      sessionId: session_id,
      requiresFollowup: responseData.requiresFollowup,
      followupPrompt: responseData.followupPrompt,
    } as ChatResponse);
    return;
  }

  // Standard single-turn response for all other categories
  const responseData = getResponse(category, subTopic);

  res.json({
    reply: responseData.text,
    currentMood: session.current_mood,
    category,
    isCrisis: false,
    sessionId: session_id,
    requiresFollowup: responseData.requiresFollowup,
    followupPrompt: responseData.followupPrompt,
  } as ChatResponse);
}

// ── Breathing flow handler ─────────────────────────────────────────────────────
function handleBreathingFlow(
  sessionId: string,
  currentStep: number,
  userMessage: string
): Omit<ChatResponse, 'currentMood' | 'isCrisis' | 'sessionId'> {
  const lower = userMessage.toLowerCase();

  // User wants to stop
  if (lower.includes('stop') || lower.includes('exit') || lower.includes('cancel') || lower.includes('quit')) {
    clearFlow(sessionId);
    return {
      reply: "No problem at all! The breathing exercise has been stopped. Remember, you can start it again anytime you feel stressed or anxious. Is there anything else I can help you with?",
      category: 'breathing',
      requiresFollowup: false,
      followupPrompt: null,
    };
  }

  const nextStep = currentStep + 1;

  // Completed all steps
  if (nextStep >= BREATHING_FLOW_STEPS.length) {
    clearFlow(sessionId);
    const responseData = getBreathingStepResponse('complete');
    return {
      reply: responseData.text,
      category: 'breathing',
      requiresFollowup: responseData.requiresFollowup,
      followupPrompt: responseData.followupPrompt,
    };
  }

  const stepKey = BREATHING_FLOW_STEPS[nextStep];
  const responseData = getBreathingStepResponse(stepKey);

  // At step_4, check if user wants to continue
  if (stepKey === 'step_4') {
    if (lower.includes('no') || lower.includes('done') || lower.includes('stop')) {
      clearFlow(sessionId);
      const completeData = getBreathingStepResponse('complete');
      return {
        reply: completeData.text,
        category: 'breathing',
        requiresFollowup: false,
        followupPrompt: null,
      };
    }
    // Reset to repeat from step_1
    updateSession(sessionId, { flow_step: 1 });
    const repeatResponse = getBreathingStepResponse('step_1');
    return {
      reply: "Great, let's do another round! \n\n" + repeatResponse.text,
      category: 'breathing',
      requiresFollowup: false,
      followupPrompt: null,
    };
  }

  updateSession(sessionId, { flow_step: nextStep });

  return {
    reply: responseData.text,
    category: 'breathing',
    requiresFollowup: responseData.requiresFollowup,
    followupPrompt: responseData.followupPrompt,
  };
}

// ── Mood follow-up flow handler ────────────────────────────────────────────────
function handleMoodFollowup(
  sessionId: string,
  currentStep: number,
  userMessage: string,
  currentMood: string | null
): Omit<ChatResponse, 'currentMood' | 'isCrisis' | 'sessionId'> {
  clearFlow(sessionId);

  const supportMessage = buildMoodFollowupReply(currentMood, userMessage);

  return {
    reply: supportMessage,
    category: 'mood_tracking',
    requiresFollowup: false,
    followupPrompt: null,
  };
}

function buildMoodFollowupReply(mood: string | null, userMessage: string): string {
  const lower = userMessage.toLowerCase();

  const isWorkRelated = lower.includes('work') || lower.includes('job') || lower.includes('boss') || lower.includes('deadline');
  const isRelationshipRelated = lower.includes('relationship') || lower.includes('partner') || lower.includes('family') || lower.includes('friend');
  const isStudyRelated = lower.includes('study') || lower.includes('school') || lower.includes('university') || lower.includes('exam');

  if (isWorkRelated) {
    return "Work-related stress and pressure are really common, especially for young adults. It's important to set healthy boundaries between your work life and personal life. Would you like me to guide you through a quick breathing exercise to help release some of that tension?";
  }
  if (isRelationshipRelated) {
    return "Relationship challenges can be emotionally draining, and it makes sense that they're affecting how you feel. You're not alone in this. Remember that it's okay to reach out to people you trust, or even a counselor, for support. Would you like some resources or a calming exercise?";
  }
  if (isStudyRelated) {
    return "Academic pressure is really tough to deal with, and it's very common to feel overwhelmed by studies. Breaking things into smaller steps can help make it feel more manageable. Would you like some stress management tips or a breathing exercise to help you refocus?";
  }

  // Generic supportive follow-up based on mood
  const moodReplies: Record<string, string> = {
    stressed: "That sounds really overwhelming. Thank you for sharing that with me. Remember that it's okay to take things one step at a time. Would you like to try a breathing exercise or get some stress management tips?",
    anxious: "I hear you — anxiety about that is understandable. You're being really brave by talking about it. Would you like a calming exercise, or would it help to learn more about managing anxiety?",
    sad: "I'm sorry you're dealing with that. It's completely okay to feel sad, and you don't have to go through it alone. Would you like to talk more, or would a gentle relaxation exercise help?",
    angry: "That does sound frustrating. Your feelings are completely valid. Sometimes when we're angry, a quick breathing exercise can help bring the intensity down. Want to try one?",
    tired: "Feeling drained like that is hard. It might be worth looking at your sleep habits and daily routine to see where you can add some recovery time. Would you like some sleep tips or energy-boosting advice?",
  };

  return moodReplies[mood || ''] || "Thank you so much for sharing that with me. It helps me understand what you're going through. Remember, whatever you're feeling is valid. I'm here to support you. Would you like any coping strategies or would you just like to talk more?";
}
