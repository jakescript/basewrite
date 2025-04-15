const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BaseWriteModule", (m) => {
  const baseWrite = m.contract("BaseWrite", ['0xaB38B7cd4F8666E12f1d1DeD2312dbD51E4E3EfA']);
  return { baseWrite };
});
