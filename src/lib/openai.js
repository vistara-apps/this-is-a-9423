import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key not found. AI features will be disabled.');
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
}) : null;

// AI service functions
export const aiService = {
  // Generate initial clearance request email
  generateClearanceRequest: async (sampleData, projectData, userPreferences = {}) => {
    if (!openai) {
      throw new Error('OpenAI service not available');
    }

    const prompt = `
Generate a professional email requesting sample clearance with the following details:

Sample Information:
- Sample Name: ${sampleData.sampleName}
- Original Artist: ${sampleData.originalArtist}
- Duration/Portion: ${sampleData.duration || 'Not specified'}

Project Information:
- Project Name: ${projectData.projectName}
- Project Type: ${projectData.type || 'Music production'}
- Intended Use: ${projectData.intendedUse || 'Commercial release'}
- Distribution: ${projectData.distribution || 'Digital platforms'}

User Preferences:
- Tone: ${userPreferences.tone || 'Professional and respectful'}
- Include royalty discussion: ${userPreferences.includeRoyalty !== false}
- Urgency level: ${userPreferences.urgency || 'Standard'}

Please generate a professional email that:
1. Introduces the requester and project
2. Clearly identifies the sample being requested
3. Explains the intended use
4. Proposes fair compensation terms
5. Requests a meeting or call to discuss terms
6. Maintains a respectful and professional tone

Format the response as a JSON object with 'subject' and 'body' fields.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional music industry assistant specializing in sample clearance communications. Generate clear, respectful, and legally appropriate correspondence."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating clearance request:', error);
      throw new Error('Failed to generate clearance request');
    }
  },

  // Generate follow-up email for negotiations
  generateFollowUp: async (originalMessage, responseReceived, negotiationPoints) => {
    if (!openai) {
      throw new Error('OpenAI service not available');
    }

    const prompt = `
Generate a professional follow-up email for sample clearance negotiations.

Original Request Context:
${originalMessage}

Response Received:
${responseReceived}

Negotiation Points to Address:
${negotiationPoints.map(point => `- ${point}`).join('\n')}

Generate a diplomatic follow-up that:
1. Acknowledges their response
2. Addresses their concerns professionally
3. Proposes reasonable alternatives
4. Maintains positive relationship
5. Moves negotiation forward constructively

Format as JSON with 'subject' and 'body' fields.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a skilled negotiator in the music industry. Generate diplomatic and professional follow-up communications that help reach mutually beneficial agreements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating follow-up:', error);
      throw new Error('Failed to generate follow-up email');
    }
  },

  // Analyze and summarize legal terms
  analyzeLegalTerms: async (termsText) => {
    if (!openai) {
      throw new Error('OpenAI service not available');
    }

    const prompt = `
Analyze the following legal terms for a sample clearance agreement and provide a clear summary:

${termsText}

Please provide:
1. Key terms summary in plain English
2. Important rights and restrictions
3. Financial obligations
4. Duration and territory limitations
5. Any potential red flags or concerns
6. Overall assessment (favorable/neutral/unfavorable)

Format as JSON with structured fields for each section.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal assistant specializing in music industry contracts. Provide clear, accurate summaries of legal terms while noting that this is not legal advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1200
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing legal terms:', error);
      throw new Error('Failed to analyze legal terms');
    }
  },

  // Generate attribution text
  generateAttribution: async (sampleData, format = 'standard') => {
    if (!openai) {
      throw new Error('OpenAI service not available');
    }

    const prompt = `
Generate proper attribution text for a music sample with the following details:

Sample Information:
- Sample Name: ${sampleData.sampleName}
- Original Artist: ${sampleData.originalArtist}
- Original Song: ${sampleData.originalSong || 'Not specified'}
- Label/Publisher: ${sampleData.label || 'Not specified'}
- Year: ${sampleData.year || 'Not specified'}

Format requested: ${format}
Available formats: standard, academic, liner-notes, digital-platform

Generate appropriate attribution text that:
1. Properly credits all parties
2. Follows industry standards
3. Includes necessary copyright information
4. Is formatted appropriately for the specified use

Return as JSON with 'attribution' field containing the formatted text.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert in music industry attribution standards. Generate accurate and properly formatted attribution text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating attribution:', error);
      throw new Error('Failed to generate attribution');
    }
  },

  // Suggest royalty rates based on usage
  suggestRoyaltyRate: async (sampleData, usageData) => {
    if (!openai) {
      throw new Error('OpenAI service not available');
    }

    const prompt = `
Suggest appropriate royalty rates for a music sample clearance based on the following information:

Sample Details:
- Prominence in new work: ${usageData.prominence || 'Not specified'}
- Duration used: ${usageData.duration || 'Not specified'}
- Type of use: ${usageData.useType || 'Not specified'}
- Distribution scope: ${usageData.distribution || 'Not specified'}
- Expected revenue: ${usageData.expectedRevenue || 'Not specified'}

Original Work Details:
- Artist recognition: ${sampleData.artistRecognition || 'Not specified'}
- Original song popularity: ${sampleData.popularity || 'Not specified'}
- Age of original work: ${sampleData.age || 'Not specified'}

Provide:
1. Suggested royalty percentage range
2. Reasoning for the suggestion
3. Industry standard comparisons
4. Factors that might increase/decrease the rate

Format as JSON with structured recommendations.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a music industry expert with knowledge of sample clearance rates and industry standards. Provide realistic and fair royalty rate suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 600
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error suggesting royalty rate:', error);
      throw new Error('Failed to suggest royalty rate');
    }
  }
};

// Utility functions
export const isAIAvailable = () => {
  return openai !== null;
};

export const getAIUsageStats = async (userId) => {
  // This would typically fetch from your backend
  // For now, return mock data
  return {
    requestsThisMonth: 15,
    limit: 50,
    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };
};

// Pre-defined templates for when AI is not available
export const templates = {
  clearanceRequest: {
    subject: "Sample Clearance Request - {sampleName} by {originalArtist}",
    body: `Dear Rights Holder,

I hope this message finds you well. I am writing to request permission to use a sample from "{sampleName}" by {originalArtist} in my upcoming project "{projectName}".

Sample Details:
- Original Track: {sampleName}
- Artist: {originalArtist}
- Portion to be used: {duration}

Project Details:
- Project Name: {projectName}
- Intended Use: {intendedUse}
- Distribution: {distribution}

I am committed to ensuring fair compensation for the use of this sample and would appreciate the opportunity to discuss licensing terms with you. I am open to negotiating a reasonable royalty rate and advance payment.

Please let me know if you would be available for a brief call to discuss this opportunity. I look forward to hearing from you.

Best regards,
{userName}`
  },

  followUp: {
    subject: "Re: Sample Clearance Request - {sampleName}",
    body: `Dear {rightsHolderName},

Thank you for your response regarding the sample clearance for "{sampleName}". I appreciate you taking the time to consider my request.

I understand your concerns and would like to address them constructively. I am flexible on the terms and believe we can reach a mutually beneficial agreement.

Would you be available for a brief call this week to discuss the details further?

Best regards,
{userName}`
  }
};
