export const typeDefs = `
  "Professional profile"
  type Profile {
    name: String!
    role: String!
    location: String!
    description: String!
    email: String!
    education: String!
    languages: String!
    links: [Link!]!
    skills: [Skill!]!
    experience: [Experience!]!
    projects: [Project!]!
  }

  type Link {
    label: String!
    url: String!
  }

  type Skill {
    name: String!
    category: String!
  }

  type Experience {
    company: String!
    position: String!
    period: String!
    startDate: String!
    endDate: String
    stack: String!
    achievements: [String!]!
  }

  type Project {
    name: String!
    url: String!
    category: String!
    description: String!
    result: String!
    stack: String!
    visual: String!
  }

  type Query {
    profile: Profile!
  }
`;
