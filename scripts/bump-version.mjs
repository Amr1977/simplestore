import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function safeExec(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const current = pkg.version || '0.0.0'

const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(current)
if (!m) {
  console.error(`[bump] package.json version "${current}" is not a clean semver. Edit it manually first.`)
  process.exit(1)
}

const bumpType = (process.argv[2] || 'patch').toLowerCase()
let next = current
if (bumpType === 'major') next = `${+m[1] + 1}.0.0`
else if (bumpType === 'minor') next = `${m[1]}.${+m[2] + 1}.0`
else if (bumpType === 'patch') next = `${m[1]}.${m[2]}.${+m[3] + 1}`
else {
  console.error(`[bump] unknown bump type "${bumpType}". Use major | minor | patch.`)
  process.exit(1)
}

pkg.version = next
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')

const tag = `v${next}`
const existing = safeExec(`git tag -l ${tag}`)
if (existing) {
  console.error(`[bump] tag ${tag} already exists. Aborting.`)
  process.exit(1)
}

safeExec(`git add package.json`)
safeExec(`git commit -m "chore: bump version to ${tag}"`)
safeExec(`git tag -a ${tag} -m "${tag}"`)

console.log(`[bump] ${current} → ${next} (tagged ${tag})`)
console.log(`[bump] Run \`git push origin master --follow-tags\` to publish.`)
