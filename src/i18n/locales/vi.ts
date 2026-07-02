import common from "./vi/common.json"
import footer from "./vi/footer.json"
import header from "./vi/header.json"
import home from "./vi/home.json"

const vi = { common, header, footer, home }

export default vi

export interface Dictionary {
  common: {
    yesterday: string
    today: string
    tomorrow: string
    empty: string
  }
  header: {
    nav: {
      home: string
      schedule: string
      liveScore: string
      results: string
      standings: string
      news: string
      video: string
      data: string
    }
    auth: {
      login: string
      register: string
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
    news: {
      title: string
      latest: string
      category: string
      viewAll: string
      empty: string
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
}
