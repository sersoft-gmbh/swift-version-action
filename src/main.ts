import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { EOL } from "os";

async function runCmd(cmd: string, args?: string[]): Promise<string> {
    let stdOut = '';
    await exec(cmd, args, {
        failOnStdErr: true,
        listeners: {
            stdout: (data: Buffer) => stdOut += data.toString()
        }
    });
    return stdOut;
}

async function main() {
    const swiftVersionOutput = await runCmd('swift', ['--version']);
    const lines = swiftVersionOutput.trim().split(EOL);
    if (lines.length < 1) {
        throw new Error('Invalid output from `swift --version`: ' + swiftVersionOutput);
    }
    const matches = /.*version\s+(\d+\.\d+(\.\d+)?).*/i.exec(lines[0]);
    if (!matches || matches.length < 2) {
        throw new Error('Invalid output from `swift --version`: ' + swiftVersionOutput);
    }
    core.setOutput('version', matches[1]);
}

try {
    main().catch(error => core.setFailed(error.message))
} catch (error) {
    core.setFailed(error.message);
}
