#!/usr/bin/env node

import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { installToolchain} from "./toolchain-install.mjs";
import { download } from "./download.mjs";
import { linkBinaries } from "./binaries-link.mjs";
import { rimraf } from 'rimraf';

const checkInstallation = async () => {
    const home = os.homedir();
    const rustcPath = path.join(home, ".cargo", "bin", "rustc.exe");
    // 检查是否存在 rustc文件，后缀名为可执行文件
    if(fs.existsSync(rustcPath)){
        return true;
    } else {
      return false;
    }
}

const install = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(__filename);
  const rootDir = path.join(dirname, "..");
  const url = "https://sh.rustup.rs";
  const rustupPath = path.join(rootDir, "node_modules", "rustup.sh");
  // 下载 rustup 脚本
  await download(url, rustupPath);
  const installDir = path.join(rootDir, "node_modules", ".rustup");
  const binDir = path.join(rootDir, "node_modules", ".bin");
  const binPath = path.join(installDir, "toolchains", 'stable', "bin");
  try {
    if(!await checkInstallation()){
      await installToolchain(rootDir, installDir);
      await linkBinaries(binPath, binDir);
    }
  } catch (error) {
    console.error(error);
  }
  rimraf.sync(rustupPath);
};

install().catch(console.error);



