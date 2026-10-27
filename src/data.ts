export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  trending?: boolean;
  content: string[];
  sourceName?: string;
  sourceUrl?: string;
};

const images = {
  neural: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=85",
  robot: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=85",
  abstract: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=85",
  network: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85",
  chip: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85",
  city: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
  hands: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=85",
  satellite: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=85",
};

export const articles: Article[] = [
  {
    id: "concept-1", slug: "the-next-interface-is-a-conversation",
    title: "The next interface is a conversation",
    excerpt: "As AI gets better at listening, the way we work with our devices is becoming less about clicking and more about simply asking.",
    category: "AI & Research", author: "Maya Chen", date: "October 24, 2026", readTime: "8 min read",
    image: images.neural, imageAlt: "Colorful abstract neural network visualization", featured: true, trending: true,
    content: [
      "For decades, we learned the language of machines. We memorized menus, mastered shortcuts, and translated our intentions into the rigid vocabulary of buttons and forms. A quieter shift is now turning that relationship around: technology is learning to meet us in ours.",
      "Conversational interfaces are not new, but the latest generation of language models makes them feel meaningfully different. They can follow context, adapt to a person's level of expertise, and move between tasks without demanding a new set of instructions at every turn. The result is not just a smarter chatbot. It is a new way to approach software.",
      "The most useful systems are likely to be the ones that blend conversation with familiar controls. A thoughtful interface lets people ask for a starting point, inspect the result, and shape it through direct manipulation. Trust grows when the system explains what it did and makes correction easy.",
      "The open question is not whether we will talk to our devices. It is whether those conversations will give people more agency, or simply add a new layer between us and our work. The best interfaces will feel less like magic and more like a good collaborator: attentive, transparent, and easy to redirect.",
    ],
  },
  {
    id: "concept-2", slug: "small-models-big-ideas",
    title: "Small models, surprisingly big ideas",
    excerpt: "A new generation of efficient AI is challenging the assumption that useful intelligence has to live in a distant data center.",
    category: "AI & Research", author: "Noah Williams", date: "October 22, 2026", readTime: "6 min read",
    image: images.robot, imageAlt: "Friendly white robot in a softly lit studio", trending: true,
    content: [
      "Bigger has been the easiest story to tell in artificial intelligence. More parameters, more training data, more compute: the recipe for progress seemed to be a straight line. But as these systems move into everyday products, another question matters just as much: how much intelligence can we bring closer to the person using it?",
      "Compact models are becoming capable enough to summarize, classify, draft, and assist with focused tasks while running on a laptop or phone. They do not replace the largest systems, and they are not meant to. Their advantage is a different balance: lower latency, fewer infrastructure demands, and the option to keep sensitive work on-device.",
      "That shift could make AI feel less like a remote service and more like a feature of the tools we already own. It also brings new constraints. Developers have to decide which tasks belong on the device, how models are updated, and how to communicate their limits clearly.",
      "Efficiency is not only a technical metric. It is a design choice about where computation happens, who controls it, and which applications become possible when the cost of each interaction falls.",
    ],
  },
  {
    id: "concept-3", slug: "a-more-human-way-to-train-machines",
    title: "A more human way to train machines",
    excerpt: "What happens when the people closest to a problem help shape the systems built to solve it?",
    category: "People & Culture", author: "Amara Okafor", date: "October 20, 2026", readTime: "7 min read",
    image: images.hands, imageAlt: "Digital light patterns illuminating a collaborative workspace", trending: true,
    content: [
      "The story of a machine-learning system often starts with a dataset. Yet behind every dataset are decisions about what to collect, which labels to use, and whose experience counts as representative. Those decisions are not neutral, and they are rarely made by the people who will feel the consequences.",
      "A growing number of teams are exploring participatory approaches: inviting domain experts, local communities, and end users into the process earlier. That can mean co-designing an evaluation, documenting the context behind a dataset, or making space for people to challenge assumptions before a product is finished.",
      "Participation takes time, and it cannot be reduced to a last-minute feedback session. Done well, it changes what a team thinks the problem is. It can reveal when automation is the wrong answer, or when success should be measured by a human outcome rather than a model score.",
      "More human-centered AI is not a promise that technology will be fair by default. It is an invitation to share responsibility for how systems are made, used, and improved over time.",
    ],
  },
  {
    id: "concept-4", slug: "the-invisible-infrastructure-of-ai",
    title: "The invisible infrastructure of AI",
    excerpt: "Behind every seamless AI experience is a physical world of chips, cooling systems, energy, and difficult trade-offs.",
    category: "Future & Society", author: "Elliot Park", date: "October 18, 2026", readTime: "9 min read",
    image: images.chip, imageAlt: "Close-up of a circuit board and electronic components",
    content: [
      "AI can feel weightless. A prompt appears, an answer arrives, and the infrastructure connecting the two disappears into the background. But training and running these systems depends on very physical things: specialized chips, data centers, networks, power, and water.",
      "Understanding that footprint matters for more than accounting. It helps organizations make informed decisions about where to run a workload, whether a smaller model can do the job, and what investments in clean energy and efficient cooling are necessary.",
      "There is no single number that can describe the impact of an AI product. The answer depends on the model, the hardware, the local grid, the task, and how often the system is used. Good reporting makes those assumptions visible rather than hiding them behind a glossy interface.",
      "The future of AI will be shaped as much by infrastructure choices as by algorithmic breakthroughs. Bringing that layer into view is the first step toward making better ones.",
    ],
  },
  {
    id: "concept-5", slug: "when-ai-becomes-a-creative-partner",
    title: "When AI becomes a creative partner",
    excerpt: "The most interesting creative tools do not replace the spark. They give it more room to wander.",
    category: "Tools & Work", author: "Sofia Rivera", date: "October 16, 2026", readTime: "5 min read",
    image: images.abstract, imageAlt: "Geometric purple and blue shapes suggesting a creative digital space",
    content: [
      "A new creative tool is easiest to judge by the first thing it can make. It is more revealing to ask what it helps a person make next. The best uses of generative systems often happen in the gap between a blank page and a finished idea.",
      "A designer might explore several directions before committing to one. A writer might use a model to test the rhythm of a paragraph, then rewrite every line. In both cases, the person remains responsible for taste, context, and the final decision.",
      "That collaboration works only when the tool is predictable enough to invite experimentation and transparent enough to keep authorship clear. Teams also need practical agreements about attribution, consent, and which material is appropriate to bring into a system.",
      "The creative promise is not a machine that has ideas for us. It is a wider set of possibilities to react to, reshape, and make our own.",
    ],
  },
  {
    id: "concept-6", slug: "designing-for-an-ai-shaped-city",
    title: "Designing for an AI-shaped city",
    excerpt: "From traffic signals to public services, urban AI works best when the people in the city can see how it works.",
    category: "Future & Society", author: "Marcus Lee", date: "October 14, 2026", readTime: "8 min read",
    image: images.city, imageAlt: "City skyline at twilight with glowing lights",
    content: [
      "Cities already run on streams of information: transit schedules, utility sensors, service requests, and the patterns people leave behind as they move through public space. AI tools can help city teams find patterns in those streams, but the most important design question is who gets to set the goals.",
      "A model that optimizes one metric can quietly shift costs elsewhere. Shorter travel times for one route may mean louder streets for another. Faster processing may make a service less accessible to people who need human assistance.",
      "Public systems need public accountability. That means explaining what a tool is used for, measuring its effects across different communities, and providing a clear path to question or appeal consequential decisions.",
      "A smarter city is not one that automates the most. It is one that uses technology to make everyday life work better for more people—and can show its work.",
    ],
  },
  {
    id: "concept-7", slug: "the-new-map-of-open-source-ai",
    title: "The new map of open-source AI",
    excerpt: "Openness is not a single switch. It is a set of choices that shape who can study, adapt, and build on a model.",
    category: "AI & Research", author: "Priya Nair", date: "October 12, 2026", readTime: "6 min read",
    image: images.network, imageAlt: "Earth at night connected by glowing digital networks",
    content: [
      "The phrase open-source AI is often used as if it describes one clear thing. In practice, openness can mean access to model weights, training code, data documentation, an evaluation, or some combination of the four.",
      "Each choice opens a different door. Releasing weights can make local experimentation possible, while detailed documentation helps researchers understand how a model was developed. Neither alone guarantees that a system is safe, fair, or easy for everyone to use.",
      "The conversation is more useful when it names exactly what is being shared and under what conditions. That precision lets builders assess trade-offs without treating openness as either a silver bullet or a risk to avoid at all costs.",
      "A healthier ecosystem will make room for multiple approaches and give people the information they need to choose between them.",
    ],
  },
  {
    id: "concept-8", slug: "looking-up-ai-and-the-next-space-age",
    title: "Looking up: AI and the next space age",
    excerpt: "Autonomous analysis is helping researchers make sense of the expanding universe of satellite and telescope data.",
    category: "Tools & Work", author: "Daniel Kim", date: "October 10, 2026", readTime: "7 min read",
    image: images.satellite, imageAlt: "Earth horizon viewed from orbit",
    content: [
      "Modern observatories and satellites collect more imagery and sensor readings than a research team could inspect one frame at a time. Machine-learning systems can sift through those large collections, flagging patterns and unusual signals for people to investigate.",
      "That makes AI less of an artificial astronaut and more of a powerful sorting tool. Researchers still define the questions, verify surprising results, and connect observations with the physics that explains them.",
      "The hard part is not only finding a signal. It is knowing how confidently a system found it, how the data was collected, and whether a similar pattern might have been overlooked because it was not represented in training examples.",
      "Used carefully, these tools can help scientists spend more time on interpretation and less time searching through an ever-growing sky.",
    ],
  },
];

export const categories = [
  { name: "AI & Research", icon: "✳", color: "lilac" },
  { name: "Tools & Work", icon: "◈", color: "mint" },
  { name: "Future & Society", icon: "⌘", color: "peach" },
  { name: "People & Culture", icon: "◎", color: "blue" },
];

export const categoryDescriptions: Record<string, string> = {
  "AI & Research": "The ideas, breakthroughs, and open questions moving artificial intelligence forward.",
  "Tools & Work": "How emerging tools are changing the way we make, collaborate, and get things done.",
  "Future & Society": "Thoughtful perspectives on the ways technology shapes the world around us.",
  "People & Culture": "The people, choices, and creative energy behind a more human kind of technology.",
};
