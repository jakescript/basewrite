const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DiskModule", (m) => {
  const disk = m.contract("Disk");
  return { disk };
});
