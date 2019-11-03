import defaultSettings from '@/settings'

const title = defaultSettings.title || 'bigdata'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
