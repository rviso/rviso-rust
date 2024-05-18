#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs/promises";

/**
 * 建立符号链接
 * @param {string} binPath - 二进制文件路径
 * @param {string} binDir - 链接目录
 */
export const linkBinaries = async (binPath, binDir) => {
  const binaries = ["cargo", "rustc", "rustdoc"];
  await fs.mkdir(binDir, { recursive: true });
  await Promise.all(binaries.map(binary =>
    fs.symlink(path.join(binPath, binary), path.join(binDir, binary))
  ));
};

