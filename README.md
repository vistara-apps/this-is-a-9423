# SampleSafe

**Clear, track, and monetize your music samples.**

SampleSafe is a comprehensive platform for music creators to discover, clear, and manage rights for music samples, automating royalty tracking and payments.

## 🎵 Features

### Core Features
- **Sample Clearance Workflow**: Guided process to identify, contact rights holders, negotiate terms, and secure clearance
- **Royalty Tracking & Payment Automation**: Automated calculation and distribution of royalties with Stripe integration
- **Curated Sample Marketplace**: Searchable marketplace with pre-cleared samples and transparent usage rights
- **Sample Attribution Tools**: Generate formatted attribution credits for proper crediting

### AI-Powered Features
- **AI-Assisted Communication**: Generate professional clearance request emails and follow-ups
- **Legal Terms Analysis**: AI-powered analysis and summarization of complex legal terms
- **Royalty Rate Suggestions**: Smart recommendations based on usage patterns and industry standards

### Subscription Tiers
- **Free**: Up to 3 sample clearance requests, basic attribution tools
- **Creator ($15/mo)**: 10 samples/month, AI assistance, marketplace access, basic royalty tracking
- **Pro ($45/mo)**: Unlimited samples, advanced analytics, priority support, bulk processing

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for smooth animations
- **Lucide React** for consistent iconography
- **React Hot Toast** for notifications

### Backend & Services
- **Supabase** for authentication, database, and real-time features
- **Stripe** for payment processing and subscription management
- **OpenAI** for AI-assisted features
- **Row Level Security (RLS)** for data protection

### Database Schema
- Users, Projects, Samples, Rights Holders
- Marketplace Samples, Sample Purchases
- Royalty Payments, Usage Analytics
- Clearance Communications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Stripe account (for payments)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-9423.git
   cd this-is-a-9423
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_APP_URL=http://localhost:5173
   VITE_APP_NAME=SampleSafe
   ```

4. **Set up the database**
   - Run the SQL schema in `database/schema.sql` in your Supabase SQL editor
   - This will create all necessary tables, indexes, and RLS policies

5. **Configure Stripe**
   - Set up your Stripe products and prices
   - Update the price IDs in `src/lib/stripe.js`
   - Configure webhooks for subscription management

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.jsx   # Authentication modal
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Marketplace.jsx # Sample marketplace
│   ├── Header.jsx      # App header
│   └── Sidebar.jsx     # Navigation sidebar
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── lib/               # Service libraries
│   ├── supabase.js    # Supabase client and helpers
│   ├── stripe.js      # Stripe integration
│   └── openai.js      # OpenAI integration
└── styles/            # CSS and styling
    └── index.css      # Global styles and Tailwind

database/
└── schema.sql         # Complete database schema

public/                # Static assets
```

## 🎨 Design System

The app uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: `hsl(240, 80%, 50%)` - Main brand color
- **Accent**: `hsl(180, 70%, 45%)` - Secondary accent
- **Background**: `hsl(230, 25%, 95%)` - App background
- **Surface**: `hsl(0, 0%, 100%)` - Card/surface color

### Typography
- **Display**: Large headings and hero text
- **Headline**: Section headings
- **Body**: Regular content text
- **Caption**: Small descriptive text

### Components
- Consistent spacing using 4px grid system
- Rounded corners with multiple radius options
- Subtle shadows for depth
- Smooth transitions and animations

## 🔐 Security Features

- **Row Level Security (RLS)** on all database tables
- **JWT-based authentication** via Supabase
- **Secure API key management** with environment variables
- **Input validation** and sanitization
- **HTTPS enforcement** in production

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables on your hosting platform

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Extended user profiles with subscription information
- **Projects**: User's music projects containing samples
- **Samples**: Individual samples with clearance status and terms
- **Rights Holders**: Contact and payment information for rights owners
- **Marketplace Samples**: Pre-cleared samples available for purchase
- **Royalty Payments**: Automated royalty tracking and payments
- **Usage Analytics**: Track sample usage across platforms

## 🤖 AI Features

### Clearance Communication
- Generate professional initial clearance requests
- Create diplomatic follow-up emails for negotiations
- Customize tone and urgency based on user preferences

### Legal Analysis
- Analyze and summarize complex legal terms
- Identify potential red flags in agreements
- Provide plain English explanations

### Attribution Generation
- Create properly formatted attribution text
- Support multiple formats (standard, academic, liner notes)
- Ensure compliance with industry standards

## 💳 Payment Integration

### Stripe Features
- Subscription management with multiple tiers
- One-time payments for sample purchases
- Automated royalty transfers to rights holders
- Customer portal for subscription management
- Webhook handling for real-time updates

### Subscription Tiers
- **Free**: Limited features for trying the platform
- **Creator**: Mid-tier with AI assistance and marketplace access
- **Pro**: Full-featured tier with unlimited usage

## 🔄 API Integration

### Supabase
- Real-time database with PostgreSQL
- Authentication and user management
- File storage for sample uploads
- Edge functions for server-side logic

### OpenAI
- GPT-4 for high-quality text generation
- GPT-3.5-turbo for faster, cost-effective tasks
- Custom prompts for music industry context
- Usage tracking and rate limiting

## 📈 Analytics & Monitoring

- **Sample Usage Tracking**: Monitor how samples are used across platforms
- **Revenue Analytics**: Track royalty payments and marketplace sales
- **User Engagement**: Monitor feature usage and subscription metrics
- **Performance Monitoring**: Track API response times and error rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@samplesafe.com or join our Discord community.

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core sample clearance workflow
- ✅ Basic marketplace functionality
- ✅ AI-assisted communication
- ✅ Subscription management

### Phase 2 (Next)
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app development
- 🔄 Integration with major DAWs
- 🔄 Blockchain-based rights management

### Phase 3 (Future)
- 📋 White-label solutions for labels
- 📋 Advanced AI sample matching
- 📋 Global rights database integration
- 📋 Multi-language support

---

Built with ❤️ for the music community
