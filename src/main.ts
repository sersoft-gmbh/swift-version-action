import * as core from '@actions/core';
import { getExecOutput } from '@actions/exec';
import { EOL } from 'os';

async function runCmd(cmd: string, args?: string[]): Promise<string> {
    const output = await getExecOutput(cmd, args, {
        failOnStdErr: false,
        silent: !core.isDebug(),
    });
    return output.stdout;
}

async function main() {
    const swiftVersionOutput = await runCmd('swift', ['--version']);
    const lines = swiftVersionOutput.trim().split(EOL);
    if (lines.length < 1) {
        throw new Error('Invalid output from `swift --version`: ' + swiftVersionOutput);
    }
    const matches = /.*version\s+(\d+\.\d+(\.\d+)?).*/i.exec(lines[0]);
    if (!matches || matches.length < 2) { // First match is the complete string.
        throw new Error('Invalid output from `swift --version`: ' + swiftVersionOutput);
    }
    core.setOutput('version', matches[1]);
}

try {
    main().catch(error => core.setFailed(error.message));
} catch (error: any) {
    core.setFailed(error.message);
}
