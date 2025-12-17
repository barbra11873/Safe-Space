import React from 'react'
import './AboutGbv.css'
import SafeSpaceHeader from './SafeSpaceHeader'
import SafeSpaceFooter from './SafeSpaceFooter'
import HeroSection from './HeroSection'
import { Link } from 'react-router-dom'
import aboutGbvimage1 from './assets/images/aboutGbvSectionImage1.svg'
import aboutGbvimage2 from './assets/images/manaboutGbvimage2.png'
import aboutGbvimage3 from './assets/images/TypesofGbv.png'
import tick from './assets/images/checkmark.svg'
import darkCircle from './assets/images/Ellipse 4.png'
import aboutCardImage1 from './assets/images/aboutcardImage1.png'
import aboutCardImage2 from './assets/images/aboutcardImage2.png'
import aboutCardImage3 from './assets/images/aboutcardImage3.png'
import aboutCardImage4 from './assets/images/aboutcardImage4.png'
import AboutCard from './aboutCard'
import ImpactCardTEmplate from './ImpactCardTEmplate'
import imapctImage1 from './assets/images/woman-beating-man 2.png'
import imapctImage2 from './assets/images/Psychological 2.png'
import imapctImage4 from './assets/images/isolation1 2.png'
import imapctImage5 from './assets/images/economic 1.png'
import negletImage from './assets/images/neglectofmen1.png'
import imapctImage6 from './assets/images/impact1 2.png'

const AboutGbv = () => {
    return (
        <>
            <SafeSpaceHeader/>
            <section className="aboutPageSection definition">
                <div className="textBlock">
                    <h1 className="title">What Is Gbv?</h1>
                    <p className="text">
                        Gbv stands for Gender Based violence, which is any harmful 
                        act perpetrated against a person's wil based on their socially
                        ascribed gender roles, gender identity or gender expressions.
                    </p>
                    <p className="text">
                        It is rooted in structural power imbalances and affects people of all
                        genders, but women and girls are disproportionaley impacted.
                    </p>
                </div>
                <img src={aboutGbvimage1} alt="" className="sectionImage" />
            </section>
            <HeroSection
                title='Be Informed!!!'
                text='dont live under opression in chains because of ignorance, know your rights, understand what is GBV'
                btn={{buttonText:"Response & Prevention",handler:null,buttonLink:"/response-prevention"}}
            />
            <section className="aboutPageSection neglect">
                <img id="floatingCircle" src={darkCircle}/>
                <div className="top">
                    <div className="sectionImageContainer">
                        <img src={aboutGbvimage2} alt="" className="sectionImage" />
                    </div>
                    
                    <h1 className="title">Neglect of Male Victims of GBV</h1>
                </div>
                <div className="textContainer">
                    <p className="text">
                        In conversations about gender-based violece, the voices of men often
                        fade into silence unheard, unseen and unacknowledged. Society 
                        has long framed GBV as an issue affecting only women, leaving countless men suffering 
                        quietly in the shadows.
                    </p>
                    <p className="text">
                        Many endure physical abuse, emotional manipulationn, and sexual violence, yet
                        find no safe space to speak or seed help. Cultural 
                        expectations of masculinity discourage men from expressing pain or 
                        vulnerability, branding them as weak if they admit victimhood.
                    </p>
                    
                    <p className="text">
                        As a result, their trauma festers in isolation, buried beneath shame and disbelief. Shelters and support services rarely consider their needs, policies seldom mention them, and awareness campaigns often exclude their stories. This neglect is not just an oversight  it is a quiet tragedy that denies healing, compassion, and justice to half of humanity.
                    </p>
                    <p className="text">
                        <h3 className="title">
                            Underreporting: A Major Obstacle in Combating Gender-based violence
                        </h3>
                            One of the primary reasons male GBV receives less attention is severe underreporting. Studies have shown that GBV, in general, is vastly underreported, but the problem is even more pronounced for male victims.
                            Shame and stigma play a significant role; men may fear being perceived as weak or less masculine if they disclose their experiences. Societal expectations of masculinity often discourage them from admitting victimhood, which is seen as antithetical to traditional male roles.


                            Additionally, a lack of recognition compounds the problem. Many men struggle to identify certain behaviors particularly emotional or psychological abuse as GBV. Fear of disbelief further silences male survivors, especially when the perpetrator is female. In such cases, cultural narratives may invalidate their experiences, reinforcing the perception that men cannot be victims.


                            The limited availability of support services tailored for male victims adds another layer of complexity. When men don’t see resources designed to help them, they may feel their experiences are invalid or insignificant.
                    </p>
                    <p className="text">
                        <h3 className="title">
                            Overlooking Female Perpetrators of GBV
                        </h3>
                            
                        The societal framing of GBV often positions men as perpetrators and women as victims, which overlooks the reality that women can also commit acts of violence against men. 


                        Female-perpetrated gender-based violence, particularly in the form of emotional, psychological, or even physical abuse, is frequently dismissed or minimized. This oversight stems from deeply ingrained gender stereotypes. 


                        Women are often viewed as non-threatening or incapable of significant harm, which can make male victims feel invalidated when their abusers are female. 


                        Even within legal systems and support frameworks, male survivors reporting abuse by female perpetrators may struggle to be taken seriously.


                        Acknowledging female-perpetrated GBV is not about diminishing the seriousness of violence against women and girls but about recognizing that anyone regardless of gender can commit or fall victim to abuse. 


                        Expanding the lens through which gender-based violence is viewed is crucial for creating a fair and inclusive approach to combating it.
                    </p>
                    <p className="text">
                        <h3 className="title">
                            The Masculinity Narrative
                        </h3>
                        The societal construct of masculinity is a significant factor that contributes to the underreporting and lack of focus on male gender based violence. 


                        Traditional masculinity often emphasizes power, independence, and resilience traits that conflict with the vulnerability associated with victimhood. 


                        For male GBV survivors, admitting to being a victim can create an internal struggle, as it challenges the deeply ingrained belief that men should be able to handle their problems without help.


                        This "masculinity narrative" also discourages male survivors from seeking support, as they may perceive it as a failure to live up to societal expectations.
                    </p>
                    <p className='text'>
                        <img src={negletImage} alt="" />
                    </p>
                    <p className="text">
                        <h3 className="title">
                            Biased Research and Documentation of GBV Cases
                        </h3>
                        
                        Another obstacle to addressing male gender-based violence is the limited comprehensive research and awareness. Historically, much of the research on GBV has focused on female victims and male perpetrators, leading to a gap in understanding male victimization.


                        For instance, while there is extensive data on sexual violence against adolescent girls, similar statistics for boys are scarce. This gap in research reflects a historical bias that has focused predominantly on female victims and male perpetrators.


                        Public perception also plays a role. Many people, including policymakers and service providers, are unaware of the prevalence and impact of GBV on men. This lack of understanding contributes to gaps in policies and services designed to address the issue.
                    </p>
                    <p className="text">
                        <h3 className="title">
                            Policy and Service Gaps
                        </h3>
                        
                        The framing of GBV policies often inadvertently excludes male victims. For instance, in Kenya, national strategies addressing GBV frequently focus on violence against women and girls, as seen in initiatives like the National Policy on Prevention and Response to Gender-Based Violence. 


                        While these frameworks are critical for tackling the significant risks faced by women, they can unintentionally reinforce the perception that GBV is solely an issue of men's violence against women.


                        This policy framing influences the availability of services and the style of response for male victims. Shelters, counseling services, and hotlines for male survivors of GBV are often sparse or nonexistent especially in rural areas, reflecting a broader lack of public recognition of the issue. 


                        Consequently, many male survivors feel unsupported or invalidated, discouraging them from seeking help or reporting their experiences.
                    </p>
                    <p className="text">
                        <h3 className="title">
                            The Consequences of Silence in Gender Based Violence
                        </h3>
                        The impact of GBV on male survivors can be severe, affecting their physical health, mental well-being, and social relationships. 


                        Physical injuries, sexual dysfunction, and sexually transmitted infections are common among male survivors. Mentally, they may experience shame, guilt, anxiety, depression, PTSD, and even substance abuse.


                        Socially, male survivors often face ridicule or abandonment by family and friends. Economic consequences can also arise, as the trauma may interfere with their ability to work or maintain employment.


                        When men experience GBV whether in childhood, intimate relationships, or institutional settings they may internalize their victimization as a threat to their perceived masculinity. This loss of control or power can lead to efforts to reassert dominance, sometimes through violent means, including aggression toward women.


                        For example, men who have endured emotional or physical abuse may develop harmful coping mechanisms, such as channeling their unresolved anger or humiliation into controlling or violent behavior. 


                        In some cases, this dynamic escalates into fatal outcomes, particularly in relationships where men view women as property or extensions of their authority.
                    </p>
                </div>
            </section>
            <section className="aboutPageSection types">
                <div className="top">
                    <h1 className="title">
                        Gender-based violence includes a wide range of harmful behaviors and practices:
                    </h1>
                    <div className="sectionImage">
                        <img src={aboutGbvimage3} alt=""/>
                    </div>
                    
                </div>
                <ul>
                    <li>
                        <span className="title">
                            <img src={tick} alt="" className="check" />
                            <span>Physical violence:  </span>
                        </span>
                        <span className="description">
                            Any act causing physical harm, from minor assault to murder.
                        </span>
                    </li>
                    <li>
                        <span className="title">
                            <img src={tick} alt="" className="check" />
                            <span>socio-economic violence</span>
                        </span>
                        <span className="description">
                            Denying a person access to resources like education, healthcare, work, or financial resources. 
                        </span>
                    </li>
                    <li>
                        <span className="title">
                            <img src={tick} alt="" className="check" />
                            <span>Harmful practices</span>
                        </span>
                        <span className="description">
                            Traditional practices like female genital mutilation (FGM), child marriage, and forced marriage.    
                            </span>
                    </li>
                    <li>
                        <span className="title">
                            <img src={tick} alt="" className="check" />
                            <span>intimate patner  violence (IPV) </span>
                        </span>
                        <span className="description">
                            Any sexual act attempted or carried out without consent, including rape, harassment, and forced prostitution
                        </span>
                    </li>
                    <li>
                        <span className="title">
                            <img src={tick} alt="" className="check" />
                            <span>online violence </span>
                        </span>
                        <span className="description">
                            Violence by a current or former partner, including physical, sexual, psychological, and controlling behaviors.                        </span>
                    </li>
                </ul>
            </section>
            <section className="aboutPageSection causes">
                <h1 className="title">
                    causes of GBV
                </h1>
                <div className="cardsGridContainer">
                    <AboutCard
                        title='GEnder Inequality'
                        img={aboutCardImage1}
                        text='The unequal power dynamics between men and women are a main cause'
                        style={{maxWidth:"400px"}}
                    />
                    <AboutCard
                        title='harmful Social norms'
                        img={aboutCardImage2}
                        text='Traditions and beliefs that normalize violence against women, such as the idea of male superiority.'
                        style={{maxWidth:"400px"}}
                    />
                    <AboutCard
                        title='economic factors'
                        img={aboutCardImage3}
                        text=' Lack of financial resources can make individuals more vulnerable to violence.'
                        style={{maxWidth:"400px"}}
                    />
                    <AboutCard
                        title='How does it manifest?'
                        img={aboutCardImage4}
                        text=' Lack of financial resources can make individuals more vulnerable to violence.'
                        style={{maxWidth:"400px"}}
                    />
                </div>
            </section>
            <section className="aboutPageSection victims">
                <div className="top">
                    <div className="colour-wrapper">
                        <h1 className="title">
                        who is affected by GBV?
                    </h1>
                    </div>
                    
                </div>
                <div className="main">
                    <h3 className="title">
                        Anyone can experience GBV, but certain groups are at higher risk:
                    </h3>
                    <ul>
                        <li>
                            <img src={tick} alt="" className="check" />
                            <span> Women and girls, who are affected disproportionately.</span>
                        </li>
                        <li>
                            <img src={tick} alt="" className="check" />
                            <span> People who identify as LGBTQ+.</span>
                        </li>
                        <li>
                            <img src={tick} alt="" className="check" />
                            <span>People with disabilities.</span>
                        </li>
                        <li>
                            <img src={tick} alt="" className="check" />
                            <span>Refugees and migrants.</span>
                        </li>
                        <li>
                            <img src={tick} alt="" className="check" />
                            <span>People living in poverty or in crisis settins like conflict zones.</span>
                        </li>
                    </ul>
                </div>
            </section>
            <section className="aboutPageSection impact">
                <h1 className="title">
                    Impact of GBV
                </h1>
                <h4 className="subTitle">
                    GBV has severe and long-lasting consequences for survivors,
                    their families, and society:
                </h4>
                <div className="impactCardsContainer">
                    <ImpactCardTEmplate
                        title="Physical effects" 
                        text=' Injuries, chronic pain, disability, unwanted pregnancy, and sexually transmitted infections (including HIV).'
                        image={imapctImage1}
                    />
                    <ImpactCardTEmplate
                        title="psychological effects" 
                        text=' Post-traumatic stress disorder (PTSD), anxiety, depression, and suicide.'
                        image={imapctImage2}
                    />
                    <ImpactCardTEmplate
                        title="social" 
                        text=' Stigma, isolation, and disruption of social ties.'
                        image={imapctImage4}
                    />
                    <ImpactCardTEmplate
                        title="economic effects" 
                        text='Loss of income, limited access to education and work, and lasting poverty..'
                        image={imapctImage5}
                    />
                    <ImpactCardTEmplate
                        title="international impact" 
                        text='The cycle of violence can continue through generations as children who witness violence are more likely to experience or perpetrate it as adults. '
                        image={imapctImage6}
                    />
                </div>
            </section>
            
            <section className="aboutPageSection" style={{textAlign: 'center', padding: '4em 2em', backgroundColor: '#E6F4EA'}}>
                <h2 style={{fontSize: '2.5em', color: '#746CFE', marginBottom: '1em'}}>Learn More About Response and Prevention</h2>
                <p style={{fontSize: '1.3em', marginBottom: '2em', maxWidth: '800px', margin: '0 auto 2em'}}>
                    Discover comprehensive strategies and approaches to prevent and respond to Gender-Based Violence effectively.
                </p>
                <Link to="/response-prevention" style={{
                    display: 'inline-block',
                    padding: '1em 2.5em',
                    backgroundColor: '#746CFE',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '30px',
                    fontSize: '1.2em',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                }}>
                    View Response & Prevention Strategies
                </Link>
            </section>
            
            <SafeSpaceFooter/>
        </>
    )
}

export default AboutGbv
