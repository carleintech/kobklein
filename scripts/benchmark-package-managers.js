#!/usr/bin/env node

/**
 * Package Manager Performance Comparison Script
 * Compares install times and disk usage between npm and pnpm
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class PerformanceBenchmark {
  constructor() {
    this.results = {
      npm: { time: null, diskUsage: null },
      pnpm: { time: null, diskUsage: null },
    };
  }

  formatTime(ms) {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  }

  formatSize(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  getDirSize(dirPath) {
    if (!fs.existsSync(dirPath)) return 0;

    let totalSize = 0;
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        totalSize += this.getDirSize(filePath);
      } else {
        totalSize += stats.size;
      }
    });

    return totalSize;
  }

  async benchmarkPackageManager(manager) {
    console.log(`\n🧪 Testing ${manager.toUpperCase()}...`);

    // Clean install
    if (fs.existsSync("node_modules")) {
      execSync("rm -rf node_modules", { stdio: "pipe" });
    }

    // Remove lockfiles
    const lockfiles = {
      npm: "package-lock.json",
      pnpm: "pnpm-lock.yaml",
    };

    Object.values(lockfiles).forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    const startTime = Date.now();

    try {
      if (manager === "npm") {
        execSync("npm install --silent", { stdio: "pipe" });
      } else {
        execSync("pnpm install --silent", { stdio: "pipe" });
      }

      const endTime = Date.now();
      const installTime = endTime - startTime;
      const diskUsage = this.getDirSize("./node_modules");

      this.results[manager] = {
        time: installTime,
        diskUsage: diskUsage,
      };

      console.log(`   ⏱️  Install time: ${this.formatTime(installTime)}`);
      console.log(`   💾 Disk usage: ${this.formatSize(diskUsage)}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      this.results[manager] = {
        time: null,
        diskUsage: null,
        error: error.message,
      };
    }
  }

  displayComparison() {
    console.log("\n📊 PERFORMANCE COMPARISON");
    console.log("═".repeat(50));

    const npm = this.results.npm;
    const pnpm = this.results.pnpm;

    if (npm.time && pnpm.time) {
      const timeDiff = npm.time - pnpm.time;
      const timeSavings = (timeDiff / npm.time) * 100;

      console.log(`📈 Install Time:`);
      console.log(`   npm:  ${this.formatTime(npm.time)}`);
      console.log(`   pnpm: ${this.formatTime(pnpm.time)}`);
      console.log(`   💡 pnpm is ${timeSavings.toFixed(1)}% faster!`);
    }

    if (npm.diskUsage && pnpm.diskUsage) {
      const sizeDiff = npm.diskUsage - pnpm.diskUsage;
      const sizeSavings = (sizeDiff / npm.diskUsage) * 100;

      console.log(`\n💾 Disk Usage:`);
      console.log(`   npm:  ${this.formatSize(npm.diskUsage)}`);
      console.log(`   pnpm: ${this.formatSize(pnpm.diskUsage)}`);

      if (sizeSavings > 0) {
        console.log(
          `   💡 pnpm saves ${this.formatSize(sizeDiff)} (${sizeSavings.toFixed(
            1
          )}%)`
        );
      } else {
        console.log(
          `   💡 npm saves ${this.formatSize(Math.abs(sizeDiff))} (${Math.abs(
            sizeSavings
          ).toFixed(1)}%)`
        );
      }
    }

    console.log(`\n🎯 Key Benefits of pnpm:`);
    console.log(`   ✅ Faster installs due to content-addressable store`);
    console.log(`   ✅ Saves disk space with global package cache`);
    console.log(`   ✅ Stricter dependency resolution`);
    console.log(`   ✅ Better monorepo support`);
    console.log(`   ✅ No phantom dependencies`);
    console.log("\n═".repeat(50));
  }

  async run() {
    console.log("🚀 KobKlein Package Manager Benchmark");
    console.log("Testing npm vs pnpm performance...");

    // Test npm first
    await this.benchmarkPackageManager("npm");

    // Test pnpm
    await this.benchmarkPackageManager("pnpm");

    // Show comparison
    this.displayComparison();

    // Clean up and install with pnpm for development
    console.log("\n🔧 Setting up development environment with pnpm...");
    execSync("rm -rf node_modules package-lock.json", { stdio: "pipe" });
    execSync("pnpm install", { stdio: "inherit" });

    console.log("\n✅ Benchmark complete! Ready for development with pnpm.");
  }
}

// Run benchmark if this script is executed directly
if (require.main === module) {
  const benchmark = new PerformanceBenchmark();
  benchmark.run().catch(console.error);
}

module.exports = PerformanceBenchmark;
