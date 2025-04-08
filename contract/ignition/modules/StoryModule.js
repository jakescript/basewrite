const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StoryModule", (m) => {
  const story = m.contract("Story", ['0xD5dE1B114A7141604E7f7d12040Bf63BAfD74004']);
  return { story };
});
