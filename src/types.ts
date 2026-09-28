export interface Experience {
  company: string;
  position: string;
  period: string;
  startDate: string;
  endDate: string | null;
  stack: string;
  achievements: string[];
}

export interface Project {
  name: string;
  url: string;
  category: string;
  description: string;
  result: string;
  stack: string;
  visual: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  description: string;
  email: string;
  education: string;
  languages: string;
  links: { label: string; url: string }[];
  skills: { name: string; category: string }[];
  experience: Experience[];
  projects: Project[];
}

export const PROFILE_QUERY = `query Portfolio {
 profile {
  name role location description email education languages
  links { label url }
  skills { name category }
  experience { company position period startDate endDate stack achievements }
  projects { name url category description result stack visual }
 }
}`;

export async function queryAPI(query: string, signal?: AbortSignal) {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    signal: signal ?? AbortSignal.timeout(15000),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors)
    throw new Error(
      payload.errors?.map((item: { message: string }) => item.message).join(' · ') ||
        'API временно недоступен',
    );
  return payload;
}
