import { defineConfig } from 'vitepress'
import { nav, sidebar, siteDescription, siteTitle } from './site-data'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserOrOrgSite = repoName?.toLowerCase().endsWith('.github.io')
const base =
  process.env.GITHUB_ACTIONS && repoName && !isUserOrOrgSite
    ? `/${repoName}/`
    : '/'

export default defineConfig({
  base,
  title: siteTitle,
  description: siteDescription,
  lang: 'zh-CN',
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }]
  ],
  themeConfig: {
    nav,
    sidebar,
    outline: {
      level: [2, 3],
      label: '本页导航'
    },
    docFooter: {
      prev: '上一节',
      next: '下一节'
    }
  }
})
