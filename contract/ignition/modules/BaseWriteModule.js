const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BaseWriteModule", (m) => {
  const baseWrite = m.contract("BaseWrite", ['0x6aa3c125d9654abc388cE4B12097a5096bB31323']);
  return { baseWrite };
});
