export type Messages = {
  nav: {
    home: string;
    about: string;
    projects: string;
    blog: string;
    contact: string;
  };
  home: {
    title: string;
    subtitle: string;
    noCards: string;
    loading: string;
    error: string;
  };
  projects: {
    title: string;
    noProjects: string;
    loading: string;
    viewMore: string;
    viewProject: string;
    viewGithub: string;
    technologies: string;
    aboutProject: string;
  };
  blog: {
    title: string;
    noPosts: string;
    loading: string;
    readMore: string;
  };
  about: {
    title: string;
    intro: {
      greeting: string;
      role: string;
      motivation: string;
    };
    howIWork: {
      title: string;
      subtitle: string;
      description: string;
    };
    currentStage: {
      description: string;
    };
    goal: {
      description: string;
    };
  };
  contact: {
    title: string;
    badge: string;
    heroTitleStart: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    emailLabel: string;
    locationLabel: string;
    locationValue: string;
    followMe: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitButton: string;
    };
  };
  common: {
    loading: string;
    error: string;
    close: string;
  };
};
