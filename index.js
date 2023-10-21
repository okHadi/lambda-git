import { execSync } from 'child_process';
// import axios from 'axios';

export const handler = async (event) => {
    // Clear the /tmp directory
    execSync('rm -rf /tmp/*', { encoding: 'utf8', stdio: 'inherit' });

    // Clone the GitHub repository
    execSync('cd /tmp && git clone https://<PAT>@github.com/okHadi/<private-repo>.git', { encoding: 'utf8', stdio: 'inherit' });

    // Change to the repository directory
    process.chdir('/tmp/env_githubActions');

    // Get the last 10 commits
    const commitHistory = execSync('git log -n 3 --pretty=format:"%h %s"', { encoding: 'utf8' }).split('\n');

    // Check if "workflow.yml" is changed in any of the last 10 commits
    const isWorkflowChanged = commitHistory.some((commit) => {
        const [commitHash, commitMessage] = commit.split(' ');
        const diff = execSync(`git diff --name-only ${commitHash}^ ${commitHash}`, { encoding: 'utf8' });
        return diff.includes('workflow.yml');
    });

    if (isWorkflowChanged) {
        // Send a Slack message via webhook
        // const slackWebhookUrl = 'YOUR_SLACK_WEBHOOK_URL';
        // const slackMessage = {
        //   text: 'The "workflow.yml" file has been changed in the last 10 commits.',
        // };
        console.log("file changed.")
        //   try {
        //     await axios.post(slackWebhookUrl, slackMessage);
        //   } catch (error) {
        //     console.error('Failed to send Slack message:', error);
        //   }
    }
    else {
        console.log("file not changed")
    }

    return isWorkflowChanged;
};
