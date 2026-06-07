import { initDatabase, getDb, dbRun, dbAll, dbInsert, saveDb } from './database';

async function seed() {
  await initDatabase();
  const db = getDb();

  // Clear existing data
  db.run(`DELETE FROM keywords`);
  db.run(`DELETE FROM responses`);
  db.run(`DELETE FROM categories`);
  saveDb();

  // ── CATEGORIES ──────────────────────────────────────────────────────────────
  const categories: Record<string, number> = {};
  const categoryData = [
    ['mood_tracking',      'Mood Tracking',        'Daily emotional check-ins and mood logging'],
    ['breathing',          'Breathing & Relaxation','Guided breathing exercises and relaxation techniques'],
    ['sleep',              'Sleep Hygiene',         'Sleep tips and healthy bedtime routines'],
    ['psychoeducation',    'Mental Health Education','Information about mental health conditions'],
    ['professional_help',  'Professional Help',     'Access to professional resources and emergency contacts'],
    ['greeting_smalltalk', 'Greeting & Small Talk', 'General greetings and small talk'],
  ];

  for (const [name, display, desc] of categoryData) {
    const id = dbInsert(
      `INSERT INTO categories (name, display_name, description) VALUES (?, ?, ?)`,
      [name, display, desc]
    );
    categories[name] = id;
  }

  // ── KEYWORDS ────────────────────────────────────────────────────────────────
  function addKeywords(categoryName: string, keywords: [string, number][]) {
    for (const [kw, w] of keywords) {
      dbInsert(`INSERT INTO keywords (category_id, keyword, weight) VALUES (?, ?, ?)`,
        [categories[categoryName], kw, w]);
    }
  }

  // MOOD TRACKING (60+)
  addKeywords('mood_tracking', [
    ['i feel', 1], ['i am feeling', 1], ['feeling', 1], ['i felt', 1], ['i have been feeling', 1],
    ['my mood', 1], ['my emotions', 1], ['emotionally', 1],
    ['happy', 2], ['happiness', 2], ['joyful', 2], ['excited', 2], ['great', 1],
    ['wonderful', 1], ['fantastic', 1], ['amazing', 1], ['good today', 2], ['feeling good', 2],
    ['cheerful', 2], ['delighted', 2], ['elated', 2], ['calm', 2], ['peaceful', 2],
    ['content', 2], ['grateful', 2], ['positive', 1], ['blessed', 2],
    ['sad', 2], ['sadness', 2], ['unhappy', 2], ['miserable', 2], ['depressed', 2],
    ['down', 1], ['feeling down', 2], ['low', 1], ['feeling low', 2], ['gloomy', 2],
    ['stressed', 2], ['stress', 2], ['stressed out', 2], ['overwhelmed', 2], ['pressure', 1],
    ['anxious', 2], ['anxiety', 2], ['nervous', 2], ['worried', 2], ['fearful', 2],
    ['scared', 2], ['frightened', 2], ['uneasy', 2], ['apprehensive', 2],
    ['angry', 2], ['anger', 2], ['frustrated', 2], ['irritated', 2], ['annoyed', 2],
    ['furious', 2], ['mad', 1], ['rage', 2], ['resentful', 2],
    ['tired', 2], ['exhausted', 2], ['fatigued', 2], ['drained', 2], ['burned out', 2],
    ['burnout', 2], ['no energy', 2], ['worn out', 2], ['sleepy', 1],
    ['lonely', 2], ['alone', 1], ['isolated', 2], ['disconnected', 2], ['empty', 2],
    ['hopeless', 2], ['helpless', 2], ['lost', 1], ['confused', 1], ['numb', 2],
    ['terrible', 2], ['awful', 2], ['horrible', 2], ['not okay', 2], ['not good', 2],
    ['not great', 2], ['not well', 2], ['bad day', 2], ['hard day', 2], ['rough day', 2],
    ['track my mood', 3], ['log my mood', 3], ['check in', 2], ['daily check', 2],
    ['how am i', 2], ['mood today', 2], ['emotion today', 2],
  ]);

  // BREATHING (60+)
  addKeywords('breathing', [
    ['breathe', 2], ['breathing', 2], ['breathing exercise', 3], ['breath', 2],
    ['deep breath', 3], ['slow breath', 3], ['mindful breathing', 3], ['breath work', 3],
    ['breathwork', 3], ['inhale', 2], ['exhale', 2], ['inhale exhale', 3],
    ['4-4-4', 3], ['box breathing', 3], ['4-7-8', 3], ['belly breathing', 3],
    ['diaphragm', 2], ['diaphragmatic', 2],
    ['relax', 2], ['relaxation', 2], ['relax me', 3], ['help me relax', 3],
    ['calm down', 3], ['calm me down', 3], ['calm myself', 3], ['calm my nerves', 3],
    ['i need to calm', 3], ['help me calm', 3],
    ['panic', 2], ['panic attack', 3], ['having a panic', 3], ['panicking', 3],
    ['heart racing', 2], ['heart pounding', 2], ['chest tight', 2], ['chest tightness', 2],
    ['cant breathe', 3], ["can't breathe", 3], ['short of breath', 3], ['breathless', 2],
    ['hyperventilating', 3], ['hyperventilate', 3],
    ['tense', 2], ['tension', 2], ['wound up', 2], ['keyed up', 2], ['worked up', 2],
    ['on edge', 2], ['jittery', 2], ['shaky', 2], ['trembling', 2],
    ['need to relax', 3], ['want to relax', 3], ['how to relax', 3],
    ['stress relief', 3], ['instant calm', 2], ['quick calm', 2], ['fast relief', 2],
    ['mind racing', 2], ['thoughts racing', 2], ['cant stop thinking', 2],
    ['grounding', 2], ['grounding exercise', 3], ['grounding technique', 3],
    ['meditation', 2], ['guided meditation', 3], ['mindfulness', 2], ['mindful', 2],
    ['progressive relaxation', 3], ['muscle relaxation', 3], ['body scan', 2],
    ['visualization', 2], ['mental calm', 2], ['peace of mind', 2],
    ['overwhelmed right now', 3], ['too anxious', 2], ['very anxious', 2],
    ['freaking out', 3], ['losing it', 2], ['losing control', 2], ['spiraling', 2],
    ['exercise breathing', 2], ['breathing technique', 3], ['breathing method', 3],
    ['start breathing', 2], ['begin exercise', 2], ['relaxation exercise', 3],
    ['soothe', 2], ['soothing', 2], ['settle down', 2], ['ease anxiety', 2], ['ease stress', 2],
  ]);

  // SLEEP (60+)
  addKeywords('sleep', [
    ["can't sleep", 3], ['cannot sleep', 3], ['trouble sleeping', 3], ['sleep problem', 3],
    ['sleep issues', 3], ['sleeping problem', 3], ['i cant sleep', 3], ['unable to sleep', 3],
    ['having trouble sleeping', 3], ['hard time sleeping', 3], ['sleep disorder', 3],
    ['sleep deprivation', 3], ['sleep deprived', 3], ['not sleeping well', 3],
    ['insomnia', 3], ['insomniac', 3], ['sleepless', 3], ['sleeplessness', 3],
    ['lying awake', 2], ['lying in bed', 2], ['staring at ceiling', 2],
    ['wide awake', 2], ['eyes wont close', 2],
    ['bad sleep', 2], ['poor sleep', 2], ['sleep quality', 2], ['restless night', 2],
    ['restless sleep', 2], ['waking up', 2], ['keep waking up', 3], ['wake up at night', 3],
    ['wake up early', 2], ['early morning waking', 2], ['light sleeper', 2],
    ['fall asleep', 3], ['falling asleep', 3], ['drift off', 2], ['doze off', 2],
    ['cant fall asleep', 3], ['takes long to sleep', 2], ['difficult to fall asleep', 3],
    ['sleep hygiene', 3], ['bedtime routine', 3], ['night routine', 3], ['sleep schedule', 3],
    ['sleep habits', 3], ['sleep tips', 3], ['better sleep', 3], ['improve sleep', 3],
    ['sleep advice', 3], ['sleep help', 3], ['sleep recommendation', 3],
    ['screen before bed', 2], ['phone before bed', 2], ['blue light', 2], ['screen time', 2],
    ['caffeine', 2], ['coffee before bed', 2], ['alcohol sleep', 2],
    ['bedroom environment', 2], ['room temperature', 2], ['dark room', 2], ['noise sleep', 2],
    ['tired all the time', 2], ['always tired', 2], ['exhausted all day', 2],
    ['no energy in morning', 2], ['groggy', 2], ['drowsy', 2],
    ['fatigue', 2], ['afternoon fatigue', 2], ['daytime sleepiness', 2],
    ['nightmare', 2], ['nightmares', 2], ['bad dreams', 2], ['night terrors', 2],
    ['sleep anxiety', 3], ['afraid to sleep', 2], ['scared to sleep', 2],
    ['nap', 1], ['napping', 1], ['power nap', 2], ['nap too much', 2],
    ['oversleeping', 2], ['sleep too much', 2], ['melatonin', 2], ['natural sleep', 2],
  ]);

  // PSYCHOEDUCATION (60+)
  addKeywords('psychoeducation', [
    ['what is', 2], ['what are', 2], ['tell me about', 2], ['explain', 2],
    ['define', 2], ['definition', 2], ['meaning of', 2], ['what does', 2],
    ['can you explain', 2], ['help me understand', 2], ['i want to know about', 2],
    ['information about', 2], ['learn about', 2], ['how does', 2],
    ['anxiety', 3], ['anxious', 2], ['anxiety disorder', 3], ['generalized anxiety', 3],
    ['social anxiety', 3], ['anxiety symptoms', 3], ['anxiety causes', 3],
    ['anxiety treatment', 3], ['anxiety attack', 3], ['anxiety feel like', 3],
    ['signs of anxiety', 3], ['living with anxiety', 3],
    ['depression', 3], ['depressed', 2], ['clinical depression', 3],
    ['major depression', 3], ['symptoms of depression', 3], ['depression symptoms', 3],
    ['depression causes', 3], ['signs of depression', 3], ['depression treatment', 3],
    ['feel depressed', 2], ['am i depressed', 3], ['why am i depressed', 3],
    ['stress', 2], ['chronic stress', 3], ['stress symptoms', 3], ['signs of stress', 3],
    ['effects of stress', 3], ['stress causes', 3], ['work stress', 2], ['academic stress', 2],
    ['relationship stress', 2], ['stress and health', 3], ['stress management', 3],
    ['panic attack', 3], ['panic attacks', 3], ['panic disorder', 3],
    ['what is a panic attack', 3], ['panic attack symptoms', 3],
    ['panic attack feels like', 3], ['having a panic attack', 3],
    ['panic attack vs anxiety', 3], ['how long panic attack', 3],
    ['mental health', 2], ['mental illness', 3], ['mental disorder', 3],
    ['emotional health', 2], ['psychological health', 2], ['wellbeing', 2],
    ['mental wellbeing', 2], ['emotional wellbeing', 2], ['trauma', 3],
    ['ptsd', 3], ['post traumatic', 3], ['burnout mental', 3], ['mental exhaustion', 3],
    ['mood disorder', 3], ['bipolar', 3], ['ocd', 3], ['phobia', 3],
    ['am i normal', 2], ['is it normal to', 2], ['why do i feel', 2],
    ['why am i so', 2], ['what is wrong with me', 2],
  ]);

  // PROFESSIONAL HELP (60+)
  addKeywords('professional_help', [
    ['professional help', 3], ['need help', 2], ['i need help', 3], ['help me', 1],
    ['need support', 2], ['i need support', 3], ['seeking help', 3], ['looking for help', 3],
    ['where can i get help', 3], ['how to get help', 3], ['find help', 3],
    ['therapist', 3], ['therapy', 3], ['counselor', 3], ['counselling', 3], ['counseling', 3],
    ['psychologist', 3], ['psychotherapy', 3], ['psychiatrist', 3], ['psychiatry', 3],
    ['mental health professional', 3], ['mental health doctor', 3], ['mental health specialist', 3],
    ['see a doctor', 2], ['talk to a doctor', 2], ['visit a doctor', 2],
    ['see a therapist', 3], ['talk to a therapist', 3], ['find a therapist', 3],
    ['see a counselor', 3], ['talk to a counselor', 3],
    ['hotline', 3], ['helpline', 3], ['crisis line', 3], ['crisis hotline', 3],
    ['call for help', 2], ['emergency contact', 3], ['emergency support', 3],
    ['crisis support', 3], ['crisis center', 3], ['crisis service', 3],
    ['mental health hotline', 3], ['suicide hotline', 3], ['crisis number', 3],
    ['treatment', 2], ['medication', 2], ['antidepressant', 3], ['antianxiety', 3],
    ['therapy sessions', 3], ['cbt', 3], ['cognitive behavioral', 3],
    ['online therapy', 3], ['virtual therapy', 3], ['telehealth', 3],
    ['resources', 2], ['mental health resources', 3], ['support group', 3],
    ['support groups', 3], ['peer support', 3], ['community support', 3],
    ['appointment', 2], ['book appointment', 3], ['schedule appointment', 3],
    ['afraid to seek help', 2], ['nervous about therapy', 2], ['therapy too expensive', 2],
    ['cant afford therapy', 2], ['free mental health', 3], ['affordable help', 3],
    ['talk to someone', 3], ['talk to a real person', 3], ['speak to someone', 3],
    ['human support', 2], ['live support', 2],
  ]);

  // GREETING / SMALL TALK (60+)
  addKeywords('greeting_smalltalk', [
    ['hi', 1], ['hey', 1], ['hello', 1], ['hiya', 1], ['howdy', 1],
    ['good morning', 2], ['good afternoon', 2], ['good evening', 2], ['good night', 2],
    ['morning', 1], ['afternoon', 1], ['evening', 1],
    ['what is up', 1], ["what's up", 1], ['sup', 1], ['yo', 1],
    ['greetings', 2], ['salutations', 2], ['hi there', 2], ['hey there', 2],
    ['who are you', 3], ['what are you', 3], ['your name', 2], ['what is your name', 3],
    ['are you a bot', 3], ['are you ai', 3], ['are you human', 3], ['are you real', 3],
    ['what can you do', 3], ['what do you do', 3], ['how can you help', 3],
    ['your purpose', 3], ['what is mindcare', 3], ['about mindcare', 3],
    ['tell me about yourself', 3], ['describe yourself', 3],
    ['how are you', 2], ['how are you doing', 2], ['how do you do', 2],
    ['are you okay', 2], ['you good', 1],
    ['thank you', 2], ['thanks', 2], ['thank you so much', 2], ['thank u', 2],
    ['appreciate it', 2], ['appreciate that', 2], ['that helped', 2],
    ['that was helpful', 2], ['very helpful', 2], ['so helpful', 2],
    ['good advice', 2], ['that makes sense', 2], ['i understand now', 2],
    ['bye', 2], ['goodbye', 2], ['bye bye', 2], ['see you', 2], ['take care', 2],
    ['talk later', 2], ['good talk', 2], ['until next time', 2], ['farewell', 2],
    ['see you later', 2], ['ttyl', 2], ['gtg', 2],
    ['start', 2], ['begin', 2], ['lets start', 2], ["let's begin", 2], ['open', 1],
    ['i want to talk', 2], ['i need to talk', 2], ['can we talk', 2],
    ['just checking in', 2], ['checking in', 2],
    ['okay', 1], ['ok', 1], ['alright', 1], ['sure', 1],
  ]);

  // ── RESPONSES ────────────────────────────────────────────────────────────────
  function addResponses(categoryName: string, responses: [string | null, string, number, string | null][]) {
    for (const [sub, text, fu, fup] of responses) {
      dbInsert(
        `INSERT INTO responses (category_id, sub_topic, response_text, requires_followup, followup_prompt) VALUES (?, ?, ?, ?, ?)`,
        [categories[categoryName], sub, text, fu, fup]
      );
    }
  }

  // MOOD RESPONSES
  addResponses('mood_tracking', [
    ['happy', "That's wonderful to hear! It sounds like things are going well for you today. What's been making you feel happy? I'd love to hear about it.", 1, "Tell me what's been making you happy today!"],
    ['happy', "I'm really glad you're feeling happy today! Positive emotions are so important for our wellbeing. Would you like to do a quick check-in to capture this feeling?", 0, null],
    ['happy', "Happiness looks good on you! It's great that you're feeling this way. Remember to take a moment to appreciate the good things in your life right now.", 0, null],
    ['calm', "Feeling calm is such a valuable state to be in. I'm glad you're experiencing some peace right now. Is there anything specific that has helped you feel this way today?", 0, null],
    ['calm', "A calm mind is a healthy mind. It's great that you're feeling balanced and at peace. Keep doing whatever is helping you maintain this feeling.", 0, null],
    ['calm', "That's lovely — calmness and peace are really good for your mental health. Would you like a short mindfulness exercise to help you hold onto this feeling?", 1, "Would you like a quick mindfulness moment?"],
    ['excited', "Excitement is such a wonderful energy! I love hearing that you're feeling this way. What are you excited about? Sometimes sharing it makes it even better!", 1, "What's got you feeling so excited?"],
    ['excited', "That positive energy is amazing! Being excited is great for your motivation and mood. Just make sure you're also getting enough rest along with all that enthusiasm!", 0, null],
    ['sad', "I'm really sorry you're feeling sad right now. It's completely okay to feel this way — your emotions are valid. Would you like to talk a bit more about what's going on?", 1, "Can you tell me a little about what's been making you feel sad?"],
    ['sad', "Sadness can be really heavy to carry. I want you to know that you don't have to go through it alone. I'm here to listen whenever you need. What's been on your mind?", 1, "What's been weighing on you lately?"],
    ['sad', "Feeling sad is a natural part of being human, even though it doesn't make it any easier. Is there anything I can do to support you right now — like a breathing exercise or some helpful information?", 1, "Would a breathing exercise or some support information help right now?"],
    ['stressed', "Stress can really take a toll on you, and I hear that you're going through a tough time. Can you tell me a little about what's been causing your stress? Sometimes just naming it helps.", 1, "What's been causing you the most stress lately?"],
    ['stressed', "I'm sorry to hear you're feeling stressed. It's important to take that seriously. I know it can feel overwhelming, but we can work through this together. Would you like to try a quick breathing exercise?", 1, "Would you like to try a breathing exercise to help ease the stress?"],
    ['stressed', "Stress is your body's way of saying it needs some care and attention. You're doing the right thing by checking in. Let me help you find some relief — what would you like to try first?", 1, "Shall we try a breathing exercise, or would you like some tips for managing stress?"],
    ['anxious', "I understand that feeling anxious can be really uncomfortable and sometimes scary. You're not alone in this. Can you tell me a bit more about what's making you feel anxious?", 1, "What's been triggering your anxiety lately?"],
    ['anxious', "Anxiety can make everything feel more intense than it needs to be. I'm here with you. Would you like to try a calming breathing exercise to help bring that anxiety down a little?", 1, "Want to try a breathing exercise to calm the anxiety?"],
    ['angry', "Feeling angry is completely valid — our emotions exist for a reason. I'm glad you felt comfortable enough to share that. Would you like to talk about what's been making you feel this way?", 1, "What's been making you feel angry?"],
    ['angry', "Anger can be really draining when it builds up. It might help to take a few deep breaths to bring that intensity down a notch. Would you like me to guide you through a quick exercise?", 1, "Want to try a quick calming exercise?"],
    ['tired', "Feeling tired and exhausted is really hard, especially when it doesn't seem to go away. Are you getting enough sleep? Sometimes fatigue is a sign that our body needs more rest and care.", 1, "How has your sleep been lately?"],
    ['tired', "Exhaustion can really affect your mood and how you see the world. I'm sorry you're feeling this way. Would you like some sleep tips, or would a short relaxation exercise help you recharge?", 1, "Would sleep tips or a relaxation exercise help most right now?"],
    ['lonely', "Loneliness can be one of the most painful feelings — even when you're surrounded by people. I'm really glad you shared that with me. Would you like to talk about it?", 1, "Would you like to talk about what's been making you feel lonely?"],
    [null, "Thank you for sharing how you're feeling. It takes courage to check in with yourself. Can you tell me a little more about what's going on so I can better support you?", 1, "Can you tell me more about how you're feeling?"],
    [null, "I appreciate you taking the time to do an emotional check-in. That's a really positive habit! How long have you been feeling this way?", 1, "How long have you been feeling this way?"],
    [null, "Your feelings are important and I'm here to listen. Would you like to explore some coping strategies, or would you prefer to just talk about what's on your mind?", 1, "Would you like coping strategies, or would you prefer to talk?"],
  ]);

  // BREATHING RESPONSES
  addResponses('breathing', [
    ['intro', "Absolutely, let's do a breathing exercise together. I'll guide you through a 4-4-4 box breathing technique. This is really effective for calming your nervous system. Are you ready to begin?", 1, "Say 'ready' or 'yes' when you're in a comfortable position."],
    ['intro', "Of course! Breathing exercises are one of the fastest ways to calm your mind and body. Let's try a simple technique right now. Find a comfortable position and we'll start whenever you're ready.", 1, "Let me know when you're ready to start!"],
    ['intro', "I'm here for you. Let's use a proven breathing technique to help you find some calm. The 4-4-4 box breathing method works wonders. Take a seat somewhere comfortable first.", 1, "Ready to begin?"],
    ['step_1', "Great! Let's begin. Breathe IN slowly through your nose for 4 seconds... 1... 2... 3... 4. Good job! Now we'll move to the next step.", 0, null],
    ['step_1', "Okay, starting now. Breathe IN deeply through your nose for 4 counts. Feel your chest and belly rise as you breathe in... 1... 2... 3... 4. Excellent!", 0, null],
    ['step_2', "Now HOLD your breath gently for 4 seconds... 1... 2... 3... 4. Don't strain — just a gentle, comfortable hold. You're doing great!", 0, null],
    ['step_2', "Hold that breath now, nice and easy, for 4 counts... 1... 2... 3... 4. Keep your shoulders relaxed. Well done!", 0, null],
    ['step_3', "Now breathe OUT slowly through your mouth for 4 seconds... 1... 2... 3... 4. Let all that tension go as you exhale. Feel your body softening.", 0, null],
    ['step_3', "Breathe OUT now, slowly releasing all the air through your mouth for 4 counts... 1... 2... 3... 4. Let go of any tension you're holding.", 0, null],
    ['step_4', "Wonderful! That's one full cycle. How are you feeling? We recommend doing this 4 to 5 times for the best effect. Would you like to do another round?", 1, "Type 'yes' to continue or 'done' if you're feeling better."],
    ['step_4', "That's one complete breath cycle. You're doing so well! Would you like to continue for a few more rounds? Most people feel noticeably calmer after 4 or 5 cycles.", 1, "Continue for another round?"],
    ['complete', "You've completed the breathing exercise. I hope you're feeling a little calmer and more at ease. Remember, you can do this anytime you feel stressed, anxious, or overwhelmed. How are you feeling now?", 0, null],
    ['complete', "Well done for completing the exercise! Breathing techniques like this one are a powerful tool you can use anywhere, anytime. Your nervous system thanks you. How do you feel right now?", 0, null],
    ['general', "Taking a moment to focus on your breathing is always a good idea. Even just three slow, deep breaths can help shift your state of mind. Give it a try right now — breathe in slowly... and out.", 0, null],
  ]);

  // SLEEP RESPONSES
  addResponses('sleep', [
    ['screen_time', "One of the most impactful things you can do for better sleep is to put your phone and other screens away at least 30 to 60 minutes before bedtime. The blue light from screens tells your brain it's still daytime, making it much harder to fall asleep.", 0, null],
    ['screen_time', "Try switching your phone to night mode or using blue-light blocking glasses in the evening. Even better — try reading a physical book or doing light stretching instead of scrolling before bed. Your sleep quality will improve noticeably.", 0, null],
    ['caffeine', "Caffeine has a half-life of about 5 to 6 hours, which means if you drink coffee at 4pm, half of that caffeine is still in your system at 10pm. Try to avoid coffee, energy drinks, and even green tea after 2pm for noticeably better sleep.", 0, null],
    ['caffeine', "Switching to herbal teas like chamomile or peppermint in the evenings can really help you wind down. These have natural calming properties and won't interfere with your sleep the way caffeine does.", 0, null],
    ['schedule', "Going to bed and waking up at the same time every day — even on weekends — is one of the most powerful things you can do for your sleep. Your body has an internal clock, and consistency helps it work properly.", 0, null],
    ['schedule', "Try setting a regular bedtime alarm as well as a wake-up alarm. Aim for 7 to 9 hours of sleep if you're between 18 and 30 years old. Consistency is more important than duration.", 0, null],
    ['relaxation', "Creating a wind-down routine about 30 to 45 minutes before bed can signal to your brain that it's time to sleep. Try light stretching, journaling, reading, or a warm shower. Avoid anything stimulating like intense exercise or heated conversations.", 0, null],
    ['relaxation', "A warm bath or shower about an hour before bed can actually help you fall asleep faster. It raises your body temperature temporarily, and when it drops again afterward, it signals to your body that it's time to sleep.", 0, null],
    ['environment', "Your bedroom environment matters more than you might think. Keep your room cool, dark, and quiet. The ideal sleep temperature is around 18 to 20 degrees Celsius. Even small changes to your environment can make a big difference.", 0, null],
    ['environment', "Consider using blackout curtains or a white noise app if light or sound is disrupting your sleep. Your bedroom should feel like a calm, safe sanctuary that your brain associates only with rest.", 0, null],
    [null, "I'm sorry to hear you're having trouble sleeping. Sleep problems are really common but they don't have to be permanent. Here are a few things that might help: avoid screens before bed, keep a consistent sleep schedule, and try a relaxation routine. Which of these would you like to explore more?", 1, "Which sleep tip would you like to know more about?"],
    [null, "Sleep is so important for mental and physical health, so it's great that you're looking into this. The most common sleep issues come from stress, screen use, caffeine, and an inconsistent schedule. Let's see if we can figure out what might be affecting yours.", 1, "Do you know what might be causing your sleep issues?"],
    [null, "Good sleep hygiene is really about preparing your mind and body for rest throughout the day — not just at bedtime. Things like regular exercise, limiting caffeine, managing stress, and having a consistent routine all play a role.", 0, null],
    [null, "One thing many people find helpful is a 'worry dump' — writing down everything on your mind before bed so your brain doesn't keep cycling through it during the night. Try keeping a notebook by your bed for this purpose.", 0, null],
  ]);

  // PSYCHOEDUCATION RESPONSES
  addResponses('psychoeducation', [
    ['anxiety', "Anxiety is a natural emotional response that everyone experiences. It's that feeling of worry, nervousness, or unease about something with an uncertain outcome. At normal levels, anxiety is actually helpful — it keeps us alert and motivated. However, when it becomes excessive, persistent, or interferes with daily life, it may indicate an anxiety disorder.", 0, null],
    ['anxiety', "Common signs of anxiety include persistent worrying, feeling restless or on edge, having difficulty concentrating, physical symptoms like a racing heart or sweating, and avoiding situations that trigger fear. Anxiety disorders are among the most common mental health conditions and are very treatable with the right support.", 0, null],
    ['anxiety', "There are several types of anxiety disorders, including Generalized Anxiety Disorder (GAD), Social Anxiety Disorder, and Panic Disorder. Each has slightly different features, but all involve excessive fear or worry. If you think you might have an anxiety disorder, speaking to a mental health professional is a great first step.", 0, null],
    ['depression', "Depression is more than just feeling sad or going through a rough patch. It's a serious mental health condition that affects how you feel, think, and handle daily activities. Symptoms include persistent feelings of sadness or emptiness, loss of interest in activities you used to enjoy, fatigue, difficulty concentrating, and changes in sleep or appetite.", 0, null],
    ['depression', "Depression is incredibly common and affects hundreds of millions of people worldwide. The important thing to know is that it's not a sign of weakness, and it's not something you can simply 'snap out of.' Depression has biological, psychological, and social causes, and it responds well to professional treatment including therapy and sometimes medication.", 0, null],
    ['depression', "If you're experiencing symptoms of depression, I really encourage you to reach out to a mental health professional. In the meantime, things that can help include staying connected with supportive people, getting regular physical activity, maintaining a routine, and being gentle with yourself. You deserve support.", 0, null],
    ['stress', "Stress is your body's response to any demand or pressure placed on it. It can come from external sources like work, relationships, or finances, or internal sources like your own expectations and fears. Short-term stress is normal and even helpful, but chronic stress — stress that lasts for weeks or months — can seriously impact your physical and mental health.", 0, null],
    ['stress', "Common signs of chronic stress include feeling constantly overwhelmed or unable to relax, irritability or mood swings, physical symptoms like headaches or muscle tension, poor sleep, and difficulty concentrating. Managing stress effectively involves identifying your stressors, building healthy coping habits, and knowing when to ask for help.", 0, null],
    ['panic_attack', "A panic attack is a sudden surge of intense fear or discomfort that peaks within minutes. During a panic attack, you might experience a racing heart, shortness of breath, chest pain, dizziness, tingling sensations, or a feeling that something terrible is about to happen. It can be extremely frightening, but panic attacks themselves are not physically dangerous.", 0, null],
    ['panic_attack', "Panic attacks can happen seemingly out of nowhere, or they can be triggered by specific situations. While they feel overwhelming in the moment, they typically peak within 10 minutes and then subside. Learning breathing techniques and grounding exercises can really help you get through one more quickly.", 0, null],
    ['panic_attack', "If you experience panic attacks regularly, it's worth speaking to a doctor or therapist. Panic Disorder is very treatable. Cognitive Behavioral Therapy (CBT) in particular has an excellent success rate for panic disorder.", 0, null],
    [null, "Mental health refers to our emotional, psychological, and social wellbeing. It affects how we think, feel, and act in our daily lives, and it influences how we handle stress, relate to others, and make decisions. Just like physical health, mental health is something we need to actively take care of.", 0, null],
    [null, "One of the most important things to understand about mental health is that struggling is normal — it doesn't mean you're weak or broken. Millions of people experience mental health challenges every year, and with the right support, most people recover and go on to live fulfilling lives.", 0, null],
    [null, "There's unfortunately still a lot of stigma around mental health, but the truth is that mental health conditions are medical conditions. They have real biological and psychological causes and real, evidence-based treatments. Seeking help for your mental health is one of the bravest and most sensible things you can do.", 0, null],
  ]);

  // PROFESSIONAL HELP RESPONSES
  addResponses('professional_help', [
    [null, "It's really brave of you to consider reaching out for professional support — that's an important and positive step. A licensed therapist or counselor can offer personalized support that goes beyond what I'm able to provide. In Sri Lanka, you can contact the National Mental Health Helpline at 1926, or reach out to Sumithrayo at 011-2696666 for emotional support.", 0, null],
    [null, "Seeking professional help is a sign of strength, not weakness. A mental health professional can properly assess what you're going through and provide evidence-based treatment. Some options include individual therapy, group therapy, or speaking with a psychiatrist if medication might be helpful. You deserve proper care.", 0, null],
    [null, "If you're not sure where to start, your first step could be speaking to your regular doctor (general practitioner). They can assess your symptoms and refer you to the appropriate mental health specialist. Many people find this less intimidating than going directly to a psychiatrist or psychologist.", 0, null],
    [null, "There are also online therapy platforms that make professional support more accessible and affordable. These allow you to connect with licensed therapists via text, audio, or video — often at lower costs than in-person therapy. Accessibility should never be a barrier to getting the support you deserve.", 0, null],
    ['emergency', "If you're in a mental health crisis right now, please don't face it alone. In Sri Lanka, you can call the Sumithrayo helpline at 011-2696666 or the National Mental Health Helpline at 1926. These services are confidential and available to support you. Please reach out.", 0, null],
    ['emergency', "Your safety and wellbeing are the top priority. If you're having thoughts of hurting yourself or you're in crisis, please call emergency services or go to your nearest hospital emergency room. You can also call the Sri Lanka Sumithrayo support line at 011-2696666. Help is available.", 0, null],
  ]);

  // GREETING RESPONSES
  addResponses('greeting_smalltalk', [
    ['greeting', "Hello! I'm MindCare, your mental health and wellbeing support assistant. I'm really glad you're here. How are you feeling today?", 1, "How are you feeling today?"],
    ['greeting', "Hi there! Welcome to MindCare. I'm here to support your mental health and wellbeing journey. Whether you want to talk about how you're feeling, learn some relaxation techniques, or find helpful resources — I'm here for you. What can I help you with today?", 0, null],
    ['greeting', "Good to see you! I'm MindCare, and I'm here to support your emotional wellbeing. How are you doing today? Don't hesitate to share what's on your mind.", 1, "How are you doing today?"],
    ['greeting', "Hey! I'm glad you stopped by. I'm here whenever you need a little support or just want to check in on how you're feeling. How can I help you today?", 0, null],
    ['identity', "I'm MindCare, a voice-based mental health and wellbeing support assistant designed to help young adults like you. I can help you track your mood, guide you through breathing exercises, share tips for better sleep, provide information about mental health conditions, and connect you with professional resources when you need them.", 0, null],
    ['identity', "Great question! I'm MindCare — an AI-powered wellbeing assistant. I'm not a therapist or doctor, but I'm here to provide support, useful information, and helpful tools for your mental health journey. Think of me as a friendly first step toward better wellbeing.", 0, null],
    ['thanks', "You're very welcome! I'm really glad I could help. Remember, I'm always here whenever you need support. Take care of yourself!", 0, null],
    ['thanks', "It means a lot to hear that. Your wellbeing matters, and I'm happy to be here for you. Don't hesitate to come back anytime you need to talk.", 0, null],
    ['thanks', "Aww, that's kind of you! Keep checking in with yourself regularly — it really makes a difference. Take care!", 0, null],
    ['goodbye', "Take care of yourself! Remember, it's okay to not be okay sometimes — what matters is that you reach out when you need support. I'll be here whenever you come back. Goodbye!", 0, null],
    ['goodbye', "Goodbye for now! I hope our conversation today was helpful. Keep checking in with your feelings, and don't forget to be kind to yourself. See you next time!", 0, null],
    ['goodbye', "See you later! You've taken a positive step by checking in today. Keep up the good habits and remember — help is always here when you need it. Take good care!", 0, null],
  ]);

  const kwCount = dbAll<{ count: number }>('SELECT COUNT(*) as count FROM keywords');
  const respCount = dbAll<{ count: number }>('SELECT COUNT(*) as count FROM responses');

  console.log('✅ Database seeded successfully!');
  console.log(`   Categories: ${Object.keys(categories).length}`);
  console.log(`   Keywords:   ${kwCount[0]?.count ?? 0}`);
  console.log(`   Responses:  ${respCount[0]?.count ?? 0}`);
}

seed().catch(console.error);
