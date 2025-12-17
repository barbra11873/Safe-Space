import React, { useState } from 'react'
import './myths.css'
import SafeSpaceHeader from './SafeSpaceHeader'
import SafeSpaceFooter from './SafeSpaceFooter'
import heroImage from './assets/images/mythsheroimage.svg'
import heroImage2 from './assets/images/myhtsheroomage2.jpg'

const Myths = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            messageType: 'bot',
            content: 'Hi! How can I help you? 😊',
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const getBotResponse = (userQuestion) => {
        const question = userQuestion.toLowerCase().trim();
        console.log('User asked:', question);

        // Database of common myths and facts with keywords and responses
        const mythFactDatabase = [
            {
                type: 'myth',
                keywords: ['only women', 'women only', 'female', 'girls only', 'ladies only', 'just women', 'affect women', 'women issue'],
                myth: 'Domestic violence only affects women.',
                fact: 'Domestic violence affects people of ALL genders.',
                content: 'That\'s a common misconception! Domestic violence doesn\'t discriminate by gender. Men, women, and even children can be victims. In fact, studies show that about 1 in 4 women and 1 in 9 men experience severe intimate partner violence. The important thing is that NO ONE deserves to be abused, regardless of gender.'
            },
            {
                type: 'myth',
                keywords: ['provoke', 'deserve', 'asking for it', 'victim fault', 'victim\'s fault', 'cause it', 'bring it on', 'deserve abuse'],
                myth: 'Victims of domestic violence provoke their abusers or deserve what happens.',
                fact: 'No one deserves to be abused. Violence is ALWAYS the abuser\'s choice.',
                content: 'This is completely untrue and harmful. Victims NEVER "ask for" or deserve abuse. Abusers make conscious choices to be violent, and they are 100% responsible for their actions. Blaming victims only makes it harder for them to seek help and breaks the cycle of violence.'
            },
            {
                type: 'myth',
                keywords: ['family matter', 'private', 'keep private', 'stay out', 'not our business', 'internal affair', 'private matter'],
                myth: 'Domestic violence is a private family matter.',
                fact: 'Domestic violence is a CRIME that affects communities.',
                content: 'I hear this a lot, but it\'s not true at all! Domestic violence isn\'t just a "family issue" - it\'s a serious crime that can result in arrest and prosecution. It affects everyone around the victim - neighbors, coworkers, children. Speaking up safely can actually save lives and help break the cycle.'
            },
            {
                type: 'myth',
                keywords: ['easily leave', 'just leave', 'walk away', 'simple to leave', 'why don\'t they leave', 'easy to leave'],
                myth: 'Victims can easily leave abusive relationships.',
                fact: 'Leaving abuse is complex, dangerous, and requires planning.',
                content: 'This is such a dangerous myth! Leaving an abusive relationship is often the MOST dangerous time for victims. Abusers may become more violent when they feel like they\'re losing control. Victims need safety plans, resources, and support - it\'s not as simple as "just walking away."'
            },
            {
                type: 'myth',
                keywords: ['poor people', 'uneducated', 'low class', 'certain people', 'specific groups', 'only certain', 'rich people'],
                myth: 'Only poor or uneducated people experience domestic violence.',
                fact: 'Domestic violence occurs across ALL socioeconomic levels.',
                content: 'Not at all! Domestic violence happens in every community, every income level, every education level. It affects people from all walks of life - doctors, lawyers, teachers, CEOs - you name it. Abuse doesn\'t care about your job title, bank account, or education level.'
            },
            {
                type: 'myth',
                keywords: ['children not affected', 'kids okay', 'children safe', 'don\'t see', 'not involved', 'children unaffected'],
                myth: 'Children are not affected by domestic violence in their home.',
                fact: 'Children who witness domestic violence suffer severe trauma.',
                content: 'This couldn\'t be further from the truth! Children who grow up witnessing domestic violence are at much higher risk for anxiety, depression, behavioral problems, and even becoming abusers or victims themselves as adults. They absolutely need support and protection.'
            },
            {
                type: 'fact',
                keywords: ['all genders', 'men too', 'men victims', 'male victims', 'boys affected', 'lgbtq', 'transgender'],
                myth: 'Domestic violence only affects women.',
                fact: 'Domestic violence affects people of ALL genders.',
                content: 'You\'re absolutely right! While women are disproportionately affected, men, transgender individuals, and children can definitely be victims too. Male victims often face extra challenges because of societal stigma and fewer resources available to them.'
            },
            {
                type: 'fact',
                keywords: ['abuser choice', 'abuser responsible', 'not victim fault', 'never deserved', 'not deserved', 'abuser fault'],
                myth: 'Victims are responsible for the abuse they experience.',
                fact: 'Abusers are 100% responsible for their violent behavior.',
                content: 'Exactly! This is so important to understand. Abusers make deliberate choices to be violent and controlling. Victims are never responsible for someone else\'s abusive behavior, no matter what the circumstances are. Full stop.'
            },
            {
                type: 'fact',
                keywords: ['crime', 'illegal', 'against law', 'criminal', 'felony', 'arrest', 'prosecute'],
                myth: 'Domestic violence is just a personal issue.',
                fact: 'Domestic violence is a serious crime.',
                content: 'You\'re spot on! Domestic violence isn\'t just a "fight" or "personal matter" - it\'s a crime that can result in arrest and prosecution. Many places have specific laws and dedicated police units to handle domestic violence cases.'
            }
        ];

        // Check if question matches any known myth or fact
        for (const item of mythFactDatabase) {
            const matchesKeyword = item.keywords.some(keyword =>
                question.includes(keyword)
            );

            if (matchesKeyword) {
                return {
                    type: item.type,
                    myth: item.myth,
                    fact: item.fact,
                    content: item.content
                };
            }
        }

        // Handle questions about specific scenarios
        if (question.includes('signs') || question.includes('symptoms') || question.includes('warning') || question.includes('recognize')) {
            return {
                type: 'general',
                content: 'Great question! Common signs of domestic violence include: unexplained physical injuries, controlling behavior, isolation from friends/family, constant criticism, threats, extreme jealousy, and fear. If you notice these signs in yourself or others, please seek help immediately. You don\'t have to face this alone.'
            };
        }

        if (question.includes('help') || question.includes('support') || question.includes('resources') || question.includes('where to go')) {
            return {
                type: 'general',
                content: 'I\'m glad you\'re looking for help! If you or someone you know is in immediate danger, call emergency services right away. For support, contact local domestic violence hotlines, shelters, or organizations. In Kenya, you can reach out to the Gender Violence Recovery Centre (GVRC) or local police. Remember: You are not alone, and there are people ready to help you.'
            };
        }

        if (question.includes('report') || question.includes('police') || question.includes('legal') || question.includes('law')) {
            return {
                type: 'general',
                content: 'Reporting domestic violence is an important step toward safety. You can report to police - many have specialized domestic violence units trained to handle these cases. Keep records of incidents, take photos of injuries if safe to do so, and consider seeking a Protection Order. Law enforcement takes domestic violence seriously and can help protect you.'
            };
        }

        // Additional common questions
        if (question.includes('why') && (question.includes('stay') || question.includes('leave'))) {
            return {
                type: 'general',
                content: 'This is a complex question with many factors. Victims often stay because of fear of escalated violence, financial dependence, love for their partner, concern for children, lack of support systems, or because the abuse is cyclical (periods of abuse followed by "honeymoon" phases). Every situation is unique, and leaving requires careful safety planning.'
            };
        }

        if (question.includes('cycle') || question.includes('pattern')) {
            return {
                type: 'general',
                content: 'Domestic violence often follows a predictable cycle: 1) Tension building phase (arguments increase), 2) Acute battering incident (physical/emotional abuse), 3) Honeymoon phase (apology, promises to change), then it repeats. Understanding this cycle can help victims recognize the pattern and seek help before it escalates.'
            };
        }

        if (question.includes('emotional') || question.includes('mental') || question.includes('psychological')) {
            return {
                type: 'general',
                content: 'Emotional abuse is just as serious as physical abuse and includes: constant criticism, humiliation, isolation from loved ones, threats, gaslighting (making you doubt your reality), and controlling behavior. It can cause long-term damage to self-esteem and mental health. All forms of abuse are serious and require help.'
            };
        }

        if (question.includes('safe') || question.includes('safety') || question.includes('plan')) {
            return {
                type: 'general',
                content: 'Creating a safety plan is crucial! Key steps include: identifying safe places to go, keeping important documents ready, telling trusted friends/family about the abuse, having emergency money/phone, and knowing local resources. If you\'re in immediate danger, call emergency services right away.'
            };
        }

        // More specific question patterns
        if (question.includes('what is') && question.includes('domestic violence')) {
            return {
                type: 'general',
                content: 'Domestic violence is a pattern of abusive behavior used to gain or maintain power and control over an intimate partner. It can include physical violence, emotional abuse, sexual abuse, financial control, and isolation. It\'s not just physical - any behavior that makes you feel afraid, controlled, or intimidated is abuse.'
            };
        }

        if (question.includes('how to') && question.includes('help')) {
            return {
                type: 'general',
                content: 'If you want to help someone experiencing domestic violence: Listen without judgment, believe them, don\'t blame them, help them create a safety plan, offer specific help (like transportation or childcare), encourage professional help, and respect their decisions. Never confront the abuser yourself - it can be dangerous.'
            };
        }

        if (question.includes('statistics') || question.includes('how many') || question.includes('prevalent')) {
            return {
                type: 'general',
                content: 'Domestic violence affects millions worldwide. In the US, 1 in 4 women and 1 in 9 men experience severe intimate partner physical violence. In Kenya, studies show similar patterns with high rates of gender-based violence. It crosses all socioeconomic, racial, and cultural boundaries.'
            };
        }

        if (question.includes('types') || question.includes('forms') || question.includes('kinds')) {
            return {
                type: 'general',
                content: 'Domestic violence comes in many forms: Physical (hitting, pushing), Emotional (insults, threats), Sexual (unwanted sexual acts), Financial (controlling money), Digital (stalking via technology), and Spiritual (using religion to control). All forms are serious and harmful.'
            };
        }

        if (question.includes('my fault') || question.includes('am i') || question.includes('being abused')) {
            return {
                type: 'general',
                content: 'If you\'re asking this question, it\'s important to know: You are NEVER at fault for someone else\'s abusive behavior. Abuse is about power and control, not about you. If someone is making you feel afraid, controlled, or hurt, that\'s abuse. Please reach out for help - you deserve to be safe and respected.'
            };
        }

        if (question.includes('love') && question.includes('abuser')) {
            return {
                type: 'general',
                content: 'Many victims stay because they love their partner and hope they\'ll change. But love doesn\'t excuse abuse. Healthy relationships are built on respect, trust, and safety. If someone truly loves you, they won\'t hurt you. You deserve a relationship where you feel safe and valued.'
            };
        }

        if (question.includes('tell someone') || question.includes('confide') || question.includes('talk to')) {
            return {
                type: 'general',
                content: 'Talking about abuse can be scary but is often the first step to safety. Choose someone you trust who will believe you and support you. Consider telling a close friend, family member, counselor, or calling a hotline. You don\'t have to face this alone - there are people who want to help.'
            };
        }

        // Recovery and healing questions
        if ((question.includes('get over') || question.includes('recover') || question.includes('heal') || question.includes('move on') || question.includes('recovery')) &&
            (question.includes('abuse') || question.includes('violence') || question.includes('trauma') || question.includes('it'))) {
            return {
                type: 'general',
                content: 'Yes, absolutely! Healing from domestic violence is possible, though it\'s a journey that takes time and support. Many survivors go on to live full, healthy lives. The key is getting professional help - therapy, support groups, and self-care. Remember: The abuse was never your fault, and you deserve to heal and thrive. Every day you\'re moving forward is a victory.'
            };
        }

        if (question.includes('how long') && (question.includes('heal') || question.includes('recover') || question.includes('get over'))) {
            return {
                type: 'general',
                content: 'Healing time varies for everyone - some feel better in months, others take years. There\'s no "normal" timeline. What matters is that you\'re taking steps toward healing. Be patient with yourself, seek support, and celebrate small victories. Professional help can speed up the process significantly.'
            };
        }

        if (question.includes('therapy') || question.includes('counseling') || question.includes('therapist')) {
            return {
                type: 'general',
                content: 'Therapy is incredibly helpful for healing from domestic violence. Look for therapists experienced in trauma and abuse recovery. In Kenya, you can find help through organizations like Gender Violence Recovery Centre (GVRC), local hospitals, or mental health professionals. Many offer sliding-scale fees or free services.'
            };
        }

        if (question.includes('support group') || question.includes('group therapy')) {
            return {
                type: 'general',
                content: 'Support groups can be life-changing! Connecting with others who\'ve been through similar experiences reduces isolation and provides practical coping strategies. Look for domestic violence support groups through local organizations, women\'s shelters, or online communities. Sharing your story in a safe space is powerful.'
            };
        }

        if (question.includes('trust') && (question.includes('again') || question.includes('future') || question.includes('relationships'))) {
            return {
                type: 'general',
                content: 'Learning to trust again after abuse is completely possible, but it takes time. Start with trusting yourself and your instincts. Professional therapy can help rebuild trust in healthy ways. Remember that not everyone is abusive - you can have healthy, loving relationships again when you\'re ready.'
            };
        }

        if (question.includes('self esteem') || question.includes('confidence') || question.includes('worth')) {
            return {
                type: 'general',
                content: 'Abuse often damages self-esteem, but you can absolutely rebuild it! Start with small affirmations, surround yourself with supportive people, and consider therapy. Remember: Your worth was never diminished by the abuse. You are strong, valuable, and deserving of respect. Healing your self-worth is one of the most important steps in recovery.'
            };
        }

        if (question.includes('trigger') || question.includes('flashback') || question.includes('ptsd')) {
            return {
                type: 'general',
                content: 'Triggers and flashbacks are common after trauma and don\'t mean you\'re "not healing." They often decrease over time with proper support. Grounding techniques (deep breathing, mindfulness), therapy, and self-care help manage them. If they\'re severe, seek professional help - you don\'t have to suffer alone.'
            };
        }

        // Default response for unrecognized questions
        return {
            type: 'general',
            content: 'Thanks for your question about domestic violence! While I might not have a specific answer for this exact topic, I want you to know that domestic violence is never acceptable and help is always available. If you\'re experiencing abuse or know someone who is, please reach out to local support services or emergency services immediately. Your safety matters.'
        };
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now(),
            messageType: 'user',
            content: message.trim(),
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const response = getBotResponse(message.trim());
            const botMessage = {
                id: Date.now() + 1,
                messageType: 'bot',
                content: response.content,
                myth: response.myth,
                fact: response.fact,
                responseType: response.type,
                timestamp: new Date().toLocaleTimeString()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };
    const mythsData = [
        {
            id: 1,
            myth: "Domestic violence only happens to women.",
            fact: "Domestic violence affects people of all genders. Men, women, and children can all be victims of domestic abuse."
        },
        {
            id: 2,
            myth: "Victims of domestic violence provoke their abusers.",
            fact: "No one deserves to be abused. Violence is never the victim's fault - it's always the abuser's choice."
        },
        {
            id: 3,
            myth: "Domestic violence is just a 'family matter' that should be kept private.",
            fact: "Domestic violence is a crime and a serious public health issue. It affects communities and should be addressed openly."
        },
        {
            id: 4,
            myth: "Victims can easily leave abusive relationships.",
            fact: "Leaving an abusive relationship is complex and dangerous. Victims often need support, resources, and safety planning."
        },
        {
            id: 5,
            myth: "Only poor or uneducated people experience domestic violence.",
            fact: "Domestic violence occurs across all socioeconomic levels, education levels, and cultures. It doesn't discriminate."
        },
        {
            id: 6,
            myth: "Children aren't affected by domestic violence in their home.",
            fact: "Children who witness domestic violence are deeply affected and may experience long-term emotional and psychological trauma."
        }
    ];

    return (
        <main className="myths-wrapper">
            <SafeSpaceHeader bgColor='#36BB24'/>
            <section className="myths-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Myths & Facts</h1>
                    <h2 className="hero-subtitle">About Gender-Based Violence</h2>
                    <p className="hero-description">
                        Understanding the truth behind common misconceptions about domestic violence and abuse.
                    </p>
                </div>
                <div className="hero-images">
                    <img src={heroImage} alt="Myth busting illustration" className="hero-image left" />
                    <img src={heroImage2} alt="Awareness image" className="hero-image right" />
                </div>
            </section>

            <section className="myths-content">
                <div className="container">
                    <h2 className="section-title">Common Myths vs Reality</h2>
                    <div className="myths-grid">
                        {mythsData.map((item) => (
                            <div key={item.id} className="myth-fact-card">
                                <div className="myth-section">
                                    <div className="myth-header">
                                        <span className="myth-label">MYTH</span>
                                        <div className="myth-icon">❌</div>
                                    </div>
                                    <p className="myth-text">{item.myth}</p>
                                </div>
                                <div className="fact-section">
                                    <div className="fact-header">
                                        <span className="fact-label">FACT</span>
                                        <div className="fact-icon">✅</div>
                                    </div>
                                    <p className="fact-text">{item.fact}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Floating Chatbot Button */}
            <div className="chatbot-button" onClick={() => setIsChatOpen(true)}>
                <div className="chat-icon">💬</div>
                <div className="chat-tooltip">Ask about myths & facts</div>
            </div>

            {/* Chat Modal */}
            {isChatOpen && (
                <div className="chat-modal-overlay" onClick={() => setIsChatOpen(false)}>
                    <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="chat-header">
                            <h3>GBV Assistant</h3>
                            <button className="close-btn" onClick={() => setIsChatOpen(false)}>×</button>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message ${msg.messageType}`}>
                                    <div className="message-content">
                                        {msg.messageType === 'bot' && (
                                            <>
                                                {msg.myth && (
                                                    <div className="myth-statement">
                                                        <strong>❌ Myth:</strong> {msg.myth}
                                                    </div>
                                                )}
                                                {msg.fact && (
                                                    <div className="fact-statement">
                                                        <strong>✅ Fact:</strong> {msg.fact}
                                                    </div>
                                                )}
                                                {msg.responseType && (
                                                    <div className="response-badge">
                                                        {msg.responseType === 'myth' && '🔍 MYTH BUSTED'}
                                                        {msg.responseType === 'fact' && '✅ CONFIRMED FACT'}
                                                        {msg.responseType === 'general' && '💡 GENERAL INFO'}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <p className="message-text">{msg.content}</p>
                                        <span className="message-time">{msg.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message bot typing">
                                    <div className="message-content">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} className="chat-input-form">
                            <div className="input-container">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ask me about domestic violence myths and facts..."
                                    className="chat-input"
                                    disabled={isTyping}
                                />
                                <button
                                    type="submit"
                                    disabled={isTyping || !message.trim()}
                                    className="send-btn"
                                >
                                    {isTyping ? '...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <section className="help-section">
                <div className="container">
                    <h2 className="help-title">Need Help?</h2>
                    <p className="help-text">
                        If you or someone you know is experiencing domestic violence,
                        reach out for help. You are not alone.
                    </p>
                    <div className="help-resources">
                        <div className="resource-card">
                            <h3>Emergency Hotline</h3>
                            <p>Call emergency services if you're in immediate danger</p>
                            <span className="resource-number">911</span>
                        </div>
                        <div className="resource-card">
                            <h3>Support Services</h3>
                            <p>Access counseling, shelter, and legal assistance</p>
                            <span className="resource-link">Visit Get Help page</span>
                        </div>
                    </div>
                </div>
            </section>

            <SafeSpaceFooter/>
        </main>
    )
}

export default Myths
