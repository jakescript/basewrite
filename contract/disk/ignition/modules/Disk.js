const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DiskModule", (m) => {
  const disk = m.contract("Disk", [100]);
  return { disk };
});
