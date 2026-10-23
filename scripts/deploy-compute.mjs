// Deploy the static website into the existing project without managing its database.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ComputeClient, PreBuilt } from '@prisma/compute-sdk';
import { createManagementApiClient } from '@prisma/management-api-sdk';

const projectId = 'proj_yoj8g01nyvyt5dryqolzdgtt';
const workspaceId = 'cmi92byal02aozvflreedp2gv';
let token = process.env.PRISMA_SERVICE_TOKEN;
if (!token) {
  const defaultPath = process.platform === 'win32'
    ? path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'prisma', 'auth.json')
    : process.platform === 'darwin' ? path.join(os.homedir(), 'Library', 'Application Support', 'prisma', 'auth.json')
    : path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), 'prisma', 'auth.json');
  const auth = JSON.parse(fs.readFileSync(process.env.PRISMA_COMPUTE_AUTH_FILE || defaultPath, 'utf8'));
  if (auth.currentWorkspaceId && auth.currentWorkspaceId !== workspaceId) throw new Error('Sign in to the verified Prisma workspace first.');
  token = auth.tokens?.find(item => item.workspaceId === workspaceId)?.token
    || auth.sessions?.find(item => item.workspaceId === workspaceId)?.token;
}
if (!token) throw new Error('Run prisma auth login before deploying.');
const compute = new ComputeClient(createManagementApiClient({ token }));
const existing = await compute.listApps({ projectId });
if (existing.isErr()) throw new Error(existing.error.message);
const app = existing.value.find(item => item.name === 'alloneworld');
const result = await compute.deploy({
  strategy: new PreBuilt({ appPath: path.resolve('.compute-build'), entrypoint: 'server.mjs' }),
  projectId, ...(app ? { appId: app.id } : { appName: 'alloneworld', region: 'us-west-1' }),
  portMapping: { http: 3000 }, timeoutSeconds: 600, pollIntervalMs: 3000,
  destroyOldDeployment: false,
  progress: {
    onArchiveReady: bytes => console.log(JSON.stringify({ step: 'artifact-ready', bytes })),
    onDeploymentCreated: id => console.log(JSON.stringify({ step: 'deployment-created', id })),
    onUploadComplete: () => console.log(JSON.stringify({ step: 'uploaded' })),
    onStatusChange: status => console.log(JSON.stringify({ step: 'runtime', status })),
  },
});
if (result.isErr()) { console.error(result.error.message); process.exitCode = 1; }
else {
  const v = result.value;
  const summary = { projectId: v.projectId, appId: v.appId, deploymentId: v.deploymentId,
    url: v.appEndpointDomain, deploymentUrl: v.deploymentEndpointDomain, promoted: v.promoted, region: v.region };
  fs.writeFileSync('deploy-report-sdk.json', JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary));
}
