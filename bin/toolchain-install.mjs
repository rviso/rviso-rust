#!/usr/bin/env node

import { execa } from "execa";
import os from "node:os";

/**
 * 获取目标名称
 * @param {string} toolchain - 工具链版本
 * @returns {string} - 返回目标名称
 */
export const getTargetName = (toolchain) => {
  const rawOsType = os.type();
  const rawArchitecture = os.arch();

  let osType = "";
  switch (rawOsType) {
    case "Windows_NT":
      throw new Error("Windows is not supported");
    case "Darwin":
      osType = "apple-darwin";
      break;
    case "Linux":
      osType = "unknown-linux-gnu";
      break;
    default:
      throw new Error("Unsupported OS type");
  }

  let arch = "";
  switch (rawArchitecture) {
    case "x64":
      arch = "x86_64";
      break;
    case "arm64":
      arch = "aarch64";
      break;
    default:
      throw new Error("Unsupported architecture");
  }

  return `${toolchain}-${arch}-${osType}`;
};

/**
 * 获取工具链版本
 * @param {string} dirname - 当前文件所在目录
 * @returns {Promise<string>} - 返回工具链版本
 */
export async function getToolchain(rootDir) {

  const packageJson = await import(`${rootDir}/package.json`);

  if (packageJson.version.endsWith("-nightly")) {
    return "nightly";
  } else if (packageJson.version.endsWith("-beta")) {
    return "beta";
  } else if (packageJson.version.endsWith("-stable")) {
    return "stable";
  } else if (/^\d+\.\d+\.\d+$/.test(packageJson.version)) {
    return packageJson.version;
  } else {
    throw new Error("unknown toolchain");
  }
}


/**
 * 安装 Rust 工具链
 * @param {string} rustupPath - rustup 脚本路径
 * @param {string} installDir - 安装目录
 */
export const installToolchain = async (rustupPath, installDir) => {
  // 设置环境变量 RUSTUP_HOME 为安装目录, 并安装 stable 版本, -y 参数表示自动接受默认设置
  await execa(rustupPath, ["-y", "--default-toolchain", "stable"], {
    env: {
      RUSTUP_HOME: installDir
    }
  });
};