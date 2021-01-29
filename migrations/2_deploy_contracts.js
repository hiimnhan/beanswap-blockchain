const Bean = artifacts.require('Bean');

module.exports = async function(deployer) {
    await deployer.deploy(Bean);
}