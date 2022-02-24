/** @param {NS} ns **/
export async function main(ns) {

    var baseName = ns.args[0]
    var botCount = ns.args[1]
    var ram = 1024

    for (let i = 0; i < botCount; i++) {
        let botName = baseName
        await ns.purchaseServer(botName, ram)
    }
}