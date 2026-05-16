import type { DefaultTheme } from 'vitepress'

export type Lesson = {
  text: string
  title: string
  summary: string
  link: string
}

export type LearningTrack = {
  slug: string
  title: string
  summary: string
  description: string
  link: string
  duration: string
  audience: string[]
  lessons: Lesson[]
}

export type Topic = {
  slug: string
  title: string
  badge: string
  status: string
  summary: string
  description: string
  link: string
  highlights: string[]
  tracks: LearningTrack[]
}

const kotlinLessons: Lesson[] = [
  {
    text: 'Day1 基础语法',
    title: 'Day1：Kotlin 基础语法与开发环境',
    summary: '变量、类型、字符串模板、基础输出',
    link: '/topics/kotlin/7-days/day-1'
  },
  {
    text: 'Day2 空安全与函数',
    title: 'Day2：空安全、函数与流程控制',
    summary: '可空类型、默认参数、when 表达式',
    link: '/topics/kotlin/7-days/day-2'
  },
  {
    text: 'Day3 类与数据类',
    title: 'Day3：类、对象、数据类与扩展函数',
    summary: '类、data class、扩展函数',
    link: '/topics/kotlin/7-days/day-3'
  },
  {
    text: 'Day4 集合与函数式',
    title: 'Day4：集合与函数式编程',
    summary: 'map/filter/groupBy 与统计处理',
    link: '/topics/kotlin/7-days/day-4'
  },
  {
    text: 'Day5 OOP 与泛型',
    title: 'Day5：面向对象进阶与泛型',
    summary: '继承、接口、泛型类与类型安全',
    link: '/topics/kotlin/7-days/day-5'
  },
  {
    text: 'Day6 协程基础',
    title: 'Day6：协程与并发基础',
    summary: 'async/await、调度器与超时控制',
    link: '/topics/kotlin/7-days/day-6'
  },
  {
    text: 'Day7 综合实战',
    title: 'Day7：综合项目实战',
    summary: '用分层结构完成一个 CLI 小项目',
    link: '/topics/kotlin/7-days/day-7'
  }
]

export const topics: Topic[] = [
  {
    slug: 'kotlin',
    title: 'Kotlin',
    badge: 'KT',
    status: '已上线专题',
    summary: '覆盖语法、空安全、集合、协程与一个可运行小项目的 Kotlin 入门专题。',
    description: '面向想系统入门 Kotlin 的开发者，先建立语法与类型系统基础，再逐步进入集合、协程和综合实战。',
    link: '/topics/kotlin/',
    highlights: [
      '从语法基础到并发与项目实战的连续学习链路',
      '覆盖空安全、类与扩展函数、集合、泛型和协程等入门重点',
      '先看专题范围，再进入按天拆解的学习路径，更容易掌握学习顺序'
    ],
    tracks: [
      {
        slug: '7-days',
        title: 'Kotlin 7 天教程',
        summary: '7 天完成从入门语法到综合实战的第一条 Kotlin 学习路径。',
        description: '按 7 天拆解 Kotlin 入门重点，每天都有学习目标、示例代码和练习，适合第一次系统学习 Kotlin 时照着完成。',
        link: '/topics/kotlin/7-days/',
        duration: '7 天',
        audience: ['Java 开发者转 Kotlin', '希望系统入门 Kotlin 的新手', '需要短期建立语言手感的同学'],
        lessons: kotlinLessons
      }
    ]
  }
]

export const siteTitle = 'dev-docs'
export const siteDescription = 'Kotlin 学习专题与 7 天入门路径，帮助你按顺序掌握语法、集合、协程和综合实战。'

export const learningPaths = topics.flatMap((topic) =>
  topic.tracks.map((track) => ({
    ...track,
    topicTitle: topic.title,
    topicLink: topic.link,
    topicBadge: topic.badge
  }))
)

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '技术专题', link: topics[0].link },
  { text: '学习路径', link: learningPaths[0].link }
]

function buildTopicSidebar(topic: Topic): DefaultTheme.SidebarItem[] {
  return [
    {
      text: `${topic.title} 专题`,
      items: [
        { text: '专题首页', link: topic.link },
        ...topic.tracks.map((track) => ({
          text: track.title,
          link: track.link
        }))
      ]
    },
    ...topic.tracks.map((track) => ({
      text: track.title,
      items: track.lessons.map((lesson) => ({
        text: lesson.text,
        link: lesson.link
      }))
    }))
  ]
}

function buildTrackSidebar(topic: Topic, track: LearningTrack): DefaultTheme.SidebarItem[] {
  return [
    {
      text: `${topic.title} 专题`,
      items: [{ text: '专题首页', link: topic.link }]
    },
    {
      text: track.title,
      items: [
        { text: '路线首页', link: track.link },
        ...track.lessons.map((lesson) => ({
          text: lesson.text,
          link: lesson.link
        }))
      ]
    }
  ]
}

const sidebarEntries: Array<[string, DefaultTheme.SidebarItem[]]> = topics.flatMap((topic) => [
  [`/topics/${topic.slug}/`, buildTopicSidebar(topic)],
  ...topic.tracks.map(
    (track) => [`/topics/${topic.slug}/${track.slug}/`, buildTrackSidebar(topic, track)] as [string, DefaultTheme.SidebarItem[]]
  )
])

export const sidebar: DefaultTheme.Sidebar = Object.fromEntries(sidebarEntries)

export function getTopicBySlug(slug: string): Topic {
  const topic = topics.find((item) => item.slug === slug)

  if (!topic) {
    throw new Error(`Unknown topic slug: ${slug}`)
  }

  return topic
}

export function getTrack(topic: Topic, trackSlug: string): LearningTrack {
  const track = topic.tracks.find((item) => item.slug === trackSlug)

  if (!track) {
    throw new Error(`Unknown track slug: ${trackSlug}`)
  }

  return track
}
