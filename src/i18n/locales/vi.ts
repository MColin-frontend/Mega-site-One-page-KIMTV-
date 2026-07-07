import chat from "./vi/chat.json"
import common from "./vi/common.json"
import footer from "./vi/footer.json"
import header from "./vi/header.json"
import home from "./vi/home.json"
import news from "./vi/news.json"

const vi = { common, header, footer, home, news, chat }

export default vi

export interface Dictionary {
  common: {
    yesterday: string
    today: string
    tomorrow: string
    empty: string
    "match-card": {
      hours: string
      minutes: string
      seconds: string
      finished: string
      "watch-preview": string
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
  }
}
