#!/usr/bin/env node

import os from 'os';
import path from 'path';
import { execa } from 'execa';

export async function setPermissions(filePath) {
    const platform = os.platform();
    const normalizedFilePath = path.normalize(filePath);

    try {
        if (platform === 'win32') {
            // Windows 使用 icacls 设置读写权限
            await execa('icacls', [normalizedFilePath, '/grant', 'Everyone:(R,W)']);
            console.log(`Successfully set read/write permissions for file ${normalizedFilePath}`);
        } else {
            // Unix 使用 chmod 设置读写权限
            await execa('chmod', ['+x', normalizedFilePath]);
            console.log(`Successfully set read/write permissions for file ${normalizedFilePath}`);
        }
    } catch (error) {
        console.error(`Failed to set permissions: ${error}`);
    }
}