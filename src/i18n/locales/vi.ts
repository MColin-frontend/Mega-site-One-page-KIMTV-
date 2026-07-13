import chat from "./vi/chat.json"
import common from "./vi/common.json"
import footer from "./vi/footer.json"
import header from "./vi/header.json"
import home from "./vi/home.json"
import match from "./vi/match.json"
import news from "./vi/news.json"
import profile from "./vi/profile.json"
import schedule from "./vi/schedule.json"
import video from "./vi/video.json"

const vi = { common, header, footer, home, match, news, schedule, chat, video, profile }

export default vi

export interface Dictionary {
  common: {
    yesterday: string
    today: string
    tomorrow: string
    empty: string
    "live-page": {
      "live-section": string
      "upcoming-section": string
      "finished-section": string
      "filter-all": string
      "filter-hot": string
      "filter-live": string
      "filter-tv": string
    }
    "user-info": {
      tabs: { all: string; news: string; video: string }
      stats: {
        articles: string
        videos: string
        followers: string
        joined: string
        joinedSuffix: string
      }
      follow: string
      following: string
      hotNews: string
      empty: string
      category: string
      readMore: string
      video: string
      fallbackBio1: string
      fallbackBio2: string
    }
  }
  match: {
    card: {
      hours: string
      minutes: string
      seconds: string
      finished: string
      "watch-preview": string
      "blv-label": string
      watching: string
      "watching-tooltip": string
      period: {
        h1: string
        ht: string
        h2: string
        et: string
        pen: string
        live: string
      }
      stats: {
        shots: string
        "yellow-card": string
        "red-card": string
        corner: string
      }
    }
    fixture: {
      league: string
      match: string
      time: string
      score: string
      "corner-kick": string
      "yellow-card": string
      "red-card": string
      empty: string
    }
  }
  header: {
    nav: {
      home: string
      schedule: string
      "live-score": string
      "live-schedule": string
      results: string
      standings: string
      news: string
      video: string
      highlight: string
      data: string
    }
    auth: {
      login: string
      register: string
      callback: {
        processing: string
        error: string
      }
    }
    search: {
      "aria-label": string
      placeholder: string
    }
    user: {
      "aria-label": string
      account: string
      "fallback-name": string
      menu: {
        broadcast: string
        profile: string
        settings: string
      }
      logout: {
        label: string
        title: string
        content: string
        confirm: string
        cancel: string
      }
    }
    "mobile-menu": {
      open: string
      close: string
    }
  }
  footer: {
    desc: string
    menu: {
      home: string
      fixtures: string
      "live-score": string
      news: string
      highlights: string
    }
    copyright: string
  }
  home: {
    status: {
      all: string
      live: string
      finished: string
    }
    hero: {
      alt: string
    }
    "match-schedule": {
      title: string
    }
    "league-select": {
      all: string
      unit: string
      title: string
      selected: string
      "clear-all": string
      "search-placeholder": string
      empty: string
      favorites: string
    }
  }
  news: {
    title: string
    "page-title": string
    latest: string
    popular: string
    category: string
    "view-all": string
    empty: string
    subtitle: string
    "read-more": string
    "back-to-list": string
    "published-by": string
    "hot-videos": string
    author: {
      follow: string
      following: string
    }
    comment: {
      title: string
      placeholder: string
      reply: string
      delete: string
      submit: string
      empty: string
      "login-to-comment": string
      "view-more": string
    }
  }
  chat: {
    connecting: string
    connected: string
    disconnected: string
    reconnecting: string
    reconnect: string
    "new-messages": string
    placeholder: string
    login: string
    "login-prompt": string
    welcome: string
    "pin-label": string
    role: { streamer: string; admin: string }
    report: {
      title: string
      submit: string
      types: {
        speech: string
        attack: string
        nickname: string
        ad: string
        avatar: string
        spam: string
      }
    }
    actions: {
      "ban-all": string
      "ban-room": string
      delete: string
      pin: string
      unpin: string
      "set-manager": string
    }
    "login-to-chat": string
    "empty-message": string
    cancel: string
  }
  schedule: {
    "page-title": string
    subtitle: string
    "latest-news": string
  }
  video: {
    title: string
    "no-source": { title: string; description: string }
    menu: { featured: string; latest: string; trending: string; news: string; promotion: string }
    actions: {
      like: string
      comment: string
      share: string
      follow: string
      mute: string
      unmute: string
      play: string
      pause: string
      replay: string
    }
    share: { copied: string }
    follow: { success: string }
    comment: {
      title: string
      placeholder: string
      submit: string
      "login-prompt": string
      empty: string
      "load-more": string
      posting: string
      reply: string
      delete: string
      "post-success": string
      "reply-success": string
      "post-error": string
      "delete-success": string
      "delete-error": string
    }
    empty: string
    "load-more": string
    seo: { title: string; description: string }
  }
  profile: {
    pageTitle: string
    subtitle: string
    loginPrompt: string
    loginButton: string
    emptyTab: string
    nav: { profile: string; myNews: string; favorites: string; following: string; settings: string }
    info: {
      title: string
      editProfile: string
      phone: string
      email: string
      password: string
      change: string
      save: string
      cancel: string
      saving: string
      saveSuccess: string
      saveError: string
    }
    preferences: { title: string; addMore: string }
    security: { title: string; changeLink: string; changePassword: string }
  }
}
