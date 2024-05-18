#!/usr/bin/env node

import path from "node:path";
import fs from "fs-extra";
import { setPermissions } from './set-permissions.mjs'

/**
 * 下载 rustup 脚本
 * @param {string} url - 下载地址
 * @param {string} path - 保存路径
 */
export const download= async (url, filePath) => {
  const resp = await fetch(url);
  const text = await resp.text();
  const dir = path.dirname(filePath);
  // 创建 node_modules 目录
  await fs.mkdir(dir, { recursive: true });
  // 写入 rustup.sh 文件
  await fs.writeFile(filePath, text);
  // 添加可执行权限
  await setPermissions(filePath);
};

