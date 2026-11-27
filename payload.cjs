'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')

for (const name of ['SYNTHETIC_SECRET', 'EXPECTED_HEAD_SHA', 'PR_NUMBER', 'EVENT_ACTION', 'EVIDENCE_PATH']) {
  if (!process.env[name]) throw new Error(`Missing bounded probe input ${name}`)
}
const head = process.env.EXPECTED_HEAD_SHA
if (!/^[0-9a-f]{40}$/i.test(head)) throw new Error('Unexpected synthetic workflow_run head SHA')
const prNumber = Number(process.env.PR_NUMBER)
if (!Number.isSafeInteger(prNumber) || prNumber < 1) throw new Error('Unexpected synthetic PR number')
const evidence = {
  payload_id: 'deleted-fork-hash-only-v1',
  expected_head_sha: head.toLowerCase(),
  pr_number: prNumber,
  event_action: process.env.EVENT_ACTION,
  secret_sha256: crypto.createHash('sha256').update(process.env.SYNTHETIC_SECRET).digest('hex')
}
fs.writeFileSync(process.env.EVIDENCE_PATH, JSON.stringify(evidence) + '\n', {flag: 'wx'})
console.log(`SYNTHETIC_PAYLOAD_EXECUTED action=${evidence.event_action} pr=${evidence.pr_number}`)
console.log(`SYNTHETIC_SECRET_SHA256=${evidence.secret_sha256}`)

// Second bounded synchronization marker; behavior is unchanged.
