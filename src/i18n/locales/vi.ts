import chat from "./vi/chat.json"
import common from "./vi/common.json"
import footer from "./vi/footer.json"
import header from "./vi/header.json"
import home from "./vi/home.json"
import news from "./vi/news.json"
import profile from "./vi/profile.json"
import schedule from "./vi/schedule.json"
import video from "./vi/video.json"

const vi = { common, header, footer, home, news, schedule, chat, video, profile }

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
    "match-card": {
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
        yellowCard: string
        redCard: string
        corner: string
      }
    }
  }
  header: {
    nav: {
      home: string
      schedule: string
      liveScore: string
      liveSchedule: string
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
    mobileMenu: {
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
    fixtures: {
      league: string
      match: string
      time: string
      homeTeam: string
      score: string
      awayTeam: string
      ht: string
      cornerKick: string
      yellowCard: string
      redCard: string
      empty: string
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
      clearAll: string
      searchPlaceholder: string
      empty: string
      favorites: string
    }
  }
  news: {
    title: string
    pageTitle: string
    latest: string
    popular: string
    category: string
    viewAll: string
    empty: string
    subtitle: string
    readMore: string
    backToList: string
    publishedBy: string
    hotVideos: string
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
      loginToComment: string
      viewMore: string
    }
  }
  chat: {
    connecting: string
    connected: string
    disconnected: string
    reconnecting: string
    reconnect: string
    newMessages: string
    placeholder: string
    login: string
    loginPrompt: string
    welcome: string
    pinLabel: string
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
      banAll: string
      banRoom: string
      delete: string
      pin: string
      unpin: string
      setManager: string
    }
    loginToChat: string
    emptyMessage: string
    cancel: string
  }
  schedule: {
    pageTitle: string
    subtitle: string
    latestNews: string
  }
  video: {
    title: string
    noSource: { title: string; description: string }
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
      loginPrompt: string
      empty: string
      loadMore: string
      posting: string
      reply: string
      delete: string
      postSuccess: string
      replySuccess: string
      postError: string
      deleteSuccess: string
      deleteError: string
    }
    empty: string
    loadMore: string
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
