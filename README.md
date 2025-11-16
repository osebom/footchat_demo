# AI Chatbot UI - shadcn/ui

A beautiful React AI chatbot interface built with Next.js and shadcn/ui components. Features streaming responses, reasoning display, source citations, and a complete ChatGPT-style interface.

## Features

- ✨ **Streaming Responses** - Character-by-character message streaming with smooth animations
- 🧠 **Reasoning Display** - Collapsible reasoning sections showing AI thought processes
- 📚 **Source Citations** - Expandable source links with automatic counting
- 🎨 **Model Selection** - Dropdown to switch between different AI models (GPT-4o, Claude, Gemini, Llama)
- 📱 **Responsive Design** - Mobile-friendly interface with touch-optimized controls
- ⌨️ **Keyboard Shortcuts** - Enter to send, Shift+Enter for newlines
- 🎯 **Auto-scroll Management** - Smart scroll behavior during streaming
- ♿ **Accessible** - Screen reader friendly with proper ARIA labels

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the chatbot interface.

### Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
├── app/
│   ├── page.tsx              # Main chatbot page component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/
│       ├── ai/
│       │   ├── conversation.tsx    # Conversation container components
│       │   ├── message.tsx          # Message display components
│       │   ├── prompt-input.tsx     # Input area with model selection
│       │   ├── reasoning.tsx        # Reasoning display components
│       │   ├── source.tsx           # Source citation components
│       │   └── loader.tsx           # Loading indicator
│       ├── button.tsx        # Button component
│       ├── textarea.tsx      # Textarea component
│       └── select.tsx        # Select component
└── lib/
    └── utils.ts              # Utility functions
```

## Components

### AI Chatbot Components

- **Conversation** - Scrollable conversation container with auto-scroll
- **Message** - Individual message display with avatars
- **PromptInput** - Advanced input with model selection and tools
- **Reasoning** - Collapsible reasoning display
- **Sources** - Expandable source citations
- **Loader** - Animated loading indicator

## Customization

### Connecting to Real AI APIs

To connect to real AI APIs (OpenAI, Anthropic, etc.), modify the `handleSubmit` function in `app/page.tsx`:

```typescript
const handleSubmit = async (event) => {
  event.preventDefault();
  // Add your API call here
  // Replace the simulateTyping function with actual streaming
};
```

### Adding More Models

Edit the `models` array in `app/page.tsx`:

```typescript
const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'your-model-id', name: 'Your Model Name' },
];
```

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **nanoid** - ID generation

## Learn More

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn.io Blocks - AI Chatbot](https://www.shadcn.io/blocks/ai-chatbot)

## License

MIT
