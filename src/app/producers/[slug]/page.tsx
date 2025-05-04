'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, useAnimate } from 'framer-motion';
import { usePageTransition } from '@/components/layout/PageTransitionContext';
import { CyberpunkButton } from '@/components/ui/CyberpunkButton';
import { MatrixBackground as MatrixBackground3 } from '@/components/layout/MatrixBackground3';

// TODO: Move producer data to a shared location or fetch it
const producersData = [
  { 
    slug: "tm88", 
    imgurl: "/producers/DSC_4494-1.jpg", 
    title: "Tm88", 
    bio: `Combining gleaming, extraterrestrial synths with the sinister undertones of the bando, TM88 is a forefather of surrealist trap. Since emerging as part of 808 Mafia in 2010, he's paired imagination with technical wizardry to produce some of the most iconic rap songs of the decade, collecting Platinum plaques and over 6 billion streams. Simply put, few producers have impacted hip-hop with the concussive force of TM88. It's part of a mission that began a long time ago. "I always wanted to be involved in music in some kind of way," he remembers. 

Born in North Miami and raised in Atlanta, Bryan Lamar Simmons had an ear for music — and an eye for opportunity — from the beginning. "I came up on Kris Kross, Geto Boys, and Michael Jackson," he says. "I used to record music off the radio, bring it to school, and sell the tapes."

That hustle took him to the studio where he was inspired by a friend's dad to make beats. "His beats weren't that good," TM laughs, "but I wanted to figure this out." His cousin gifted him FL Studio and he made his first beat at 12. "I was like, 'Damn bro! I could be like Jazze Pha or Lil Jon!'" TM sold his first beat—for a mere $40—to a local rapper at 18. In 2010, TM and Southside formed the production collective 808 Mafia, and serendipitously, Waka Flocka Flame happened to find one particular beat he liked on the group's self-titled instrumental project online. One of those beats became "Lurkin," a track on Waka's 2012 album Triple F Life. It was TM's first industry placement — the first of many. 

TM's relationship with Waka opened the door to the who's who of the South: Gucci Mane, Rick Ross, and Future, to name a few. His Hendrix connection also proved fruitful. The two linked through a mutual friend on Twitter and began work on 2013's Future Presents: F.B.G. The Movie. "I was really at home, struggling at the time. We had records out but behind the scenes, I was struggling. Long story short, Future wanted to record that night." He sent 15 beats and was shocked to find the rapper blow through them. "I kid you not, he recorded to 15 beats in like two hours!" 

Since then, TM88 has released multiple standout projects of his own (88World, 88Birdz with Doe Boy) while building an impressive production discography including Drake ("Way 2 Sexy" featuring Young Thug and Future), Lil Uzi Vert ("XO Tour Llif3"), Lil Durk ("Ahhh Ha"), 21 Savage ("Drip"), Wiz Khalifa ("Pull Up"), King Von ("Hard to trust") and Travis Scott ("Nothing but Net").  The songs are the result of a unique synergy he works to cultivate with artists.

"Creatively, I like to vibe with the artist. It helps to have a relationship. It makes the music way better," he explains of his process. "The way I hear the music is different from everybody else. It creates a strong bond." In 2017, he hit the commercial and critical jackpot with Lil Uzi Vert's "XO Tour Llif3" "We give each other motivation," he says, noting the lengthy FaceTime conversation that led to the creation of the song. The track has since one 11x Platinum and TM is still stunned by its success. And he's always found more. 

In 2021, Drake's TM-produced Young Thug and Future-assisted single "Way 2 Sexy" peaked at No. 1 on the Billboard Hot 100 chart. He's also hit No. 3 on Billboard's Rap Producers chart. Teaming up with another production titan, he linked with Pi'erre Bourne for their collab album Yo!88 at the end of 2021. Building upon his relationship with Future, he also produced four songs on Hendrix's 2022 album, I Never Liked You ("712PM," "Puffin On Zootiez," "The Way Things Going" and "Affiliated"). He also created soundscapes for DJ Khaled's God Did album ("Big Time," "Keep Going," and "Beautiful"). I Never Liked You and God Did were both nominated for Best Rap Album at the 2022 Grammy Awards. Amid a steady stream of production work, which includes two songs on Wiz Khalifa's Multiverse album ("Homies" and "Thank Him"), he's also founded Crash Dummy Records, a collective of rising producers also looking to leave their mark on the music industry. 

While he's got goals to reach, he takes stock of what he's already done — and the self-belief required to do more. "I be so hard on myself. I want to make the best shit," he shares. "Sometimes you already have the shit that you need."

His bucket list includes working with Beyoncé someday. More generally speaking, he aims to remain the flexible, forward-thinking musician he's always been. If he switches up, it was all part of the plan. "I transition my sound with the times," he says. "I try to make sure I'm one of the leaders of the sound."` 
  },
  { slug: "akachi-glo", imgurl: "/producers/Akachi-1.jpeg", title: "Akachi Glo", bio: "CrashDummy" }, 
  { slug: "cash-88", imgurl: "/producers/Crash-Dummy-Placeholder.png", title: "Cash 88", bio: "CrashDummy" },
  { 
    slug: "dante-smith", 
    imgurl: "/producers/Dante-Smith.jpg", 
    title: "Dante Smith", 
    bio: `Dante Smith, a hip-hop producer, based in Portland, Oregon, is driven to incorporate analog instruments into the modern-day music scene. He launched his music career at an early age by performing in a Jazz band and transitioning into a full-time producer just five years ago. Smith took advantage of the rapid growth of TikTok by releasing clips of him performing live instruments, such as the guitar and keys while producing one-of-a-kind rock-influenced beats. His talents caught many's attention, including TM88 and Duke Deuce` 
  },
  { slug: "dj-moon", imgurl: "/producers/DJ-Moon-scaled.jpg", title: "DJ Moon", bio: "CrashDummy" },
  { 
    slug: "lexx-darkstar", 
    imgurl: "/producers/Lexx-Darkstar.jpeg", 
    title: "Lexx Darkstar", 
    bio: `Known for his melodies and particular skills with the piano, Lexx Darkstar is a melodic producer based out of Tampa, FL. Over the past sixteen years, he has been paving anew lane in the hip-hop space through his talented piano skills, incorporating keys into each piece of work. By doing so, he's developed a distinct style of music, leading him into collaborations with artists such as Future, Roddy Rich, Lil Baby, TM88, and Pi'erre Bourne. Lexx Darkstar is currently working on a producer album focused exclusively on the piano.` 
  },
  { slug: "lunch-77", imgurl: "/producers/Crash-Dummy-Placeholder.png", title: "Lunch 77", bio: "CrashDummy" },
  { 
    slug: "macnificent", 
    imgurl: "/producers/Macnificent-scaled.jpg", 
    title: "Macnificent", 
    bio: `Macnificent initially kicked off his career on the opposite sides of the booth, from thinking he wanted to be a rapper to quickly realizing his talents fell into producing. Hailing from Memphis, TN, Macnificent engulfed himself in the music scene and has worked with prominent artists such as Young Dolph and Juicy J. He has been creating trap beats professionally since 2015 while collaborating with hip-hop acts, including Gucci, Future, 21 Savage, and Young Thug.` 
  },
  { 
    slug: "rozay-knockin", 
    imgurl: "/producers/Rozay-Knockin-scaled.jpg", 
    title: "Rozay Knockin", 
    bio: `At twenty years old, Rozay Knockin, also known as Isaiah Quick, has already made a dent in his music career in the short five years he's been producing professionally. Born and raised in Baltimore, Maryland, he was inspired to create music that influenced others through their moods and experiences. After learning how to produce from his older brother, he grew his diverse skill set, catching the attention of artists such as Future, Lil Baby, Lil Keed, and Lil Jairmy. Rozay also helped produce "Big Time" for DJ Khaled, featured on his album GOD DID that reached No. 1 on the charts. In addition to building his catalog, Rozay is actively growing his gaming career and preparing to launch his own YouTube channel where fans will be able to watch his streams.` 
  },
  { 
    slug: "sid", 
    imgurl: "/producers/Sid.jpg", 
    title: "Sid", 
    bio: `Sid, a Western Canadian based producer, has created distinctive hip-hop and trap beats for the past ten years. His early influence on music came from his Mother who had gifted him Daft Punk's Homework album in the late 90's. This would ultimately become a significant reason in his career on why he has such a strong passion for music. He continues to create music, not just for the love of it, but in Honor of his Mother. At thirty-one years old, he's taken inspiration from all types of music genres and able to create them, such as 80's Synthwave, Trap, R&B, Pop and many more. Sid's beats have led him to collaborations with Pi'erre Bourne, Nessly, and Lil Jairmy. He is looking forward to having production on upcoming albums, including Yung Mal's Iceburg WhereYou Been?, MoneyBagg Yo's untitled album, and Wiz Khalifa's Wizzlemania.` 
  },
  { 
    slug: "slo-meezy", 
    imgurl: "/producers/Slo-Meezy-scaled.jpg", 
    title: "Slo Meezy", 
    bio: `Based in Atlanta, GA, Slo Meezy, aka Gregory Lamar Davis, is a hip-hop producer with almost fifteen years of experience. Musical talents have been part of Slo Meezy's life from an early age, as a percussionist throughout grade school, to attending technical school for media broadcasting, to growing up in the same neighborhood as TM88 and 808 Mafia-he was destined to perform. While Slo Meezy is currently working on projects with Yung Mal, Doe Boy, and DJ Khaled, his catalog has grown exponentially. As a rising producer, he has already produced for artists including Plies, Bobby Shmurda, Shawty Lo, No Cap, and many more.` 
  },
  { slug: "too-dope", imgurl: "/producers/Crash-Dummy-Placeholder.png", title: "Too Dope", bio: "CrashDummy" },
  { 
    slug: "kmaddxx", 
    imgurl: "/producers/kmaddxx.jpg", 
    title: "kmaddxx", 
    bio: `Kiana Maddox, aka kmaddxx, is a twenty-five year old hip-hop producer based out of Atlanta, GA. While crafting her sound and making beats over the past ten years, she has developed her own distinctive melodic and futuristic style. kmaddxx has produced for influential rappers, including Young Thug, Curren$y, Lil Duke, and Lloyd. She's currently focused on creating with upcoming artists and expanding her style into reggae, rock, and blues.` 
  },
  { 
    slug: "yung-icey", 
    imgurl: "/producers/Yung-Icey-scaled.jpg", 
    title: "Yung Icey", 
    bio: `Perseverance and ambition are two words to describe the evolving twenty-five year old producer based in Atlanta, GA, known as Yung Icey. The young producer has been making beats since his late teens, always inspired by his immediate emotions and surroundings. As a self-taught producer, Yung Icey took a different path than most by finishing his education at the University of South Carolina, graduating in 2019 while producing music full-time. Over the years, he has worked with Future, Denzel Curry, and Yung Bans. As he prepares for the next chapter in his career, Yung Icey aims to look outside just making music and focus on creating a brand that provides and gives back to the community.` 
  }
];

export default function ProducerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { transitionState, nextRoute, startTransition, completeTransition } = usePageTransition();
  const [scope, animate] = useAnimate();
  
  // Find the producer based on the slug
  const producer = producersData.find(p => p.slug === params.slug);
  
  // Move useEffect hooks BEFORE the early return check
  // Handle entry animation
  useEffect(() => {
    const runEntryAnimation = async () => {
      // Start elements hidden
      animate([
        [".producer-image", { opacity: 0, y: -100 }, { duration: 0 }],
        [".bio-card", { opacity: 0, scale: 0.8 }, { duration: 0 }],
        [".back-button-container", { opacity: 0, x: -50 }, { duration: 0 }]
      ]);

      await new Promise(resolve => setTimeout(resolve, 300)); // Small delay

      // Animate in sequence
      await animate(".back-button-container", { opacity: 1, x: 0 }, { duration: 0.5, ease: "easeOut" });
      await animate(".producer-image", { opacity: 1, y: 0 }, { duration: 0.6, ease: "easeOut" });
      await animate(".bio-card", { opacity: 1, scale: 1 }, { duration: 0.7, ease: "easeOut" });
      
      // Set animation complete after all animations
      // setAnimationComplete(true); // Removed as it's unused
    };

    runEntryAnimation();
  }, [animate]); // Depend only on animate

  // Handle exit animation
  useEffect(() => {
    const runExitAnimation = async () => {
      if (transitionState === 'exiting' && nextRoute && scope.current) {
        await Promise.all([
          animate(".producer-image", { opacity: 0, y: -50 }, { duration: 0.4, ease: 'easeIn' }),
          animate(".bio-card", { opacity: 0, scale: 0.9 }, { duration: 0.5, ease: 'easeIn' }),
          animate(".back-button-container", { opacity: 0, x: -30 }, { duration: 0.3, ease: 'easeIn' }),
          animate(".matrix-background", { opacity: 0 }, { duration: 0.6, ease: 'easeIn' })
        ]);
        router.push(nextRoute);
        completeTransition();
      }
    };
    runExitAnimation();
  }, [transitionState, nextRoute, animate, completeTransition, router, scope]); // Added scope dependency

  // Early return if producer not found
  if (!producer) {
    // Optional: Redirect to a 404 page or the producers list
    // router.push('/404'); // Example redirect
    return <div className="text-white text-center pt-20">Producer not found.</div>; 
  }

  const handleBack = () => {
    startTransition('/producers');
  };

  return (
    <motion.div 
      ref={scope} 
      className="relative min-h-screen w-full flex flex-col items-center text-white p-4 pt-24 pb-12 overflow-y-auto" // Added overflow-y-auto
    >
      {/* Place MatrixBackground3 directly with fixed positioning */}
      <div className="fixed inset-0 z-[-1] background-container">
         <MatrixBackground3 /> 
      </div>
      
      {/* Back Button - Positioned top-left */}
      <div className="absolute top-8 left-12 z-50 back-button-container"> 
        <CyberpunkButton 
            text="BACK"
            margin="m-0"
            index={99} 
            onClick={handleBack}
          />
      </div>

      {/* Content Area (No Tilt as per user's last edit) */}
      <div className='w-full flex flex-col mt-12 items-center'> {/* Added centering wrapper */} 
         <div className="w-full max-w-3xl h-64 md:h-80 lg:h-96 relative mb-8 overflow-hidden rounded-lg border-2 border-lime-500/50 shadow-lg shadow-lime-500/20 producer-image-container" style={{ transform: 'translateZ(20px)' }}>
           {/* ... Image ... */}
           <Image
            src={producer.imgurl}
            alt={producer.title}
            layout="fill"
            objectFit="cover"
            className="object-[center_33%]"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <h1 className="absolute bottom-4 left-4 text-4xl md:text-6xl font-bold text-lime-300 cyberpunk-title glitch-text producer-title" data-text={producer.title} style={{ transform: 'translateZ(40px)' }}>
            {producer.title}
          </h1>
        </div>

         <div className="bg-neutral-900/70 max-w-3xl w-full border border-lime-500/30 p-6 rounded-md backdrop-blur-sm shadow-md bio-card-container mb-12" style={{ transform: 'translateZ(10px)' }}> {/* Added w-full and mb */} 
          <h2 className="text-2xl font-semibold text-lime-400 mb-4 font-mono">Bio</h2>
          <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{producer.bio}</p>
        </div>
      </div>

    </motion.div>
  );
} 