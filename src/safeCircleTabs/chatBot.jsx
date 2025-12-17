import React, { useState, useEffect, useRef } from 'react';
import './chat.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickButtons, setShowQuickButtons] = useState(true);
    const chatBodyRef = useRef(null);

    // Initialize with welcome message
    useEffect(() => {
        const welcomeMessage = {
            id: 1,
            text: "👋 Hello! I'm Tamara, your AI support companion. I'm here to provide guidance, information, and emotional support related to gender-based violence. Everything we discuss is completely anonymous and confidential.\n\nHow can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'welcome'
        };
        setMessages([welcomeMessage]);
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    // Tamara's response logic - Enhanced with diverse, specific responses
    const getTamaraResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        // Crisis detection keywords - PRIORITY 1
        const crisisKeywords = [
            'suicide', 'kill myself', 'end it all', 'hurt myself', 'cut myself',
            'emergency', 'danger', 'threat', 'kill me', 'die', 'death',
            'overdose', 'poison', 'hang myself', 'jump', 'crash'
        ];
        const hasCrisisKeywords = crisisKeywords.some(keyword => message.includes(keyword));

        if (hasCrisisKeywords) {
            return {
                text: "🚨 I'm really concerned about what you're sharing. If you're in immediate danger or thinking about harming yourself, please contact emergency services right now:\n\n• Kenya: Call 119 (Police) or 112 (Emergency)\n• GBV Hotline: 1195\n\nYou can also reach out to:\n• Befrienders Kenya: 0800 308 080 (24/7)\n\nI'm here to support you, but please get immediate professional help. Would you like me to help you find local resources?",
                type: 'crisis',
                showEmergency: true
            };
        }

        // Specific emotional states - More targeted responses
        if (message.includes('angry') || message.includes('mad') || message.includes('rage')) {
            return {
                text: "Anger is a completely valid response to injustice and harm. It's okay to feel angry about what happened to you. This anger can actually be a source of strength and motivation for change.\n\nSome healthy ways to manage anger:\n• Physical activity (walking, punching a pillow)\n• Deep breathing exercises\n• Journaling your feelings\n• Talking to a trusted friend\n\nWould you like to explore ways to channel this anger into positive action?",
                type: 'emotional_support',
                quickReplies: ['Manage anger', 'Channel into action', 'Talk about it']
            };
        }

        if (message.includes('guilty') || message.includes('blame') || message.includes('my fault')) {
            return {
                text: "You are NOT to blame for what happened. GBV is never the victim's fault. Abusers manipulate and control - that's on them, not you.\n\nCommon abuser tactics:\n• Making you feel responsible\n• Isolating you from support\n• Gaslighting (making you doubt your reality)\n\nRemember: You deserve safety, respect, and love. The abuse was a choice made by the perpetrator.\n\nWould you like to talk about these feelings or learn more about abuser tactics?",
                type: 'validation',
                quickReplies: ['Abuser tactics', 'Self-blame feelings', 'Build self-worth']
            };
        }

        if (message.includes('confused') || message.includes('understand') || message.includes('why me')) {
            return {
                text: "It's completely normal to feel confused after experiencing GBV. You might be asking 'Why me?' or wondering how this happened. The truth is, GBV happens because of the abuser's choices and behaviors, not because of anything you did.\n\nCommon questions survivors ask:\n• Why didn't I see the signs?\n• How could someone I trust do this?\n• Will I ever feel normal again?\n\nYou're not alone in these questions, and there are answers and support available.\n\nWhat aspect feels most confusing to you right now?",
                type: 'emotional_support',
                quickReplies: ['Why did this happen?', 'Signs I missed', 'Feeling normal again']
            };
        }

        // Relationship and abuse specific questions
        if (message.includes('leave') || message.includes('break up') || message.includes('end relationship')) {
            return {
                text: "Deciding to leave an abusive relationship is incredibly brave and shows great strength. Many survivors face this difficult choice.\n\nImportant considerations:\n• Your safety is the top priority\n• Have a safety plan in place\n• Consider financial independence\n• Build a support network first\n• Know that leaving is often the most dangerous time\n\nResources that can help:\n• Emergency shelter programs\n• Financial counseling\n• Legal aid for protection orders\n\nWould you like information about safety planning or local support services?",
                type: 'action_guidance',
                quickReplies: ['Safety planning', 'Emergency shelter', 'Financial help']
            };
        }

        if (message.includes('trust') || message.includes('betrayed') || message.includes('lied to')) {
            return {
                text: "Betrayal of trust, especially by someone close to you, can shatter your sense of safety in relationships. This is a deep wound that takes time to heal.\n\nRebuilding trust after GBV:\n• Start with trusting yourself\n• Surround yourself with safe people\n• Take relationships at your own pace\n• Professional counseling can help\n\nRemember: Not everyone will betray you. There are trustworthy people who will respect and support you.\n\nWould you like to talk about rebuilding trust or finding safe relationships?",
                type: 'healing',
                quickReplies: ['Rebuild trust', 'Find safe people', 'Therapy options']
            };
        }

        // Physical and sexual violence specific
        if (message.includes('hit') || message.includes('beat') || message.includes('physical') || message.includes('punch')) {
            return {
                text: "Physical violence is never acceptable and is a serious crime. Your body and safety deserve to be protected.\n\nIf you've experienced physical abuse:\n• Get medical attention for any injuries\n• Document everything (photos, medical reports)\n• Consider a Protection Order\n• Tell trusted people about what happened\n\nPhysical abuse often escalates, so early intervention is crucial.\n\nAre you currently safe? Would you like information about medical care or legal protection?",
                type: 'action_guidance',
                quickReplies: ['Medical care', 'Legal protection', 'Current safety']
            };
        }

        if (message.includes('rape') || message.includes('sexual assault') || message.includes('forced') || message.includes('sex against will')) {
            return {
                text: "Sexual violence is a traumatic crime that is never your fault. Survivors of sexual assault often experience a range of emotions and physical reactions.\n\nImmediate steps if you've been sexually assaulted:\n• Get medical care (even if no physical injuries)\n• Preserve evidence (don't shower, change clothes)\n• Contact a Sexual Assault Response Team\n• Talk to someone you trust\n\nRemember: You have the right to be believed and supported.\n\nWould you like information about sexual assault care or local support services?",
                type: 'action_guidance',
                quickReplies: ['Medical care', 'Evidence preservation', 'Support services']
            };
        }

        // Mental health and trauma
        if (message.includes('nightmare') || message.includes('flashback') || message.includes('trauma') || message.includes('ptsd')) {
            return {
                text: "Flashbacks, nightmares, and trauma symptoms are common after GBV and are your body's natural response to threat. These reactions don't mean you're 'weak' - they show you survived something traumatic.\n\nManaging trauma symptoms:\n• Grounding techniques (5-4-3-2-1 exercise)\n• Professional trauma therapy\n• Support groups for survivors\n• Self-care and patience\n\nPTSD and trauma responses are treatable, and many survivors recover fully.\n\nWould you like grounding techniques or information about trauma therapy?",
                type: 'healing',
                quickReplies: ['Grounding techniques', 'Trauma therapy', 'Support groups']
            };
        }

        if (message.includes('anxious') || message.includes('anxiety') || message.includes('panic') || message.includes('worry')) {
            return {
                text: "Anxiety after GBV is very common - your nervous system is still in 'survival mode.' This is a normal response that can be managed.\n\nAnxiety management techniques:\n• Deep breathing: 4 counts in, hold 4, out 4\n• Progressive muscle relaxation\n• Staying present in the moment\n• Regular exercise and sleep\n• Professional counseling\n\nYou're not 'crazy' for feeling anxious - you're healing from trauma.\n\nWould you like breathing exercises or anxiety management tips?",
                type: 'emotional_support',
                quickReplies: ['Breathing exercises', 'Anxiety tips', 'Professional help']
            };
        }

        // Support seeking and resources
        if (message.includes('counseling') || message.includes('therapy') || message.includes('therapist') || message.includes('psychologist')) {
            return {
                text: "Seeking counseling after GBV is a powerful step toward healing. A good therapist can provide:\n\n• Safe space to process trauma\n• Tools to manage symptoms\n• Support for rebuilding self-worth\n• Guidance through relationship decisions\n\nFinding the right therapist:\n• Look for trauma-informed care\n• Consider GBV specialization\n• Check credentials and experience\n• Trust your instincts about fit\n\nLocal resources in Kenya:\n• COFEM counseling services\n• Nairobi Women's Hospital\n• Private practitioners specializing in trauma\n\nWould you like help finding a therapist or more about what to expect in counseling?",
                type: 'resource_referral',
                quickReplies: ['Find therapist', 'What to expect', 'Local resources']
            };
        }

        if (message.includes('support group') || message.includes('group therapy') || message.includes('others like me')) {
            return {
                text: "Connecting with other survivors can be incredibly healing. Support groups provide:\n\n• Realization that you're not alone\n• Shared experiences and coping strategies\n• Hope and inspiration from others' recovery\n• Safe community of understanding people\n\nTypes of support groups:\n• In-person groups (COFEM, RCK)\n• Online communities (moderated and safe)\n• Specialized groups (sexual assault, domestic violence)\n• Cultural or language-specific groups\n\nMany survivors find support groups to be life-changing.\n\nWould you like information about local support groups or online communities?",
                type: 'resource_referral',
                quickReplies: ['Local groups', 'Online communities', 'Specialized groups']
            };
        }

        // Legal and justice questions
        if (message.includes('court') || message.includes('legal') || message.includes('lawyer') || message.includes('justice')) {
            return {
                text: "Pursuing justice after GBV is a personal choice that many survivors make. Legal options in Kenya include:\n\n• Criminal prosecution of the abuser\n• Protection orders (restraining orders)\n• Civil lawsuits for damages\n• Family court for custody/protection\n\nLegal support services:\n• Legal Aid Centre\n• Federation of Women Lawyers (FIDA)\n• Gender Violence Recovery Centre\n• Private attorneys specializing in GBV\n\nRemember: The legal process can be re-traumatizing, so having support is crucial.\n\nWould you like information about legal aid services or the court process?",
                type: 'resource_referral',
                quickReplies: ['Legal aid', 'Court process', 'Protection orders']
            };
        }

        // Self-care and daily life
        if (message.includes('sleep') || message.includes('insomnia') || message.includes('can\'t sleep')) {
            return {
                text: "Sleep difficulties are very common after trauma. Your body is staying alert for danger, even when you're safe now.\n\nImproving sleep after GBV:\n• Create a safe sleep environment\n• Establish a calming bedtime routine\n• Avoid screens before bed\n• Try relaxation techniques\n• Consider professional help if persistent\n\nMany survivors find their sleep improves with time and support.\n\nWould you like relaxation techniques for bedtime or tips for creating a safe sleep space?",
                type: 'healing',
                quickReplies: ['Bedtime routine', 'Relaxation techniques', 'Safe sleep space']
            };
        }

        if (message.includes('work') || message.includes('job') || message.includes('school') || message.includes('study')) {
            return {
                text: "Returning to work or school after GBV can feel overwhelming. Many survivors face this challenge and successfully navigate it.\n\nTips for work/school after trauma:\n• Be patient with yourself\n• Communicate with supervisors/teachers\n• Take breaks when needed\n• Build a support network\n• Consider accommodations if needed\n\nYour education and career are still important and achievable.\n\nWould you like strategies for returning to work/school or information about accommodations?",
                type: 'practical_support',
                quickReplies: ['Return strategies', 'Accommodations', 'Build support']
            };
        }

        // Family and friends reactions
        if (message.includes('family') || message.includes('friends') || message.includes('told someone') || message.includes('reaction')) {
            return {
                text: "Telling family and friends about GBV can bring a range of reactions - from supportive to questioning. Each person's response is about their own journey, not your experience.\n\nCommon reactions you might encounter:\n• Support and belief (what you deserve)\n• Questions or doubt (may need education)\n• Anger toward the abuser (normal)\n• Distance or rejection (their issue, not yours)\n\nRemember: You deserve support, and the right people will provide it.\n\nHow have people reacted when you've shared your experience?",
                type: 'emotional_support',
                quickReplies: ['Supportive reactions', 'Questioning reactions', 'Unsupportive reactions']
            };
        }

        // Prevention and education
        if (message.includes('prevent') || message.includes('stop this') || message.includes('help others')) {
            return {
                text: "Many survivors channel their experience into helping others and preventing GBV. This can be incredibly empowering.\n\nWays to help prevent GBV:\n• Educate others about consent and healthy relationships\n• Support anti-violence organizations\n• Volunteer with prevention programs\n• Share your story (when ready)\n• Advocate for policy changes\n\nYour experience gives you unique insight to help others.\n\nWould you like information about advocacy opportunities or prevention programs?",
                type: 'empowerment',
                quickReplies: ['Advocacy opportunities', 'Prevention programs', 'Share story safely']
            };
        }

        // Quick reply specific responses
        if (message.includes('relationship issues') || message.includes('relationship')) {
            return {
                text: "Relationships can be complex, especially when dealing with GBV concerns. Whether you're experiencing abuse in a relationship, questioning if something is healthy, or recovering from a toxic relationship, you're not alone.\n\nHealthy relationships are built on:\n• Mutual respect and trust\n• Equal power dynamics\n• Open communication\n• Freedom from fear or control\n\nIf you're in an abusive relationship, remember that abuse is never your fault, and you deserve safety.\n\nWhat specific concerns do you have about your relationship?",
                type: 'relationship_support',
                quickReplies: ['Signs of abuse', 'Leaving safely', 'Building healthy relationships']
            };
        }

        if (message.includes('feeling unsafe') || message.includes('unsafe')) {
            return {
                text: "Feeling unsafe is a serious concern that needs immediate attention. Your safety is the top priority.\n\nIf you're currently in danger:\n• Call emergency services (112 or 119 in Kenya)\n• Go to a safe place (police station, hospital, trusted friend)\n• Have a safety plan ready\n\nFor ongoing safety concerns:\n• Identify safe people and places\n• Change routines if needed\n• Consider a Protection Order\n• Use safety apps if available\n\nWould you like help creating a safety plan or information about local safe houses?",
                type: 'safety',
                quickReplies: ['Create safety plan', 'Emergency contacts', 'Safe housing']
            };
        }

        if (message.includes('emotional support') || message.includes('need emotional support')) {
            return {
                text: "Emotional support is crucial during difficult times. I'm here to listen and provide guidance.\n\nCommon emotions after GBV:\n• Fear and anxiety\n• Anger and confusion\n• Sadness and grief\n• Shame and self-doubt\n\nAll these feelings are valid and normal responses to trauma.\n\nWays to care for your emotional well-being:\n• Talk to trusted people\n• Practice self-compassion\n• Engage in calming activities\n• Seek professional counseling\n\nWhat emotions are you experiencing right now?",
                type: 'emotional_support',
                quickReplies: ['Feeling anxious', 'Feeling sad', 'Feeling angry', 'Need coping strategies']
            };
        }

        if (message.includes('need information') || message.includes('what is gbv') || message.includes('about gbv')) {
            return {
                text: "Gender-Based Violence (GBV) refers to any harmful act directed at an individual or group based on their gender. It includes physical, sexual, emotional, and economic abuse.\n\nTypes of GBV:\n• Physical violence (hitting, pushing)\n• Sexual violence (rape, harassment)\n• Emotional abuse (insults, isolation)\n• Economic abuse (controlling money)\n• Digital abuse (online harassment)\n\nGBV affects people of all genders, but women and girls are disproportionately impacted.\n\nIn Kenya, GBV is addressed by:\n• The Sexual Offences Act\n• Protection Against Domestic Violence Act\n• GBV helplines and centers\n\nWould you like to learn about specific types of GBV or available support services?",
                type: 'education',
                quickReplies: ['Types of GBV', 'Legal protections', 'Support services']
            };
        }

        if (message.includes('how to get help') || message.includes('get help')) {
            return {
                text: "Getting help is a brave and important step. There are many resources available in Kenya for GBV support.\n\nImmediate help:\n• Emergency: 112 or 119\n• GBV Hotline: 1195\n• Befrienders Kenya: 0800 308 080\n\nSupport organizations:\n• Coalition on Violence Against Women (COVAW)\n• Gender Violence Recovery Centre (GVRC)\n• International Justice Mission (IJM)\n• Local police gender desks\n\nCounseling services:\n• COFEM Foundation\n• Nairobi Women's Hospital\n• Private therapists\n\nWould you like contact information for specific services or help finding a counselor?",
                type: 'resource_referral',
                quickReplies: ['Emergency contacts', 'Counseling services', 'Legal aid']
            };
        }

        if (message.includes('learn about consent') || message.includes('consent')) {
            return {
                text: "Consent is a clear, enthusiastic 'yes' to sexual activity. It's about mutual respect and communication.\n\nKey principles of consent:\n• Must be voluntary and ongoing\n• Can be withdrawn at any time\n• Requires capacity to consent\n• Applies to all sexual activities\n\nHealthy consent involves:\n• Asking and checking in\n• Respecting boundaries\n• Communicating clearly\n• Understanding non-verbal cues\n\nConsent cannot be given if someone is:\n• Intoxicated or under influence\n• Asleep or unconscious\n• Under age or coercion\n\nWould you like to learn about healthy relationships or boundaries?",
                type: 'education',
                quickReplies: ['Healthy relationships', 'Setting boundaries', 'Communication tips']
            };
        }

        if (message.includes('share my story') || message.includes('share story anonymously')) {
            return {
                text: "Sharing your story can be healing and help others. You can do this safely and anonymously.\n\nSafe ways to share:\n• Through support groups\n• With trusted counselors\n• Online platforms (anonymously)\n• Advocacy organizations\n\nBenefits of sharing:\n• Reduces isolation\n• Helps process trauma\n• Educates others\n• Contributes to change\n\nRemember: Your story is powerful, and you control how and when to share it.\n\nWould you like information about anonymous sharing options or support for sharing your story?",
                type: 'empowerment',
                quickReplies: ['Anonymous sharing', 'Support groups', 'Writing my story']
            };
        }

        // Default response - More engaging and specific
        const defaultResponses = [
            {
                text: "Thank you for reaching out. I can hear that you're dealing with something important. Could you share a bit more about what's been happening? I'm here to listen and help in whatever way I can.",
                quickReplies: ['Relationship issues', 'Feeling unsafe', 'Emotional support', 'Need information']
            },
            {
                text: "I appreciate you trusting me with your thoughts. Every person's experience with GBV is unique, and there's no 'right' way to feel or respond. What would be most helpful for you right now - talking through your feelings, getting information, or finding resources?",
                quickReplies: ['Talk through feelings', 'Get information', 'Find resources', 'Just listen']
            },
            {
                text: "Your courage in reaching out is commendable. Whether you're looking for emotional support, practical advice, or just someone to listen, I'm here for you. What's on your mind today?",
                quickReplies: ['Emotional support', 'Practical advice', 'Listen to me', 'GBV information']
            }
        ];

        const randomDefault = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

        return {
            text: randomDefault.text,
            type: 'empathetic',
            quickReplies: randomDefault.quickReplies
        };
    };

    const handleSendMessage = async (messageText = inputValue) => {
        if (!messageText.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            timestamp: new Date(),
            type: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);
        setShowQuickButtons(false);

        // Simulate typing delay
        setTimeout(() => {
            const tamaraResponse = getTamaraResponse(messageText);
            const botMessage = {
                id: Date.now() + 1,
                text: tamaraResponse.text,
                sender: 'bot',
                timestamp: new Date(),
                type: tamaraResponse.type,
                quickReplies: tamaraResponse.quickReplies,
                showEmergency: tamaraResponse.showEmergency
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
    };

    const handleQuickReply = (reply) => {
        setInputValue(reply);
        handleSendMessage(reply);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <section className="chatWrapper">
            <div className="chat-container">
                <div className="chat-header">
                    <div className="tamara-info">
                        <span className="tamara-name">🤖 Tamara</span>
                        <span className="tamara-status">AI Support Companion</span>
                    </div>
                    <div className="privacy-badge">
                        🔒 Anonymous & Confidential
                    </div>
                </div>

                <div className="chat-body" ref={chatBodyRef}>
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            <div className="message-content">
                                {message.text.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                            <div className="message-time">
                                {formatTime(message.timestamp)}
                            </div>

                            {message.quickReplies && (
                                <div className="quick-replies">
                                    {message.quickReplies.map((reply, index) => (
                                        <button
                                            key={index}
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply(reply)}
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {message.showEmergency && (
                                <div className="emergency-resources">
                                    <div className="emergency-header">
                                        🚨 Immediate Help Available 24/7
                                    </div>
                                    <div className="emergency-contacts">
                                        <div className="contact-item">
                                            <strong>Emergency:</strong> 112 or 119
                                        </div>
                                        <div className="contact-item">
                                            <strong>GBV Hotline:</strong> 1195
                                        </div>
                                        <div className="contact-item">
                                            <strong>Befrienders:</strong> 0800 308 080
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message bot typing">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    {showQuickButtons && messages.length === 1 && (
                        <div className="quick-start-buttons">
                            <p>What would you like to talk about?</p>
                            <div className="quick-buttons-grid">
                                <button onClick={() => handleQuickReply("I'm feeling unsafe")}>
                                    😟 Feeling Unsafe
                                </button>
                                <button onClick={() => handleQuickReply("What is GBV?")}>
                                    ❓ About GBV
                                </button>
                                <button onClick={() => handleQuickReply("I need emotional support")}>
                                    💙 Emotional Support
                                </button>
                                <button onClick={() => handleQuickReply("How to get help")}>
                                    🆘 Get Help
                                </button>
                                <button onClick={() => handleQuickReply("Learn about consent")}>
                                    🤝 Consent & Relationships
                                </button>
                                <button onClick={() => handleQuickReply("Share my story anonymously")}>
                                    📖 Share Story
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (everything is anonymous)"
                        disabled={isTyping}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        className="send-btn"
                    >
                        ➤
                    </button>
                </div>

                <div className="chat-footer">
                    <div className="disclaimer">
                        <small>
                            💙 Tamara is here to support and inform, but not a replacement for professional help.
                            For emergencies, contact local authorities immediately.
                        </small>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatBot;
